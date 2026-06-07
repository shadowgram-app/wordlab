/* ============================================================
   WordLab · 메인 앱 부트스트랩 (200단어 · 어원·SRS)
   이메일 식별 → 진도 로드 → 범위 선택 → 5모드 학습 → 진도 저장
   ============================================================ */
const $  = s => document.querySelector(s);
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };

const WORDS = getWords();
const TOTAL = WORDS.length;
const DAYS  = getDayCount();
const BYWORD = {}; WORDS.forEach(o=>BYWORD[o.w]=o);
const wordObj = w => BYWORD[w];

const App = {
  progress: Storage.emptyProgress(),
  scope: { type:'day', day:1 },
  state: {},

  async save(){ await Storage.save(App.progress); },

  // 현재 범위의 단어 객체 배열
  scopeWords(){
    if(App.scope.type==='all') return WORDS;
    if(App.scope.type==='day') return getDayIndices(App.scope.day).map(i=>WORDS[i]);
    return WORDS;
  },

  updateStats(){
    const c = SRS.counts(App.progress.known, WORDS);
    const pf = $('#pfill'); if(pf) pf.style.width = (c.learned/TOTAL*100)+'%';
    const pt = $('#ptext'); if(pt) pt.textContent = c.learned+' / '+TOTAL;
    const st = $('#stat');
    if(st) st.innerHTML =
      '학습 <b>'+c.seen+'</b> · 익힘 <b>'+c.learned+'</b> · 마스터 <b>'+c.mastered+'</b> · 복습대기 <b>'+c.due+'</b> · 오답 <b>'+c.weak+'</b>';
    // 탭 배지
    const dueB=$('#badgeSrs'), weakB=$('#badgeWeak');
    if(dueB) dueB.textContent = c.due ? c.due : '';
    if(weakB) weakB.textContent = c.weak ? c.weak : '';
  },
};

function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1700); }

/* ---------------- 이메일 로그인 ---------------- */
function validEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function showLogin(){ $('#loginView').classList.remove('hidden'); $('#appView').classList.add('hidden'); const i=$('#emailInput'); i.value=''; i.focus(); }

async function doLogin(){
  const e = $('#emailInput').value.trim().toLowerCase();
  const err=$('#loginErr');
  if(!validEmail(e)){ err.textContent='올바른 이메일 형식을 입력해 주세요.'; return; }
  err.textContent='';
  const btn=$('#loginBtn'); btn.disabled=true; btn.textContent='불러오는 중…';
  App.progress = await Storage.login(e);
  if(!App.progress.known || typeof App.progress.known!=='object') App.progress.known={};
  btn.disabled=false; btn.textContent='시작하기';
  enterApp(e);
}
function enterApp(email){
  $('#loginView').classList.add('hidden');
  $('#appView').classList.remove('hidden');
  $('#whoami').textContent = email;
  const sync=$('#syncState');
  if(Storage.supaEnabled()){ sync.textContent='● 클라우드 동기화 켜짐'; sync.className='synced'; }
  else{ sync.textContent='● 이 기기에만 저장 (오프라인 모드)'; sync.className='synced off'; }
  buildScopeSelect();
  App.updateStats();
  switchMode('flash');
}
function logout(){ Storage.setEmail(''); App.progress = Storage.emptyProgress(); showLogin(); }

/* ---------------- 범위(Day) 선택 ---------------- */
function buildScopeSelect(){
  const sel=$('#scopeSel'); if(!sel) return;
  let html='';
  for(let d=1; d<=DAYS; d++){
    const a=(d-1)*getPerDay()+1, b=Math.min(d*getPerDay(), TOTAL);
    html += `<option value="day:${d}">Day ${d} (${a}–${b})</option>`;
  }
  html += `<option value="all">전체 ${TOTAL}단어</option>`;
  sel.innerHTML = html;
  sel.value = App.scope.type==='all' ? 'all' : 'day:'+App.scope.day;
  sel.onchange = ()=>{
    const v=sel.value;
    if(v==='all') App.scope={type:'all'};
    else App.scope={type:'day', day:parseInt(v.split(':')[1],10)};
    // 현재 모드 다시 시작
    switchMode(App.state.mode||'flash');
  };
}
function scopeLabel(){
  if(App.scope.type==='all') return '전체 '+TOTAL+'단어';
  const d=App.scope.day, a=(d-1)*getPerDay()+1, b=Math.min(d*getPerDay(),TOTAL);
  return 'Day '+d+' ('+a+'–'+b+')';
}

/* ---------------- 진도 코드 (선생님/학부모 공유) ---------------- */
function genCode(){
  const c = SRS.counts(App.progress.known, WORDS);
  const payload = { t:ACTIVE_LEVEL, email:Storage.getEmail(), learned:c.learned, mastered:c.mastered, total:TOTAL,
                    quiz:App.progress.quiz_score, dict:App.progress.dict_score, date:new Date().toISOString().slice(0,10) };
  $('#codeBox').textContent = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  toast('진도 코드를 만들었어요. 길게 눌러 복사하세요.');
}
function loadCode(){
  const v=$('#loadInput').value.trim(); if(!v){ toast('코드를 붙여넣어 주세요.'); return; }
  try{
    const d=JSON.parse(decodeURIComponent(escape(atob(v))));
    $('#codeBox').innerHTML=`<b>불러온 진도</b> · ${d.email||''} · ${d.date}<br>익힘 ${d.learned}/${d.total} · 마스터 ${d.mastered} · 퀴즈최고 ${d.quiz} · 받아쓰기최고 ${d.dict}`;
    toast('진도를 불러왔어요.');
  }catch(e){ toast('코드 형식이 올바르지 않아요.'); }
}
async function resetAll(){
  if(!confirm('이 학생('+Storage.getEmail()+')의 모든 진도를 초기화할까요?')) return;
  await Storage.reset();
  App.progress = Storage.emptyProgress();
  App.updateStats(); switchMode('flash');
  toast('진도를 초기화했어요.');
}

/* ---------------- 이벤트 + 초기화 ---------------- */
function bind(){
  $('#loginBtn').onclick = doLogin;
  $('#emailInput').addEventListener('keydown', e=>{ if(e.key==='Enter') doLogin(); });
  $('#logoutBtn').onclick = logout;
  document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>switchMode(t.dataset.mode));
  $('#genCode').onclick = genCode;
  $('#loadCode').onclick = loadCode;
  $('#resetAll').onclick = resetAll;
  const rt=$('#rootsToggle'); if(rt) rt.onclick=()=>$('#rootsPanel').classList.toggle('hidden');
}
document.addEventListener('DOMContentLoaded', ()=>{ bind(); buildRoots(); showLogin(); });

/* 어근·접두사 참고표 */
function buildRoots(){
  const el=$('#rootsPanel'); if(!el) return;
  el.innerHTML = '<table class="roots"><thead><tr><th>요소</th><th>의미</th><th>예시</th></tr></thead><tbody>'+
    ROOTS.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')+
    '</tbody></table>';
}
