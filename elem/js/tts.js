/* ============================================================
   WordLab · TTS 발음 듣기 — 로컬 MP3 우선(안드로이드 포함 모든 기기 확실히 동작)
   1) audio/<slug>.mp3 (미리 생성한 gTTS 음성)을 재생
   2) 파일이 없으면 Web Speech API 로 폴백
   slug 규칙: 소문자 + 영숫자 외 문자는 '_' (예: "ice cream" → "ice_cream")
   ============================================================ */
(function(){
  // Web Speech 폴백용 음성 미리 로드(안드로이드는 처음에 빈 배열)
  if('speechSynthesis' in window){
    try{ window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged=()=>window.speechSynthesis.getVoices(); }catch(e){}
  }
})();

function _ttsSlug(t){ return String(t).toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,''); }
function _ttsAudioBase(){ return (window.WORDLAB_CONFIG && window.WORDLAB_CONFIG.AUDIO_BASE) || 'audio/'; }

function _speakSynth(text){
  if(!('speechSynthesis' in window)) return;
  try{
    const s=window.speechSynthesis; s.cancel();
    const u=new SpeechSynthesisUtterance(text); u.lang='en-US'; u.rate=0.9;
    const v=s.getVoices()||[]; const en=v.find(x=>/^en[-_]?US/i.test(x.lang))||v.find(x=>/^en/i.test(x.lang));
    if(en) u.voice=en;
    s.speak(u); if(s.paused) s.resume();
  }catch(e){}
}

let _ttsAudio=null;
function speak(text){
  if(!text) return; text=String(text);
  try{
    if(_ttsAudio){ try{ _ttsAudio.pause(); }catch(e){} }
    const a=new Audio(_ttsAudioBase()+_ttsSlug(text)+'.mp3');
    a.addEventListener('error', ()=>_speakSynth(text));   // 파일 없거나 로드 실패 → Web Speech 폴백
    const p=a.play();
    if(p && p.catch) p.catch(()=>{});                      // 사용자 동작 밖 자동재생 차단 등은 무시
    _ttsAudio=a;
  }catch(e){ _speakSynth(text); }
}

/* 🔊 버튼 HTML 생성 헬퍼. small=true 면 작은 버튼 */
function speakerBtn(word, small){
  const cls = small ? 'spk sm' : 'spk';
  const w = String(word).replace(/'/g,"\\'");
  return `<button type="button" class="${cls}" title="발음 듣기" aria-label="발음 듣기"
    onclick="event.stopPropagation();speak('${w}')">🔊</button>`;
}
