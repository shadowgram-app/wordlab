/* ============================================================
   WordLab 초등 · 설정
   Supabase는 상위 앱과 같은 프로젝트를 재사용하되, 진도는 별도 테이블(progress_elem)에 저장.
   ============================================================ */
window.WORDLAB_CONFIG = {
  SUPABASE_URL:      "https://jjobkbqjykwmvfpdkpoo.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_zBAwLN-3Z7t33ZaD0SggSQ_FK-6RHCz",   // publishable 키(공개 안전)
  ADMIN_PASSWORD:    "3894",            // 학부모·선생님 비밀번호
  TABLE:             "progress_elem",   // ★ 초등용 별도 테이블
};
window.SUPA_ENABLED = !!(window.WORDLAB_CONFIG.SUPABASE_URL && window.WORDLAB_CONFIG.SUPABASE_ANON_KEY);
