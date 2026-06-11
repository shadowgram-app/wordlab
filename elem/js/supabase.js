/* ============================================================
   WordLab · Supabase 클라이언트
   index.html / admin.html 에서 CDN으로 supabase-js 를 먼저 로드한 뒤
   이 파일이 전역 client 를 만듭니다. (설정이 비어 있으면 null)
   ============================================================ */
window.supa = null;
(function(){
  if(!window.SUPA_ENABLED) return;            // 설정 없으면 로컬 전용 모드
  if(!window.supabase || !window.supabase.createClient){
    console.warn('[WordLab] supabase-js 가 로드되지 않았습니다. CDN 스크립트를 확인하세요.');
    return;
  }
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.WORDLAB_CONFIG;
  window.supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
    realtime: { params: { eventsPerSecond: 5 } },
  });
})();
