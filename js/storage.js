/* ============================================================
   WordLab · 진도 저장 어댑터
   - 식별자: 이메일 (인증 없음)
   - 1순위: Supabase 'progress' 테이블 (기기 무관 동기화 + 관리자 대시보드)
   - 2순위(폴백): localStorage (Supabase 미설정 시 또는 네트워크 실패 시)
   진도 객체 shape:
     { known:{word:bool}, quiz_score:int, dict_score:int, level:'L3' }
   ============================================================ */
const Storage = (function(){
  let email = null;
  const lsKey = e => 'wordlab:'+ (e||email);

  function setEmail(e){ email = (e||'').trim().toLowerCase(); }
  function getEmail(){ return email; }

  function emptyProgress(){
    return { known:{}, quiz_score:0, dict_score:0, level: ACTIVE_LEVEL };
  }

  /* ---- localStorage ---- */
  function lsLoad(){
    try{ const r = localStorage.getItem(lsKey()); return r ? JSON.parse(r) : null; }
    catch(e){ return null; }
  }
  function lsSave(p){
    try{ localStorage.setItem(lsKey(), JSON.stringify(p)); }catch(e){}
  }
  function lsDelete(){
    try{ localStorage.removeItem(lsKey()); }catch(e){}
  }

  /* ---- Supabase ---- */
  async function supaLoad(){
    if(!window.supa) return null;
    const { data, error } = await window.supa
      .from('progress').select('*').eq('email', email).maybeSingle();
    if(error){ console.warn('[Storage] supaLoad', error.message); return null; }
    if(!data) return null;
    return {
      known: data.known || {},
      quiz_score: data.quiz_score || 0,
      dict_score: data.dict_score || 0,
      level: data.level || ACTIVE_LEVEL,
    };
  }
  async function supaSave(p){
    if(!window.supa) return false;
    const known_count = Object.keys(p.known||{}).filter(k=>p.known[k]).length;
    const row = {
      email,
      known: p.known || {},
      known_count,
      quiz_score: p.quiz_score || 0,
      dict_score: p.dict_score || 0,
      level: p.level || ACTIVE_LEVEL,
      updated_at: new Date().toISOString(),
    };
    const { error } = await window.supa.from('progress').upsert(row, { onConflict: 'email' });
    if(error){ console.warn('[Storage] supaSave', error.message); return false; }
    return true;
  }

  /* ---- public ---- */
  // 로그인 시 호출: 원격 우선 로드, 없으면 로컬, 둘 다 없으면 빈 진도
  async function login(e){
    setEmail(e);
    let p = null;
    if(window.supa){
      p = await supaLoad();
      if(p) lsSave(p);          // 로컬 캐시도 갱신
    }
    if(!p) p = lsLoad();
    if(!p) p = emptyProgress();
    return p;
  }

  // 저장: 로컬에 즉시 기록 + Supabase에 비동기 동기화
  async function save(p){
    lsSave(p);
    if(window.supa){ supaSave(p); }   // 실패해도 로컬은 남음
    return true;
  }

  async function reset(){
    lsDelete();
    if(window.supa){
      try{ await window.supa.from('progress').delete().eq('email', email); }catch(e){}
    }
  }

  return { setEmail, getEmail, login, save, reset, emptyProgress,
           supaEnabled: ()=>!!window.supa };
})();
