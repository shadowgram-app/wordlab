/* ============================================================
   WordLab · 단어 데이터
   레벨별 구조 — Level 4 단어장은 LEVELS.L4 에 추가만 하면 됩니다.
   각 단어: { w 단어, pos 품사, mean 뜻, syn 동의어, ex 예문(___ = 정답), distract 오답 }
   예문의 '___' 가 정답 단어 자리입니다.
   ============================================================ */
const LEVELS = {
  L3: {
    code: "L3",
    label: "Level 3 · 수능 기본 어휘",
    words: [
      {w:"compelling",pos:"adj",mean:"설득력 있는",syn:"convincing",ex:"The evidence was ___ and hard to ignore.",distract:["weak","boring","unclear"]},
      {w:"indifferent",pos:"adj",mean:"무관심한",syn:"uninterested",ex:"He stayed ___ to the bad news.",distract:["excited","curious","grateful"]},
      {w:"futile",pos:"adj",mean:"헛된, 소용없는",syn:"pointless",ex:"Their efforts turned out to be ___.",distract:["useful","successful","necessary"]},
      {w:"ambiguous",pos:"adj",mean:"애매한, 모호한",syn:"unclear",ex:"She gave an ___ answer on purpose.",distract:["clear","honest","detailed"]},
      {w:"adverse",pos:"adj",mean:"불리한, 해로운",syn:"harmful",ex:"The drug had ___ effects.",distract:["helpful","minor","expected"]},
      {w:"consistent",pos:"adj",mean:"일관된",syn:"in agreement",ex:"His actions were ___ with his words.",distract:["opposite","unrelated","confusing"]},
      {w:"alleviate",pos:"v",mean:"완화하다",syn:"ease",ex:"This medicine can ___ the pain.",distract:["increase","ignore","cause"]},
      {w:"feasible",pos:"adj",mean:"실현 가능한",syn:"doable",ex:"The plan seemed ___ after all.",distract:["impossible","risky","secret"]},
      {w:"conviction",pos:"n",mean:"확신, 신념",syn:"firm belief",ex:"She spoke with great ___.",distract:["doubt","humor","fear"]},
      {w:"comparable",pos:"adj",mean:"비슷한, 비교할 만한",syn:"similar",ex:"The two results were ___.",distract:["identical","opposite","random"]},
      {w:"abundant",pos:"adj",mean:"풍부한",syn:"plentiful",ex:"Water is ___ in this region.",distract:["rare","empty","limited"]},
      {w:"reluctant",pos:"adj",mean:"꺼리는, 마지못한",syn:"unwilling",ex:"He was ___ to admit his mistake.",distract:["eager","willing","happy"]},
      {w:"diminish",pos:"v",mean:"줄어들다, 약해지다",syn:"decrease",ex:"The noise began to ___ at night.",distract:["grow","spread","appear"]},
      {w:"inevitable",pos:"adj",mean:"피할 수 없는",syn:"unavoidable",ex:"Change is ___ in life.",distract:["optional","sudden","rare"]},
      {w:"profound",pos:"adj",mean:"깊은, 심오한",syn:"deep",ex:"The book had a ___ effect on me.",distract:["shallow","brief","light"]},
      {w:"vague",pos:"adj",mean:"막연한, 흐릿한",syn:"unclear",ex:"I have only a ___ memory of it.",distract:["sharp","exact","bright"]},
      {w:"sustain",pos:"v",mean:"지속하다, 유지하다",syn:"maintain",ex:"They could not ___ the effort.",distract:["stop","destroy","forget"]},
      {w:"contradict",pos:"v",mean:"모순되다, 반박하다",syn:"oppose",ex:"His story seemed to ___ the facts.",distract:["support","repeat","explain"]},
      {w:"superficial",pos:"adj",mean:"피상적인, 겉핥기의",syn:"shallow",ex:"His knowledge was rather ___.",distract:["deep","honest","wide"]},
      {w:"deliberate",pos:"adj",mean:"의도적인, 신중한",syn:"intentional",ex:"It was a ___ choice, not an accident.",distract:["accidental","random","careless"]},
      {w:"tremendous",pos:"adj",mean:"엄청난",syn:"huge",ex:"They made a ___ effort.",distract:["tiny","weak","minor"]},
      {w:"obstacle",pos:"n",mean:"장애물",syn:"barrier",ex:"She overcame every ___ in her way.",distract:["bridge","reward","helper"]},
      {w:"genuine",pos:"adj",mean:"진짜의, 진실한",syn:"real",ex:"Her smile was warm and ___.",distract:["fake","forced","cold"]},
      {w:"essential",pos:"adj",mean:"필수적인",syn:"necessary",ex:"Water is ___ for life.",distract:["useless","optional","rare"]},
      {w:"reveal",pos:"v",mean:"드러내다, 밝히다",syn:"show",ex:"The report may ___ the truth.",distract:["hide","deny","ignore"]},
      {w:"fragile",pos:"adj",mean:"부서지기 쉬운",syn:"delicate",ex:"The old vase is very ___.",distract:["strong","heavy","solid"]},
      {w:"anticipate",pos:"v",mean:"예상하다",syn:"expect",ex:"We ___ a rise in prices.",distract:["forget","cause","avoid"]},
      {w:"distinct",pos:"adj",mean:"뚜렷한, 구별되는",syn:"clearly different",ex:"The two species are quite ___.",distract:["similar","vague","equal"]},
      {w:"abandon",pos:"v",mean:"버리다, 포기하다",syn:"give up",ex:"They had to ___ the project.",distract:["keep","finish","protect"]},
      {w:"vital",pos:"adj",mean:"매우 중요한",syn:"crucial",ex:"Sleep is ___ to health.",distract:["minor","optional","useless"]},
      {w:"acquire",pos:"v",mean:"습득하다, 얻다",syn:"gain",ex:"She hoped to ___ new skills.",distract:["lose","waste","reject"]},
      {w:"restrain",pos:"v",mean:"억제하다",syn:"hold back",ex:"He tried to ___ his anger.",distract:["release","express","cause"]},
      {w:"prominent",pos:"adj",mean:"두드러진, 유명한",syn:"notable",ex:"She is a ___ scientist.",distract:["unknown","hidden","minor"]},
      {w:"hesitate",pos:"v",mean:"망설이다",syn:"pause",ex:"Don’t ___ to ask for help.",distract:["rush","decide","refuse"]},
      {w:"adequate",pos:"adj",mean:"충분한, 적절한",syn:"sufficient",ex:"The food was ___ for everyone.",distract:["scarce","poor","excessive"]},
      {w:"emerge",pos:"v",mean:"나타나다",syn:"appear",ex:"The sun began to ___ from the clouds.",distract:["vanish","hide","sink"]},
      {w:"reinforce",pos:"v",mean:"강화하다",syn:"strengthen",ex:"The walls were ___d with steel.",distract:["weaken","remove","ignore"]},
      {w:"flourish",pos:"v",mean:"번성하다",syn:"thrive",ex:"The business began to ___.",distract:["fail","shrink","stop"]},
      {w:"verify",pos:"v",mean:"확인하다, 입증하다",syn:"confirm",ex:"Please ___ your answer.",distract:["doubt","guess","deny"]},
      {w:"tolerate",pos:"v",mean:"참다, 견디다",syn:"put up with",ex:"I cannot ___ such rudeness.",distract:["enjoy","cause","ignore"]},
    ]
  }
  // 다음 작업: LEVELS.L4 = { code:"L4", label:"Level 4 · ...", words:[ ... ] }
};

/* 현재 활성 레벨 (확장 시 여기만 바꾸거나 로그인 단계에서 선택) */
const ACTIVE_LEVEL = "L3";

function getLevel(code){ return LEVELS[code || ACTIVE_LEVEL]; }
function getWords(code){ return getLevel(code).words; }
