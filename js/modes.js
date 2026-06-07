/* ============================================================
   WordLab · 학습 3모드 (플래시카드 / 4지선다 / 받아쓰기)
   전역 WORDS, TOTAL, $, shuffle, App 은 app.js 에서 정의됩니다.
   🔊 버튼: tts.js 의 speakerBtn() / speak()
   ============================================================ */

/* ---------------- FLASHCARD ---------------- */
function renderCard(){
  const w = WORDS[App.state.cardIdx];
  const exHtml = w.ex.replace('___','<b>'+w.w+'</b>');
  $('#panel').innerHTML = `
    <div class="fc" id="fc">
      <div class="fcInner">
        <div class="face front">
          <div class="wordrow"><div class="word">${w.w}</div>${speakerBtn(w.w)}</div>
          <div class="pos">${w.pos}.</div>
          <div class="hint">카드를 눌러 뜻 보기</div>
        </div>
        <div class="face back">
          <div class="mean">${w.mean}</div>
          <div class="ex">${exHtml}</div>
          <div class="hint">≈ ${w.syn}</div>
        </div>
      </div>
    </div>
    <div class="know">
      <button class="btn again" id="again">아직 몰라요</button>
      <button class="btn good" id="good">알아요 ✓</button>
    </div>
    <div class="nav">
      <button class="btn" id="prev" ${App.state.cardIdx===0?'disabled':''}>← 이전</button>
      <span class="counter">${App.state.cardIdx+1} / ${TOTAL}</span>
      <button class="btn" id="next" ${App.state.cardIdx===TOTAL-1?'disabled':''}>다음 →</button>
    </div>`;
  const fc=$('#fc');
  fc.onclick=()=>fc.classList.toggle('flip');
  $('#prev').onclick=()=>{ if(App.state.cardIdx>0){ App.state.cardIdx--; renderCard(); } };
  $('#next').onclick=()=>{ if(App.state.cardIdx<TOTAL-1){ App.state.cardIdx++; renderCard(); } };
  $('#good').onclick=async(e)=>{
    e.stopPropagation();
    App.progress.known[w.w]=true; await App.save(); App.updateProgress();
    if(App.state.cardIdx<TOTAL-1){ App.state.cardIdx++; renderCard(); } else { toast('플래시카드 한 바퀴 완료!'); }
  };
  $('#again').onclick=async(e)=>{
    e.stopPropagation();
    App.progress.known[w.w]=false; await App.save(); App.updateProgress();
    if(App.state.cardIdx<TOTAL-1){ App.state.cardIdx++; renderCard(); }
  };
}

/* ---------------- QUIZ (4지선다) ---------------- */
function startQuiz(){
  App.state.quizOrder = shuffle([...Array(TOTAL).keys()]);
  App.state.quizIdx = 0;
  App.state.quizScoreCur = 0;
  App.state.quizAnswered = false;
  renderQuiz();
}
function quizDistractMeans(correctMean){
  // 정답 외 다른 단어들의 한국어 뜻 중 3개를 오답으로
  const others = shuffle(WORDS.map(x=>x.mean));
  const res=[];
  for(const m of others){ if(res.length>=3) break; if(m!==correctMean && !res.includes(m)) res.push(m); }
  return res;
}
function renderQuiz(){
  if(App.state.quizIdx>=TOTAL){ return finishQuiz(); }
  const w = WORDS[App.state.quizOrder[App.state.quizIdx]];
  const opts = shuffle([w.mean, ...quizDistractMeans(w.mean)]);
  $('#panel').innerHTML = `
    <div class="qrow"><div class="qword">${w.w}</div>${speakerBtn(w.w)}</div>
    <div class="qprompt">알맞은 우리말 뜻을 고르세요 · ${App.state.quizIdx+1} / ${TOTAL}</div>
    <div class="opts" id="opts"></div>
    <div class="nav"><span class="counter">현재 점수 ${App.state.quizScoreCur}</span><span></span></div>`;
  speak(w.w);  // 문제 단어 자동 발음
  const box=$('#opts');
  opts.forEach(o=>{
    const b=document.createElement('button'); b.className='opt'; b.textContent=o;
    b.onclick=()=>{
      if(App.state.quizAnswered) return;
      App.state.quizAnswered=true;
      const all=box.querySelectorAll('.opt'); all.forEach(x=>x.disabled=true);
      if(o===w.mean){ b.classList.add('correct'); App.state.quizScoreCur++; }
      else{ b.classList.add('wrong'); all.forEach(x=>{ if(x.textContent===w.mean) x.classList.add('correct'); }); }
      setTimeout(()=>{ App.state.quizIdx++; App.state.quizAnswered=false; renderQuiz(); }, 900);
    };
    box.appendChild(b);
  });
}
async function finishQuiz(){
  if(App.state.quizScoreCur > App.progress.quiz_score){ App.progress.quiz_score = App.state.quizScoreCur; await App.save(); }
  App.updateProgress();
  $('#panel').innerHTML=`<div class="done"><h2>퀴즈 완료</h2><div class="score">${App.state.quizScoreCur} / ${TOTAL}</div>
    <p style="color:#6c6256">최고 점수 ${App.progress.quiz_score} · 틀린 단어는 플래시카드로 다시 익혀보세요.</p>
    <div class="nav" style="justify-content:center;margin-top:18px"><button class="btn solid" id="re">다시 풀기</button></div></div>`;
  $('#re').onclick=startQuiz;
}

/* ---------------- DICTATION (빈칸 받아쓰기) ---------------- */
function startDict(){
  App.state.dictOrder = shuffle([...Array(TOTAL).keys()]);
  App.state.dictIdx = 0;
  App.state.dictScoreCur = 0;
  renderDict();
}
function renderDict(){
  if(App.state.dictIdx>=TOTAL){ return finishDict(); }
  const w = WORDS[App.state.dictOrder[App.state.dictIdx]];
  const exHtml = w.ex.replace('___','<span class="blank"></span>');
  $('#panel').innerHTML=`
    <div class="dHint">뜻과 예문을 보고 영어 단어를 쓰세요 · ${App.state.dictIdx+1} / ${TOTAL}</div>
    <div class="dMean">${w.mean} <span style="font-size:14px;color:var(--gold)">(${w.pos}.)</span></div>
    <div class="dEx">${exHtml}</div>
    <input class="dInput" id="dIn" placeholder="영어로 입력" autocomplete="off" autocapitalize="off" spellcheck="false"/>
    <div class="dFeed" id="dFeed"></div>
    <div class="nav" style="justify-content:center;margin-top:8px"><button class="btn solid" id="dSubmit">확인 (Enter)</button></div>
    <div class="nav"><span class="counter">현재 점수 ${App.state.dictScoreCur}</span><span></span></div>`;
  const inp=$('#dIn'); inp.focus();
  const submit=()=>{
    const val=inp.value.trim().toLowerCase();
    if(!val) return;
    const fb=$('#dFeed'); inp.disabled=true; $('#dSubmit').disabled=true;
    if(val===w.w.toLowerCase()){
      fb.className='dFeed ok'; fb.textContent='정답! ✓'; App.state.dictScoreCur++;
    }else{
      fb.className='dFeed no';
      fb.innerHTML='<div class="dReveal">아쉬워요 — 정답: <span class="reveal">'+w.w+'</span>'+speakerBtn(w.w,true)+'</div>';
    }
    speak(w.w);  // 정답 공개 시 발음
    setTimeout(()=>{ App.state.dictIdx++; renderDict(); }, 1300);
  };
  $('#dSubmit').onclick=submit;
  inp.onkeydown=e=>{ if(e.key==='Enter') submit(); };
}
async function finishDict(){
  if(App.state.dictScoreCur > App.progress.dict_score){ App.progress.dict_score = App.state.dictScoreCur; await App.save(); }
  App.updateProgress();
  $('#panel').innerHTML=`<div class="done"><h2>받아쓰기 완료</h2><div class="score">${App.state.dictScoreCur} / ${TOTAL}</div>
    <p style="color:#6c6256">최고 점수 ${App.progress.dict_score} · 철자가 틀린 단어를 집중 복습하세요.</p>
    <div class="nav" style="justify-content:center;margin-top:18px"><button class="btn solid" id="re">다시 하기</button></div></div>`;
  $('#re').onclick=startDict;
}

/* ---------------- 모드 전환 ---------------- */
function switchMode(m){
  App.state.mode=m;
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on', t.dataset.mode===m));
  if(m==='card') renderCard();
  if(m==='quiz') startQuiz();
  if(m==='dict') startDict();
}
