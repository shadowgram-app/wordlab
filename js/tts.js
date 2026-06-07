/* ============================================================
   WordLab · TTS 발음 듣기 (Web Speech API)
   서버·API 키 불필요. 버튼 클릭 트리거라 모바일 자동재생 차단과 무관.
   ============================================================ */
function speak(text){
  try{
    if(!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.95;
    // 가능하면 영어 음성 우선 선택
    const voices = speechSynthesis.getVoices();
    const en = voices.find(v=>/en[-_]US/i.test(v.lang)) || voices.find(v=>/^en/i.test(v.lang));
    if(en) u.voice = en;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }catch(e){ /* 미지원 브라우저는 무시 */ }
}

/* 일부 브라우저는 voices가 비동기 로드됨 — 미리 워밍 */
if('speechSynthesis' in window){
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = ()=>speechSynthesis.getVoices();
}

/* 🔊 버튼 HTML 생성 헬퍼. small=true 면 작은 버튼 */
function speakerBtn(word, small){
  const cls = small ? 'spk sm' : 'spk';
  return `<button class="${cls}" title="발음 듣기" aria-label="발음 듣기"
    onclick="event.stopPropagation();speak('${word.replace(/'/g,"\\'")}')">🔊</button>`;
}
