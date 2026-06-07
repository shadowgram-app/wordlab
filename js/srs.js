/* ============================================================
   WordLab · SRS (간격 반복) 엔진  —  Leitner 박스 방식
   단어별 상태를 progress.known[word] 에 저장:
     { box, due, seen, ok, miss }
     box  : 0(새 단어) ~ 5(마스터)
     due  : 다음 복습 예정 시각(ms)
   정답 → 박스 +1, 간격 늘림 / 오답 → 박스 1로 리셋, 곧 다시 복습
   ============================================================ */
const SRS = (function(){
  const DAY = 24*60*60*1000;
  const MAX_BOX = 5;
  // 정답으로 도달한 박스 → 다음 복습까지 일수
  const INTERVAL_DAYS = { 1:1, 2:3, 3:7, 4:16, 5:35 };
  const LEARNED_BOX = 3;   // 익힘 기준
  const MASTER_BOX  = 5;   // 마스터 기준

  function blank(){ return { box:0, due:0, seen:0, ok:0, miss:0 }; }
  function get(known, w){
    const s = known[w];
    if(!s || typeof s !== 'object') return blank();
    return { box:s.box||0, due:s.due||0, seen:s.seen||0, ok:s.ok||0, miss:s.miss||0 };
  }

  // 채점 반영. good=true 정답 / false 오답. known 객체를 직접 수정.
  function rate(known, w, good){
    const s = get(known, w);
    s.seen++;
    const now = Date.now();
    if(good){
      s.ok++;
      s.box = Math.min(s.box+1, MAX_BOX);
      s.due = now + (INTERVAL_DAYS[s.box]||1)*DAY;
    }else{
      s.miss++;
      s.box = 1;
      s.due = now + Math.round(0.007*DAY);   // 약 10분 뒤(이번 세션 재출제 방지, 곧 복습)
    }
    known[w] = s;
    return s;
  }

  const isSeen     = s => s.box>=1 || s.seen>0;
  const isLearned  = s => s.box>=LEARNED_BOX;
  const isMastered = s => s.box>=MASTER_BOX;
  const isDue      = (s, now) => s.box>=1 && s.due<=(now||Date.now());
  const isWeak     = s => s.seen>0 && (s.miss>0 || s.box<=2);

  // 복습 예정(due) 단어 목록 — 가장 오래된(가장 급한) 순
  function dueList(known, words){
    const now = Date.now();
    return words
      .map(o=>o.w)
      .filter(w=>isDue(get(known,w), now))
      .sort((a,b)=>get(known,a).due - get(known,b).due);
  }
  // 약점(오답) 단어 목록 — 가장 약한 순
  function weakList(known, words){
    return words
      .map(o=>o.w)
      .filter(w=>isWeak(get(known,w)))
      .sort((a,b)=>get(known,a).box - get(known,b).box);
  }
  // 다음 복습 예정 시각(ms) — 아직 안 끝난 것 중 가장 이른
  function nextDue(known, words){
    const now = Date.now();
    let min = Infinity;
    for(const o of words){ const s=get(known,o.w); if(s.box>=1 && s.due>now) min=Math.min(min, s.due); }
    return min===Infinity ? 0 : min;
  }

  function counts(known, words){
    const now = Date.now();
    let seen=0, learned=0, mastered=0, due=0, weak=0, fresh=0;
    for(const o of words){
      const s = get(known, o.w);
      if(isSeen(s)) seen++; else fresh++;
      if(isLearned(s)) learned++;
      if(isMastered(s)) mastered++;
      if(isDue(s, now)) due++;
      if(isWeak(s)) weak++;
    }
    return { total:words.length, seen, learned, mastered, due, weak, fresh };
  }

  // 대시보드/진도 저장용 "익힌 단어 수"
  function masteredCount(known, words){
    let n=0; for(const o of words){ if(isLearned(get(known,o.w))) n++; } return n;
  }

  return { get, rate, isSeen, isLearned, isMastered, isDue, isWeak,
           dueList, weakList, nextDue, counts, masteredCount,
           LEARNED_BOX, MASTER_BOX, MAX_BOX };
})();
