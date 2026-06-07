# WordLab · 수능 기본 어휘 1단계 (어원·구조 200)

고1 학생용 어휘 암기 웹앱. **어원·구조 분석 200단어**를 최신 암기법으로 학습합니다.

- **어원 카드**: 단어를 통째로 외우지 않고 접두사·어근·접미사 구조로 이해
- **간격 반복(SRS)**: Anki식 — 틀린 단어는 자주, 아는 단어는 간격을 늘려 복습 (장기 기억에 가장 효과적)
- **랜덤 4지선다 / 빈칸 받아쓰기**: 능동적 인출(active recall) 테스트
- **오답·약점 집중복습**: 틀린 단어만 모아 복습
- **Day별 학습**: 20일 구성(하루 10단어) · 발음 듣기(TTS) · 이메일 식별 · 실시간 관리자 대시보드

배포: GitHub Pages(정적 프론트) + Supabase(진도 저장·실시간 대시보드).

---

## 폴더 구조

```
wordlab/
├── index.html          # 메인 학습 앱
├── admin.html          # 관리자 실시간 대시보드 (비밀번호 게이트)
├── css/style.css       # 전체 스타일
├── js/
│   ├── config.js       # Supabase URL/키 + 관리자 비밀번호
│   ├── words.js        # 200단어 데이터(LEVELS 구조) + 어근·접두사 표
│   ├── srs.js          # 간격 반복(SRS) 엔진 — Leitner 박스
│   ├── supabase.js     # Supabase 클라이언트
│   ├── storage.js      # 진도 저장 (Supabase + localStorage 폴백)
│   ├── tts.js          # 발음 듣기 (Web Speech API)
│   ├── modes.js        # 5모드 렌더 (플래시카드·SRS·4지선다·받아쓰기·오답)
│   └── app.js          # 부트스트랩·로그인·범위(Day) 선택·통계
├── supabase/schema.sql # DB 테이블 + RLS + Realtime
└── README.md
```

## 데이터 스키마 (`words.js`)

각 단어: `{ w 단어, pron 발음, pos 품사, mean 뜻, struct 어원·구조, ex 예문, exKo 해석 }`
10단어 = 1 Day. 진도(SRS 상태)는 단어별로 `{box, due, seen, ok, miss}`로 저장됩니다.

## 학습 흐름

1. **이메일 입력** → 진도가 그 이메일로 저장됨(기기 무관 이어보기)
2. **학습 범위(Day)** 선택 → 플래시카드로 어원과 함께 학습(알아요/몰라요)
3. **복습(SRS)**: 예정된 단어를 자동으로 띄워 복습 → 정답이면 간격이 늘어남
4. **4지선다·받아쓰기**로 테스트 (틀리면 자동으로 오답·SRS에 반영)
5. **오답**: 약점 단어만 집중 복습
6. 선생님·학부모: `admin.html`에서 전체 학생 진도를 실시간 확인

---

## 배포 (현재 라이브)

- 학생용: https://shadowgram-app.github.io/wordlab/
- 관리자용: https://shadowgram-app.github.io/wordlab/admin.html · 비밀번호: `config.js`의 `ADMIN_PASSWORD`

### 코드 수정 후 재배포
GitHub Desktop에서 변경 파일 **Commit to main → Push origin** → 약 1분 뒤 자동 재배포.

### Supabase (이미 연결됨)
- 프로젝트 `wordlab` (Seoul) · `progress` 테이블 + RLS + Realtime 설정 완료
- `config.js`에 Project URL + publishable 키 입력됨
- 새 단어장/스키마 변경 시 `supabase/schema.sql`을 SQL Editor에서 실행

---

## 보안 메모

인증 없는 **이메일 식별자 방식** + 공개 레포라, publishable 키와 `ADMIN_PASSWORD`가 소스에 노출됩니다(낮은 민감도 데이터 전제). publishable 키는 RLS로 보호되어 공개해도 안전합니다. 실명·연락처 등 민감 정보는 저장하지 마세요. 강화하려면 Supabase Auth(매직링크) + 본인 행 RLS + 관리자용 Edge Function으로 전환하세요.

## 확장: 2단계(Stage 2) 단어장 추가

`js/words.js`의 `LEVELS`에 `S2`를 추가하고 `ACTIVE_LEVEL`을 바꾸면 됩니다. 진도는 이메일+`level`로 구분되어 저장됩니다.

```js
const LEVELS = {
  S1: { code:"S1", label:"...", perDay:10, words:[ ... ] },
  S2: { code:"S2", label:"...", perDay:10, words:[ ... ] },  // ← 추가
};
const ACTIVE_LEVEL = "S2";
```
