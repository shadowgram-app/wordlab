/* ============================================================
   WordLab 초등 · 진도 저장 어댑터 (Supabase 테이블명 설정 지원)
   - 식별자: 이메일 (인증 없음)
   - Supabase: window.WORDLAB_CONFIG.TABLE (기본 progress_elem)
   - 폴백: localStorage
   ============================================================ */
const Storage = (function(){
  let email = null;
  const TABLE = (window.WORDLAB_CONFIG && window.WORDLAB_CONFIG.TABLE) || 'progress';
  const lsPrefix = 'wordlab-elem:';
  const lsKey = e => lsPrefix + (e||email);

  function setEmail(e){ email = (e||'').trim().toLowerCase(); }
  function getEmail(){ return email; }
  function emptyProgress(){ return { known:{}, quiz_score:0, dict_score:0, level: ACTIVE_LEVEL }; }

  function learnedCount(known){
    let n=0;
    for(const k in (known||{})){
      const v=known[k];
      if(v===true) n++;
      else if(v && typeof v==='object' && (v.box||0)>=3) n++;
    }
    return n;
  }

  function lsLoad(){ try{ const r=localStorage.getItem(lsKey()); return r?JSON.parse(r):null; }catch(e){ return null; } }
  function lsSave(p){ try{ localStorage.setItem(lsKey(), JSON.stringify(p)); }catch(e){} }
  function lsDelete(){ try{ localStorage.removeItem(lsKey()); }catch(e){} }

  async function supaLoad(){
    if(!window.supa) return null;
    const { data, error } = await window.supa.from(TABLE).select('*').eq('email', email).maybeSingle();
    if(error){ console.warn('[Storage] supaLoad', error.message); return null; }
    if(!data) return null;
    return { known:data.known||{}, quiz_score:data.quiz_score||0, dict_score:data.dict_score||0, level:data.level||ACTIVE_LEVEL };
  }
  async function supaSave(p){
    if(!window.supa) return false;
    const row = {
      email, known:p.known||{}, known_count:learnedCount(p.known),
      quiz_score:p.quiz_score||0, dict_score:p.dict_score||0,
      level:p.level||ACTIVE_LEVEL, updated_at:new Date().toISOString(),
    };
    const { error } = await window.supa.from(TABLE).upsert(row, { onConflict:'email' });
    if(error){ console.warn('[Storage] supaSave', error.message); return false; }
    return true;
  }

  async function login(e){
    setEmail(e);
    let p=null;
    if(window.supa){ p=await supaLoad(); if(p) lsSave(p); }
    if(!p) p=lsLoad();
    if(!p) p=emptyProgress();
    return p;
  }
  async function save(p){ lsSave(p); if(window.supa){ supaSave(p); } return true; }
  async function reset(){
    lsDelete();
    if(window.supa){ try{ await window.supa.from(TABLE).delete().eq('email', email); }catch(e){} }
  }

  return { setEmail, getEmail, login, save, reset, emptyProgress, supaEnabled:()=>!!window.supa };
})();
