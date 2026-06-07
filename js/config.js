/* ============================================================
   WordLab · 설정 파일
   ↓↓↓ 배포 전 이 세 값만 채우면 됩니다 ↓↓↓
   ============================================================

   1) Supabase 대시보드 → Project Settings → API 에서 복사
      - SUPABASE_URL      : Project URL          (예: https://abcd1234.supabase.co)
      - SUPABASE_ANON_KEY : anon / public key    (긴 문자열)

      ※ anon 키는 클라이언트에 공개되는 키가 맞습니다. (service_role 키는 절대 넣지 마세요)
      ※ 두 값을 비워두면 앱은 자동으로 'localStorage 전용 모드'로 동작합니다.
        (Supabase 없이도 이 기기에서 바로 테스트 가능 — 단 기기 간 동기화·관리자 대시보드는 미작동)

   2) ADMIN_PASSWORD : 관리자(admin.html) 진입 비밀번호. 원하는 값으로 바꾸세요.
      ※ 정적 사이트 특성상 클라이언트 측 가벼운 잠금입니다. 보안 강화는 README 참고.
   ============================================================ */
window.WORDLAB_CONFIG = {
  SUPABASE_URL:      "",   // ← 여기에 Project URL
  SUPABASE_ANON_KEY: "",   // ← 여기에 anon public key
  ADMIN_PASSWORD:    "wordlab-admin",   // ← 관리자 비밀번호 (변경 권장)
};

/* Supabase 설정 여부 */
window.SUPA_ENABLED = !!(window.WORDLAB_CONFIG.SUPABASE_URL && window.WORDLAB_CONFIG.SUPABASE_ANON_KEY);
