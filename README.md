# WordLab · Level 3 수능 기본 어휘 암기 웹앱

고1 학생용 "Level 3 수능 기본 어휘 40개" 암기 웹앱.
플래시카드 · 4지선다 퀴즈 · 빈칸 받아쓰기 3모드 + 발음 듣기(TTS) + 이메일 식별 + 실시간 관리자 대시보드.

- **프론트엔드**: 정적 HTML/CSS/JS (GitHub Pages 무료 호스팅)
- **백엔드**: Supabase (학생 진도 저장 + 실시간 대시보드)
- **로그인**: 이메일 식별자 전용 (비밀번호·인증 메일 없음)

---

## 폴더 구조

```
wordlab/
├── index.html          # 메인 학습 앱 (이메일 로그인 → 3모드)
├── admin.html          # 관리자 실시간 대시보드 (비밀번호 게이트)
├── css/style.css       # 전체 스타일
├── js/
│   ├── config.js       # ⭐ Supabase URL/키 + 관리자 비밀번호 (배포 전 입력)
│   ├── words.js        # 단어 데이터 (LEVELS 구조 — Level 4 확장 대비)
│   ├── supabase.js     # Supabase 클라이언트 초기화
│   ├── storage.js      # 진도 저장 (Supabase + localStorage 폴백)
│   ├── tts.js          # 발음 듣기 (Web Speech API)
│   ├── modes.js        # 3모드 렌더/로직
│   └── app.js          # 부트스트랩 · 이메일 로그인 · 진도 코드
├── supabase/schema.sql # DB 테이블 + RLS
├── .nojekyll           # GitHub Pages용 (js/ 폴더 그대로 서빙)
└── README.md
```

---

## 빠른 시작 (로컬 테스트)

Supabase 없이도 **바로 동작**합니다 (이 기기에만 저장되는 오프라인 모드).

```bash
cd wordlab
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

> `file://` 로 직접 열어도 되지만, 일부 브라우저에서 모듈/스크립트 제약이 있어 로컬 서버 사용을 권장합니다.

---

## 배포 (3단계)

### 1) Supabase 설정 (실시간 대시보드를 쓰려면 필수)

1. [supabase.com](https://supabase.com) → 새 프로젝트 생성
2. **SQL Editor** → `supabase/schema.sql` 내용 붙여넣고 **RUN**
3. **Project Settings → API** 에서 두 값 복사:
   - `Project URL`
   - `anon` / `public` key
4. `js/config.js` 를 열어 채우기:

```js
window.WORDLAB_CONFIG = {
  SUPABASE_URL:      "https://xxxx.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGci...(긴 키)",
  ADMIN_PASSWORD:    "원하는-관리자-비밀번호",
};
```

> 비워두면 자동으로 localStorage 전용 모드로 동작합니다(기기 간 동기화·대시보드 미작동).

### 2) GitHub 레포에 푸시

`shadowgram-app` 조직에 `wordlab` 레포를 만든 뒤:

```bash
cd wordlab
git init
git add .
git commit -m "WordLab Level 3 어휘 앱 초기 버전"
git branch -M main
git remote add origin https://github.com/shadowgram-app/wordlab.git
git push -u origin main
```

> ⚠ 이 어시스턴트는 GitHub 로그인·레포 생성·푸시를 대신 수행할 수 없습니다. 위 명령은 운영자가 직접 실행하세요.

### 3) GitHub Pages 켜기

레포 **Settings → Pages** → Source: `Deploy from a branch` → Branch: `main` / `/ (root)` → Save.
약 1분 후 배포 주소:

```
https://shadowgram-app.github.io/wordlab/          ← 학생용
https://shadowgram-app.github.io/wordlab/admin.html ← 관리자용
```

---

## 사용 흐름

**학생**: 이메일 입력 → 3모드 학습 → 진도 자동 저장. 다음에 같은 이메일로 들어오면 이어서.
**선생님/운영자**: `admin.html` 접속 → 비밀번호 입력 → 모든 학생 진도가 실시간 표로 표시(익힌 단어·퀴즈/받아쓰기 최고점·최근 활동). 이메일 검색·열 정렬 가능.
**오프라인 폴백**: Supabase 미설정 시에도 학생이 "진도 코드"를 만들어 전달하면 관리자가 코드로 확인 가능.

---

## 보안 메모 (꼭 읽어주세요)

이 앱은 **인증 없는 식별자 방식**입니다. 이메일을 ID로만 쓰고 비밀번호가 없습니다.
구조상 `anon` 키(공개 키)로 진도 테이블을 읽고 씁니다 → **저장 데이터(이메일 + 단어 암기 진도)는 사실상 공개 수준**입니다.
단어 암기 진도라는 낮은 민감도 데이터에 맞춘 의도된 트레이드오프입니다. 민감 정보(실명·연락처 등)는 저장하지 마세요.

**보안 업그레이드 경로 (필요해질 때):**
1. **관리자 비밀번호**는 `config.js`에 평문으로 들어갑니다 → 가벼운 잠금일 뿐입니다. 진짜 보호가 필요하면 Supabase **Auth(매직링크)** + **RLS(본인 행만 접근)** 로 전환하고, 관리자 조회는 **Edge Function**(service_role 서버측)으로 옮기세요.
2. **service_role 키는 절대 클라이언트(config.js·HTML)에 넣지 마세요.** anon 키만 사용합니다.
3. 학생 데이터 보호를 강화하려면 테이블 직접 접근(RLS)을 막고, 저장/조회를 `SECURITY DEFINER` RPC 함수로 감싸는 방법도 있습니다(대시보드는 실시간 구독 대신 주기적 새로고침으로 전환).

---

## 확장: Level 4 단어장 추가

`js/words.js` 의 `LEVELS` 객체에 `L4` 를 추가하고 `ACTIVE_LEVEL` 을 바꾸면 됩니다.

```js
const LEVELS = {
  L3: { code:"L3", label:"Level 3 · 수능 기본 어휘", words:[ ... ] },
  L4: { code:"L4", label:"Level 4 · ...", words:[ ... ] },   // ← 추가
};
const ACTIVE_LEVEL = "L4";  // 또는 로그인 단계에서 레벨 선택 UI 추가
```

진도는 이메일+`level` 로 구분되어 저장되므로 레벨별 진도가 섞이지 않습니다.

---

## 기술 메모

- **TTS**: 브라우저 내장 `window.speechSynthesis` (Web Speech API) — 서버·API 키 불필요. 버튼 클릭 트리거라 모바일 자동재생 차단과 무관.
- **저장**: 로컬 즉시 저장 + Supabase 비동기 업서트(이메일 onConflict). 네트워크 실패해도 로컬엔 남습니다.
- **실시간**: Supabase Realtime `postgres_changes` 구독 — 학생이 진도를 저장하는 순간 대시보드 행이 갱신·하이라이트됩니다.
