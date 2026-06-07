/* ============================================================
   WordLab · TTS 발음 듣기 (Web Speech API)  — 모바일(안드로이드/iOS) 보강판
   서버·API 키 불필요. 버튼 클릭(사용자 동작) 트리거.
   안드로이드 Chrome 대응:
   - 음성 목록 비동기 로딩(voiceschanged) 처리
   - 첫 사용자 동작에서 무음 utterance로 엔진 잠금 해제(unlock)
   - 일시정지(paused) 상태 자동 resume
   - 영어 로컬 음성 우선 선택, 없으면 lang으로 자동
   ============================================================ */
(function(){
  if(!('speechSynthesis' in window)) return;
  // 음성 목록 미리 로드(안드로이드는 처음엔 빈 배열)
  let _voices = [];
  function refreshVoices(){ _voices = window.speechSynthesis.getVoices() || []; }
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
  window.__getVoices = ()=> (_voices.length ? _voices : (refreshVoices(), _voices));

  // 첫 사용자 동작에서 TTS 엔진 잠금 해제(모바일 자동재생 차단 우회)
  let _unlocked = false;
  function unlockTTS(){
    if(_unlocked) return;
    _unlocked = true;
    try{
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0; u.rate = 1;
      window.speechSynthesis.speak(u);
    }catch(e){}
  }
  window.__ttsUnlocked = ()=>_unlocked;
  document.addEventListener('touchstart', unlockTTS, { once:true, passive:true });
  document.addEventListener('pointerdown', unlockTTS, { once:true });
  document.addEventListener('click', unlockTTS, { once:true });
})();

function speak(text){
  if(!('speechSynthesis' in window) || !text) return;
  const synth = window.speechSynthesis;
  try{
    // 진행 중 음성 정리 (안드로이드 cancel→speak 버그 대비: cancel 후 바로 speak)
    if(synth.speaking || synth.pending) synth.cancel();
    const u = new SpeechSynthesisUtterance(String(text));
    u.lang = 'en-US';
    u.rate = 0.95;
    const v = (window.__getVoices ? window.__getVoices() : synth.getVoices()) || [];
    // 영어 로컬 음성 우선 → 일반 en-US → 아무 영어 음성 (없으면 lang으로 자동)
    const en = v.find(x=>/^en[-_]?US/i.test(x.lang) && x.localService)
            || v.find(x=>/^en[-_]?US/i.test(x.lang))
            || v.find(x=>/^en/i.test(x.lang));
    if(en) u.voice = en;
    synth.speak(u);
    // 일부 Chrome(안드로이드 포함)에서 paused 로 멈추는 현상 방지
    if(synth.paused) synth.resume();
  }catch(e){ /* 미지원/오류는 무시 */ }
}

/* 🔊 버튼 HTML 생성 헬퍼. small=true 면 작은 버튼 */
function speakerBtn(word, small){
  const cls = small ? 'spk sm' : 'spk';
  const w = String(word).replace(/'/g,"\\'");
  return `<button type="button" class="${cls}" title="발음 듣기" aria-label="발음 듣기"
    onclick="event.stopPropagation();speak('${w}')">🔊</button>`;
}
