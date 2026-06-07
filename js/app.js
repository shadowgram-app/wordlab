/* ============================================================
   WordLab · 메인 앱 부트스트랩
   이메일 식별 → 진도 로드 → 3모드 학습 → 진도 저장(이메일 키)
   ============================================================ */
const $  = s => document.querySelector(s);
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };

let WORDS = getWords();
let TOTAL = WORDS.length;

const App = {
  progress: Storage.emptyProgress(),
  state: { mode:'card', cardIdx:0, quizOrder:[], quizIdx:0, quizScoreCur:0, quizAnswered:false,
           dictOrder:[], dictIdx:0, dictScoreCur:0 },

  async save(){ await Storage.save(App.progress); },

  updateProgress(){
    const n = Object.keys(App.progress.known).filter(k=>App.progress.known[k]).length;
    $('#pfill').style.width = (n/TOTAL*100)+'%';
    $('#ptext').textContent = n+' / '+TOTAL;
    const stat=$('#stat');
    if(stat) stat.innerHTML = '익힌 단어 <b>'+n+'/'+TOTAL+'</b> · 퀴즈 최고점 <b>'+App.progress.quiz_score+'</b> · 받아쓰기 최고점 <b>'+App.progress.dict_score+'</b>';
  },
};

function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1700); }

/* ---------------- 이메일 로그인 게이트 ---------------- */
function validEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

function showLogin(){
  $('#loginView').classList.remove('hidden');
  $('#appView').classList.add('hidden');
  const inp=$('#emailInput'); inp.value=''; inp.focus();
}

async function doLogin(){
  const e = $('#emailInput').value.trim().toLowerCase();
  const err=$('#loginErr');
  if(!validEmail(e)){ err.textContent='올바른 이메일 형식을 입력해 주세요.'; return; }
  err.textContent='';
  $('#loginBtn').disabled=true; $('#loginBtn').textContent='불러오는 중…';
  App.progress = await Storage.login(e);
  // 진행 상태 초기화
  App.state = { mode:'card', cardIdx:0, quizOrder:[], quizIdx:0, quizScoreCur:0, quizAnswered:false,
                dictOrder:[], dictIdx:0, dictScoreCur:0 };
  $('#loginBtn').disabled=false; $('#loginBtn').textContent='시작하기';
  enterApp(e);
}

function enterApp(email){
  $('#loginView').classList.add('hidden');
  $('#appView').classList.remove('hidden');
  $('#whoami').textContent = email;
  const sync=$('#syncState');
  if(Storage.supaEnabled()){ sync.textContent='● 클라우드 동기화 켜짐'; sync.className='synced'; }
  else{ sync.textContent='● 이 기기에만 저장 (오프라인 모드)'; sync.className='synced off'; }
  App.updateProgress();
  switchMode('card');
}

function logout(){
  Storage.setEmail('');
  App.progress = Storage.emptyProgress();
  showLogin();
}

/* ---------------- 진도 코드 (관리자 폴백 · 방식 B) ---------------- */
function genCode(){
  const n = Object.keys(App.progress.known).filter(k=>App.progress.known[k]).length;
  const payload = { t:ACTIVE_LEVEL, email:Storage.getEmail(), known:n, total:TOTAL,
                    quiz:App.progress.quiz_score, dict:App.progress.dict_score,
                    date:new Date().toISOString().slice(0,10) };
  const code = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  $('#codeBox').textContent = code;
  toast('진도 코드를 만들었어요. 길게 눌러 복사하세요.');
}
function loadCode(){
  const v=$('#loadInput').value.trim();
  if(!v){ toast('코드를 붙여넣어 주세요.'); return; }
  try{
    const d=JSON.parse(decodeURIComponent(escape(atob(v))));
    $('#codeBox').innerHTML = `<b>불러온 진도</b> · ${d.email||''} · 날짜 ${d.date}<br>익힌 단어 ${d.known}/${d.total} · 퀴즈 최고 ${d.quiz} · 받아쓰기 최고 ${d.dict}`;
    toast('진도를 불러왔어요.');
  }catch(e){ toast('코드 형식이 올바르지 않아요.'); }
}
async function resetAll(){
  if(!confirm('이 학생('+Storage.getEmail()+')의 진도를 초기화할까요?')) return;
  await Storage.reset();
  App.progress = Storage.emptyProgress();
  App.updateProgress();
  if(App.state.mode==='card') renderCard();
  toast('진도를 초기화했어요.');
}

/* ---------------- 이벤트 바인딩 + 초기화 ---------------- */
function bind(){
  $('#loginBtn').onclick = doLogin;
  $('#emailInput').addEventListener('keydown', e=>{ if(e.key==='Enter') doLogin(); });
  $('#logoutBtn').onclick = logout;
  document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>switchMode(t.dataset.mode));
  $('#genCode').onclick = genCode;
  $('#loadCode').onclick = loadCode;
  $('#resetAll').onclick = resetAll;
}

document.addEventListener('DOMContentLoaded', ()=>{
  bind();
  showLogin();
});
