/* ============================================================
   WordLab · 학습 5모드
   flash 플래시카드(어원) · srs 간격복습 · quiz 4지선다 · dict 받아쓰기 · weak 오답복습
   전역: WORDS, TOTAL, $, shuffle, App, SRS, wordObj, scopeLabel
   ============================================================ */

/* ---- 공통 헬퍼 ---- */
function highlightEx(ex, w){
  try{ return ex.replace(new RegExp('\\b('+w+'\\w*)\\b','i'), '<b>$1</b>'); }
  catch(e){ return ex; }
}
function boxDots(w){
  const b = SRS.get(App.progress.known, w).box;
  let d=''; for(let i=1;i<=SRS.MAX_BOX;i++) d+=`<span class="dot${i<=b?' on':''}"></span>`;
  return `<span class="boxdots" title="암기 단계 ${b}/${SRS.MAX_BOX}">${d}</span>`;
}
function cardInner(o){
  return `
    <div class="fcInner">
      <div class="face front">
        <div class="wordrow"><div class="word">${o.w}</div>${speakerBtn(o.w)}</div>
        <div class="pron">${o.pron}</div>
        <div class="pos">${o.pos}.</div>
        <div class="hint">카드를 눌러 뜻·어원 보기</div>
      </div>
      <div class="face back">
        <div class="mean">${o.mean}</div>
        <div class="struct">🧩 ${o.struct}</div>
        <div class="ex">${highlightEx(o.ex,o.w)}</div>
        <div class="exko">${o.exKo}</div>
      </div>
    </div>`;
}
function emptyPanel(msg){ $('#panel').innerHTML = `<div class="done"><p style="color:#6c6256;font-size:16px">${msg}</p></div>`; }

/* ---------------- 플래시카드 (어원 학습) ---------------- */
function startFlash(){ App.state={mode:'flash', cardIdx:0}; renderFlash(); }
function renderFlash(){
  const list = App.scopeWords();
  if(!list.length){ emptyPanel('학습할 단어가 없습니다.'); return; }
  if(App.state.cardIdx>=list.length) App.state.cardIdx=list.length-1;
  const o = list[App.state.cardIdx];
  $('#panel').innerHTML = `
    <div class="scopetag">📖 ${scopeLabel()} · 플래시카드</div>
    <div class="fc" id="fc">${cardInner(o)}</div>
    ${boxDots(o.w)}
    <div class="know">
      <button class="btn again" id="again">아직 몰라요</button>
      <button class="btn good" id="good">알아요 ✓</button>
    </div>
    <div class="nav">
      <button class="btn" id="prev" ${App.state.cardIdx===0?'disabled':''}>← 이전</button>
      <span class="counter">${App.state.cardIdx+1} / ${list.length}</span>
      <button class="btn" id="next" ${App.state.cardIdx===list.length-1?'disabled':''}>다음 →</button>
    </div>`;
  const fc=$('#fc'); fc.onclick=()=>fc.classList.toggle('flip');
  $('#prev').onclick=()=>{ if(App.state.cardIdx>0){App.state.cardIdx--; renderFlash();} };
  $('#next').onclick=()=>{ if(App.state.cardIdx<list.length-1){App.state.cardIdx++; renderFlash();} };
  const rateAdv = async(good)=>{ SRS.rate(App.progress.known,o.w,good); await App.save(); App.updateStats();
    if(App.state.cardIdx<list.length-1){App.state.cardIdx++; renderFlash();} else { emptyPanel('한 바퀴 완료! 🎉 다른 Day를 고르거나 복습으로 넘어가 보세요.'); } };
  $('#good').onclick=(e)=>{ e.stopPropagation(); rateAdv(true); };
  $('#again').onclick=(e)=>{ e.stopPropagation(); rateAdv(false); };
}

/* ---------------- 간격 반복 (SRS 복습) ---------------- */
function startSrs(){
  const q = SRS.dueList(App.progress.known, WORDS);
  App.state = { mode:'srs', queue:q, done:0, total:q.length };
  renderSrs();
}
function renderSrs(){
  const q = App.state.queue;
  if(!q.length){
    const nd = SRS.nextDue(App.progress.known, WORDS);
    const c = SRS.counts(App.progress.known, WORDS);
    let when = nd ? new Date(nd).toLocaleString('ko-KR',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '아직 없음';
    if(App.state.done>0){
      emptyPanel(`오늘 복습 완료! 🎉 ${App.state.done}개를 복습했어요.<br><span style="font-size:13px">다음 복습 예정: ${when}</span>`);
    }else{
      emptyPanel(`지금 복습할 단어가 없어요.<br><span style="font-size:13px">플래시카드로 새 단어를 학습하면 SRS가 자동으로 복습 일정을 잡아줘요.<br>다음 복습 예정: ${when} · 익힘 ${c.learned}/${TOTAL}</span>`);
    }
    return;
  }
  const o = wordObj(q[0]);
  $('#panel').innerHTML = `
    <div class="scopetag">🔁 간격 반복 복습 · ${App.state.done}/${App.state.total}</div>
    <div class="fc" id="fc">${cardInner(o)}</div>
    ${boxDots(o.w)}
    <div class="know">
      <button class="btn again" id="again">몰라요</button>
      <button class="btn good" id="good">알아요 ✓</button>
    </div>
    <div class="hint" style="position:static;margin-top:8px">단어를 보고 뜻을 떠올린 뒤 카드를 눌러 확인하세요</div>`;
  const fc=$('#fc'); fc.onclick=()=>fc.classList.toggle('flip');
  const rate = async(good)=>{ SRS.rate(App.progress.known,o.w,good); await App.save(); App.updateStats();
    App.state.queue.shift(); App.state.done++; renderSrs(); };
  $('#good').onclick=(e)=>{ e.stopPropagation(); rate(true); };
  $('#again').onclick=(e)=>{ e.stopPropagation(); rate(false); };
}

/* ---------------- 4지선다 퀴즈 ---------------- */
function distractMeans(correct){
  const others = shuffle(WORDS.map(x=>x.mean));
  const res=[]; for(const m of others){ if(res.length>=3)break; if(m!==correct&&!res.includes(m))res.push(m);} return res;
}
function startQuiz(){
  const list=App.scopeWords();
  App.state={mode:'quiz', order:shuffle(list), idx:0, score:0, answered:false};
  renderQuiz();
}
function renderQuiz(){
  const S=App.state;
  if(S.idx>=S.order.length) return finishQuiz();
  const o=S.order[S.idx];
  const opts=shuffle([o.mean, ...distractMeans(o.mean)]);
  $('#panel').innerHTML=`
    <div class="scopetag">📝 ${scopeLabel()} · 4지선다 · ${S.idx+1}/${S.order.length}</div>
    <div class="qrow"><div class="qword">${o.w}</div>${speakerBtn(o.w)}</div>
    <div class="pron-c">${o.pron}</div>
    <div class="qprompt">알맞은 우리말 뜻을 고르세요</div>
    <div class="opts" id="opts"></div>
    <div class="nav"><span class="counter">현재 점수 ${S.score}</span><span></span></div>`;
  speak(o.w);
  const box=$('#opts');
  opts.forEach(m=>{
    const b=document.createElement('button'); b.className='opt'; b.textContent=m;
    b.onclick=async()=>{
      if(S.answered)return; S.answered=true;
      const all=box.querySelectorAll('.opt'); all.forEach(x=>x.disabled=true);
      const good = (m===o.mean);
      if(good){ b.classList.add('correct'); S.score++; }
      else{ b.classList.add('wrong'); all.forEach(x=>{ if(x.textContent===o.mean) x.classList.add('correct'); }); }
      SRS.rate(App.progress.known,o.w,good); await App.save(); App.updateStats();
      setTimeout(()=>{ S.idx++; S.answered=false; renderQuiz(); }, 850);
    };
    box.appendChild(b);
  });
}
async function finishQuiz(){
  const S=App.state;
  if(S.score>App.progress.quiz_score){ App.progress.quiz_score=S.score; await App.save(); }
  App.updateStats();
  $('#panel').innerHTML=`<div class="done"><h2>퀴즈 완료</h2><div class="score">${S.score} / ${S.order.length}</div>
    <p style="color:#6c6256">최고 점수 ${App.progress.quiz_score} · 틀린 단어는 오답·SRS에 자동 반영됐어요.</p>
    <div class="nav" style="justify-content:center;margin-top:18px"><button class="btn solid" id="re">다시 풀기</button></div></div>`;
  $('#re').onclick=startQuiz;
}

/* ---------------- 빈칸 받아쓰기 (철자) ---------------- */
function startDict(){
  const list=App.scopeWords();
  App.state={mode:'dict', order:shuffle(list), idx:0, score:0};
  renderDict();
}
function renderDict(){
  const S=App.state;
  if(S.idx>=S.order.length) return finishDict();
  const o=S.order[S.idx];
  $('#panel').innerHTML=`
    <div class="scopetag">⌨️ ${scopeLabel()} · 받아쓰기 · ${S.idx+1}/${S.order.length}</div>
    <div class="dMean">${o.mean} <span style="font-size:14px;color:var(--gold)">(${o.pos}.)</span></div>
    <div class="struct" style="max-width:480px;margin:0 auto 14px">🧩 ${o.struct}</div>
    <div class="dHint">뜻과 어원을 보고 영어 단어를 쓰세요</div>
    <input class="dInput" id="dIn" placeholder="영어로 입력" autocomplete="off" autocapitalize="off" spellcheck="false"/>
    <div class="dFeed" id="dFeed"></div>
    <div class="nav" style="justify-content:center;margin-top:8px"><button class="btn solid" id="dSubmit">확인 (Enter)</button></div>
    <div class="nav"><span class="counter">현재 점수 ${S.score}</span><span></span></div>`;
  const inp=$('#dIn'); inp.focus();
  const submit=async()=>{
    const val=inp.value.trim().toLowerCase(); if(!val)return;
    const fb=$('#dFeed'); inp.disabled=true; $('#dSubmit').disabled=true;
    const good=(val===o.w.toLowerCase());
    if(good){ fb.className='dFeed ok'; fb.innerHTML='정답! ✓ <span class="reveal">'+o.w+'</span> '+speakerBtn(o.w,true); S.score++; }
    else{ fb.className='dFeed no'; fb.innerHTML='정답: <span class="reveal">'+o.w+'</span> '+speakerBtn(o.w,true)+'<div class="exline">'+highlightEx(o.ex,o.w)+'</div>'; }
    speak(o.w);
    SRS.rate(App.progress.known,o.w,good); await App.save(); App.updateStats();
    setTimeout(()=>{ S.idx++; renderDict(); }, good?900:1500);
  };
  $('#dSubmit').onclick=submit;
  inp.onkeydown=e=>{ if(e.key==='Enter') submit(); };
}
async function finishDict(){
  const S=App.state;
  if(S.score>App.progress.dict_score){ App.progress.dict_score=S.score; await App.save(); }
  App.updateStats();
  $('#panel').innerHTML=`<div class="done"><h2>받아쓰기 완료</h2><div class="score">${S.score} / ${S.order.length}</div>
    <p style="color:#6c6256">최고 점수 ${App.progress.dict_score} · 철자가 틀린 단어는 오답·SRS에 반영됐어요.</p>
    <div class="nav" style="justify-content:center;margin-top:18px"><button class="btn solid" id="re">다시 하기</button></div></div>`;
  $('#re').onclick=startDict;
}

/* ---------------- 오답·약점 집중복습 ---------------- */
function startWeak(){
  const q=SRS.weakList(App.progress.known, WORDS);
  App.state={mode:'weak', queue:q, done:0, total:q.length};
  renderWeak();
}
function renderWeak(){
  const q=App.state.queue;
  if(!q.length){ emptyPanel(App.state.done>0 ? `오답 복습 완료! 🎉 ${App.state.done}개를 복습했어요.` : '오답 단어가 없어요! 잘하고 있어요. 👏'); return; }
  const o=wordObj(q[0]);
  $('#panel').innerHTML=`
    <div class="scopetag">🎯 오답·약점 집중복습 · ${App.state.done}/${App.state.total}</div>
    <div class="fc" id="fc">${cardInner(o)}</div>
    ${boxDots(o.w)}
    <div class="know">
      <button class="btn again" id="again">아직 몰라요</button>
      <button class="btn good" id="good">이제 알아요 ✓</button>
    </div>`;
  const fc=$('#fc'); fc.onclick=()=>fc.classList.toggle('flip');
  const rate=async(good)=>{ SRS.rate(App.progress.known,o.w,good); await App.save(); App.updateStats();
    App.state.queue.shift(); App.state.done++; renderWeak(); };
  $('#good').onclick=(e)=>{ e.stopPropagation(); rate(true); };
  $('#again').onclick=(e)=>{ e.stopPropagation(); rate(false); };
}

/* ---------------- 내 현황 (학생 자기 진도·성취도) ---------------- */
function dayProgress(){
  const out=[];
  for(let d=1; d<=DAYS; d++){
    const idx=getDayIndices(d); let learned=0, mastered=0;
    idx.forEach(i=>{ const s=SRS.get(App.progress.known, WORDS[i].w); if(SRS.isLearned(s))learned++; if(SRS.isMastered(s))mastered++; });
    out.push({day:d, total:idx.length, learned, mastered});
  }
  return out;
}
function renderMe(){
  App.state={mode:'me'};
  const c = SRS.counts(App.progress.known, WORDS);
  const pct = Math.round(c.learned/TOTAL*100);
  const C = 2*Math.PI*52, dash = (c.learned/TOTAL)*C;
  const days = dayProgress();
  const badges = [
    {i:'🌱', n:'첫걸음', d:'첫 단어 학습', e:c.seen>=1},
    {i:'📗', n:'Day 1 완료', d:'Day 1 전부 익힘', e:days[0] && days[0].learned===days[0].total},
    {i:'⭐', n:'첫 마스터', d:'단어 1개 마스터', e:c.mastered>=1},
    {i:'🔥', n:'50 익힘', d:'50단어 익힘', e:c.learned>=50},
    {i:'💯', n:'100 익힘', d:'100단어 익힘', e:c.learned>=100},
    {i:'🎯', n:'오답 정복', d:'오답 0개', e:c.weak===0 && c.seen>0},
    {i:'🏆', n:'200 마스터', d:'전부 마스터', e:c.mastered>=TOTAL},
  ];
  const dayCells = days.map(p=>{
    const r = p.learned/p.total;
    const cls = p.mastered===p.total ? 'full' : (r>=1?'learned':(r>0?'partial':''));
    return `<div class="daycell ${cls}" title="Day ${p.day}: 익힘 ${p.learned}/${p.total}, 마스터 ${p.mastered}">
      <span class="dn">${p.day}</span><span class="dc">${p.learned}/${p.total}</span></div>`;
  }).join('');
  const badgeCells = badges.map(b=>`<div class="badge2 ${b.e?'on':''}" title="${b.d}"><span class="bi">${b.i}</span><span class="bn">${b.n}</span></div>`).join('');
  $('#panel').innerHTML = `
    <div class="scopetag">🏆 내 학습 현황</div>
    <div class="me-top">
      <div class="me-ring">
        <svg viewBox="0 0 120 120" width="130" height="130">
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--line)" stroke-width="12"/>
          <circle cx="60" cy="60" r="52" fill="none" stroke="url(#g)" stroke-width="12" stroke-linecap="round"
            stroke-dasharray="${dash.toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 60 60)"/>
          <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="var(--accent2)"/><stop offset="1" stop-color="var(--gold)"/></linearGradient></defs>
        </svg>
        <div class="me-ringtxt"><b>${pct}%</b><span>익힘 ${c.learned}/${TOTAL}</span></div>
      </div>
      <div class="me-kpis">
        <div class="mekpi"><div class="num">${c.seen}</div><div class="lbl">학습</div></div>
        <div class="mekpi"><div class="num">${c.learned}</div><div class="lbl">익힘</div></div>
        <div class="mekpi"><div class="num">${c.mastered}</div><div class="lbl">마스터</div></div>
        <div class="mekpi due"><div class="num">${c.due}</div><div class="lbl">복습대기</div></div>
        <div class="mekpi weak"><div class="num">${c.weak}</div><div class="lbl">오답</div></div>
      </div>
    </div>
    <div class="me-actions">
      ${c.due>0 ? `<button class="btn solid" id="goSrs">🔁 복습 ${c.due}개 시작</button>` : ''}
      <button class="btn" id="goFlash">📖 단어 학습 이어서</button>
      ${c.weak>0 ? `<button class="btn again" id="goWeak">🎯 오답 ${c.weak}개 복습</button>` : ''}
    </div>
    <div class="me-sec">Day별 진척 <span class="me-hint">(칸을 누르면 그 Day 학습)</span></div>
    <div class="daygrid" id="daygrid">${dayCells}</div>
    <div class="me-sec">달성 배지 <span class="me-hint">${badges.filter(b=>b.e).length}/${badges.length}</span></div>
    <div class="badges">${badgeCells}</div>`;
  const gs=$('#goSrs'); if(gs) gs.onclick=()=>switchMode('srs');
  $('#goFlash').onclick=()=>switchMode('flash');
  const gw=$('#goWeak'); if(gw) gw.onclick=()=>switchMode('weak');
  document.querySelectorAll('#daygrid .daycell').forEach((el,i)=>{
    el.onclick=()=>{ App.scope={type:'day', day:i+1}; const sel=$('#scopeSel'); if(sel) sel.value='day:'+(i+1); switchMode('flash'); };
  });
}

/* ---------------- 모드 전환 ---------------- */
function switchMode(m){
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on', t.dataset.mode===m));
  // 범위 선택은 flash/quiz/dict 에만 적용
  const sb=$('#scopeBar'); if(sb) sb.classList.toggle('dim', (m==='srs'||m==='weak'||m==='me'));
  if(m==='me') renderMe();
  else if(m==='flash') startFlash();
  else if(m==='srs') startSrs();
  else if(m==='quiz') startQuiz();
  else if(m==='dict') startDict();
  else if(m==='weak') startWeak();
}
