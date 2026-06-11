/* ============================================================
   WordLab 초등 · 단어 데이터 (초등 필수 영단어 150 · 이모지 카드)
   스키마: { w 단어, pron 한글발음, pos 품사, mean 뜻, emoji 그림, ex 예문, exKo 해석 }
   ★ 알파벳순으로 외우면 헷갈려서, 고정 시드 셔플로 '섞인 순서'를 만듭니다.
     (시드가 고정이라 Day 구성은 항상 동일 — 하루 한 장 학습에 일관성 유지)
   ============================================================ */
const LEVELS = {
  E1: {
    code: "E1",
    label: "초등 필수 영단어 150",
    perDay: 10,
    words: [
      // 동물
      {w:"dog",pron:"도그",pos:"n",mean:"개",emoji:"🐶",ex:"I have a dog.",exKo:"나는 개가 있어요."},
      {w:"cat",pron:"캣",pos:"n",mean:"고양이",emoji:"🐱",ex:"The cat is cute.",exKo:"고양이가 귀여워요."},
      {w:"rabbit",pron:"래빗",pos:"n",mean:"토끼",emoji:"🐰",ex:"The rabbit can jump.",exKo:"토끼는 점프할 수 있어요."},
      {w:"bear",pron:"베어",pos:"n",mean:"곰",emoji:"🐻",ex:"A bear is big.",exKo:"곰은 커요."},
      {w:"lion",pron:"라이언",pos:"n",mean:"사자",emoji:"🦁",ex:"The lion is strong.",exKo:"사자는 힘이 세요."},
      {w:"tiger",pron:"타이거",pos:"n",mean:"호랑이",emoji:"🐯",ex:"The tiger has stripes.",exKo:"호랑이는 줄무늬가 있어요."},
      {w:"monkey",pron:"멍키",pos:"n",mean:"원숭이",emoji:"🐵",ex:"The monkey eats a banana.",exKo:"원숭이가 바나나를 먹어요."},
      {w:"elephant",pron:"엘리펀트",pos:"n",mean:"코끼리",emoji:"🐘",ex:"The elephant is very big.",exKo:"코끼리는 아주 커요."},
      {w:"pig",pron:"피그",pos:"n",mean:"돼지",emoji:"🐷",ex:"The pig is pink.",exKo:"돼지는 분홍색이에요."},
      {w:"cow",pron:"카우",pos:"n",mean:"소",emoji:"🐮",ex:"The cow gives milk.",exKo:"소는 우유를 줘요."},
      {w:"horse",pron:"호스",pos:"n",mean:"말",emoji:"🐴",ex:"I can ride a horse.",exKo:"나는 말을 탈 수 있어요."},
      {w:"mouse",pron:"마우스",pos:"n",mean:"쥐",emoji:"🐭",ex:"The mouse is small.",exKo:"쥐는 작아요."},
      {w:"duck",pron:"덕",pos:"n",mean:"오리",emoji:"🦆",ex:"The duck swims.",exKo:"오리가 헤엄쳐요."},
      {w:"chicken",pron:"치킨",pos:"n",mean:"닭",emoji:"🐔",ex:"The chicken has eggs.",exKo:"닭은 달걀이 있어요."},
      {w:"bird",pron:"버드",pos:"n",mean:"새",emoji:"🐦",ex:"The bird can fly.",exKo:"새는 날 수 있어요."},
      {w:"fish",pron:"피쉬",pos:"n",mean:"물고기",emoji:"🐟",ex:"The fish lives in water.",exKo:"물고기는 물에 살아요."},
      {w:"frog",pron:"프로그",pos:"n",mean:"개구리",emoji:"🐸",ex:"The frog is green.",exKo:"개구리는 초록색이에요."},
      {w:"snake",pron:"스네이크",pos:"n",mean:"뱀",emoji:"🐍",ex:"The snake is long.",exKo:"뱀은 길어요."},
      {w:"fox",pron:"폭스",pos:"n",mean:"여우",emoji:"🦊",ex:"The fox is clever.",exKo:"여우는 영리해요."},
      {w:"sheep",pron:"쉽",pos:"n",mean:"양",emoji:"🐑",ex:"The sheep is white.",exKo:"양은 하얘요."},
      {w:"wolf",pron:"울프",pos:"n",mean:"늑대",emoji:"🐺",ex:"The wolf is in the forest.",exKo:"늑대는 숲에 있어요."},
      {w:"bee",pron:"비",pos:"n",mean:"벌",emoji:"🐝",ex:"The bee likes flowers.",exKo:"벌은 꽃을 좋아해요."},
      {w:"ant",pron:"앤트",pos:"n",mean:"개미",emoji:"🐜",ex:"The ant is very small.",exKo:"개미는 아주 작아요."},
      {w:"butterfly",pron:"버터플라이",pos:"n",mean:"나비",emoji:"🦋",ex:"The butterfly is pretty.",exKo:"나비는 예뻐요."},
      // 음식
      {w:"apple",pron:"애플",pos:"n",mean:"사과",emoji:"🍎",ex:"I eat an apple.",exKo:"나는 사과를 먹어요."},
      {w:"banana",pron:"바나나",pos:"n",mean:"바나나",emoji:"🍌",ex:"The banana is yellow.",exKo:"바나나는 노란색이에요."},
      {w:"orange",pron:"오렌지",pos:"n",mean:"오렌지",emoji:"🍊",ex:"The orange is sweet.",exKo:"오렌지는 달아요."},
      {w:"grape",pron:"그레이프",pos:"n",mean:"포도",emoji:"🍇",ex:"Grapes are purple.",exKo:"포도는 보라색이에요."},
      {w:"strawberry",pron:"스트로베리",pos:"n",mean:"딸기",emoji:"🍓",ex:"I like strawberries.",exKo:"나는 딸기를 좋아해요."},
      {w:"watermelon",pron:"워터멜론",pos:"n",mean:"수박",emoji:"🍉",ex:"Watermelon is big.",exKo:"수박은 커요."},
      {w:"bread",pron:"브레드",pos:"n",mean:"빵",emoji:"🍞",ex:"I eat bread for breakfast.",exKo:"나는 아침에 빵을 먹어요."},
      {w:"milk",pron:"밀크",pos:"n",mean:"우유",emoji:"🥛",ex:"I drink milk.",exKo:"나는 우유를 마셔요."},
      {w:"rice",pron:"라이스",pos:"n",mean:"밥, 쌀",emoji:"🍚",ex:"We eat rice.",exKo:"우리는 밥을 먹어요."},
      {w:"egg",pron:"에그",pos:"n",mean:"달걀",emoji:"🥚",ex:"The egg is white.",exKo:"달걀은 하얘요."},
      {w:"cake",pron:"케이크",pos:"n",mean:"케이크",emoji:"🍰",ex:"I like cake.",exKo:"나는 케이크를 좋아해요."},
      {w:"candy",pron:"캔디",pos:"n",mean:"사탕",emoji:"🍬",ex:"The candy is sweet.",exKo:"사탕은 달아요."},
      {w:"cookie",pron:"쿠키",pos:"n",mean:"쿠키, 과자",emoji:"🍪",ex:"I want a cookie.",exKo:"나는 쿠키가 먹고 싶어요."},
      {w:"juice",pron:"주스",pos:"n",mean:"주스",emoji:"🧃",ex:"I drink juice.",exKo:"나는 주스를 마셔요."},
      {w:"water",pron:"워터",pos:"n",mean:"물",emoji:"💧",ex:"I drink water.",exKo:"나는 물을 마셔요."},
      {w:"meat",pron:"미트",pos:"n",mean:"고기",emoji:"🍖",ex:"Dogs like meat.",exKo:"개는 고기를 좋아해요."},
      {w:"soup",pron:"수프",pos:"n",mean:"수프, 국",emoji:"🍲",ex:"The soup is hot.",exKo:"수프는 뜨거워요."},
      {w:"cheese",pron:"치즈",pos:"n",mean:"치즈",emoji:"🧀",ex:"Mice like cheese.",exKo:"쥐는 치즈를 좋아해요."},
      {w:"pizza",pron:"피자",pos:"n",mean:"피자",emoji:"🍕",ex:"I love pizza.",exKo:"나는 피자를 아주 좋아해요."},
      {w:"ice cream",pron:"아이스크림",pos:"n",mean:"아이스크림",emoji:"🍦",ex:"Ice cream is cold.",exKo:"아이스크림은 차가워요."},
      {w:"carrot",pron:"캐럿",pos:"n",mean:"당근",emoji:"🥕",ex:"Rabbits eat carrots.",exKo:"토끼는 당근을 먹어요."},
      {w:"tomato",pron:"토마토",pos:"n",mean:"토마토",emoji:"🍅",ex:"The tomato is red.",exKo:"토마토는 빨개요."},
      // 색
      {w:"red",pron:"레드",pos:"adj",mean:"빨간색",emoji:"🔴",ex:"The apple is red.",exKo:"사과는 빨개요."},
      {w:"blue",pron:"블루",pos:"adj",mean:"파란색",emoji:"🔵",ex:"The sky is blue.",exKo:"하늘은 파래요."},
      {w:"yellow",pron:"옐로우",pos:"adj",mean:"노란색",emoji:"🟡",ex:"The sun is yellow.",exKo:"해는 노란색이에요."},
      {w:"green",pron:"그린",pos:"adj",mean:"초록색",emoji:"🟢",ex:"The grass is green.",exKo:"풀은 초록색이에요."},
      {w:"black",pron:"블랙",pos:"adj",mean:"검은색",emoji:"⚫",ex:"The cat is black.",exKo:"고양이는 검은색이에요."},
      {w:"white",pron:"화이트",pos:"adj",mean:"흰색",emoji:"⚪",ex:"Snow is white.",exKo:"눈은 하얘요."},
      {w:"pink",pron:"핑크",pos:"adj",mean:"분홍색",emoji:"🌸",ex:"The flower is pink.",exKo:"꽃은 분홍색이에요."},
      {w:"purple",pron:"퍼플",pos:"adj",mean:"보라색",emoji:"🟣",ex:"Grapes are purple.",exKo:"포도는 보라색이에요."},
      {w:"brown",pron:"브라운",pos:"adj",mean:"갈색",emoji:"🟤",ex:"The bear is brown.",exKo:"곰은 갈색이에요."},
      {w:"gray",pron:"그레이",pos:"adj",mean:"회색",emoji:"⬜",ex:"The elephant is gray.",exKo:"코끼리는 회색이에요."},
      // 숫자
      {w:"one",pron:"원",pos:"n",mean:"하나, 1",emoji:"1️⃣",ex:"I have one dog.",exKo:"나는 개가 한 마리 있어요."},
      {w:"two",pron:"투",pos:"n",mean:"둘, 2",emoji:"2️⃣",ex:"I have two eyes.",exKo:"나는 눈이 두 개 있어요."},
      {w:"three",pron:"쓰리",pos:"n",mean:"셋, 3",emoji:"3️⃣",ex:"I see three birds.",exKo:"나는 새 세 마리를 봐요."},
      {w:"four",pron:"포",pos:"n",mean:"넷, 4",emoji:"4️⃣",ex:"A dog has four legs.",exKo:"개는 다리가 네 개예요."},
      {w:"five",pron:"파이브",pos:"n",mean:"다섯, 5",emoji:"5️⃣",ex:"I have five fingers.",exKo:"나는 손가락이 다섯 개예요."},
      {w:"six",pron:"식스",pos:"n",mean:"여섯, 6",emoji:"6️⃣",ex:"It is six o'clock.",exKo:"여섯 시예요."},
      {w:"seven",pron:"세븐",pos:"n",mean:"일곱, 7",emoji:"7️⃣",ex:"A week has seven days.",exKo:"일주일은 칠 일이에요."},
      {w:"eight",pron:"에이트",pos:"n",mean:"여덟, 8",emoji:"8️⃣",ex:"I am eight years old.",exKo:"나는 여덟 살이에요."},
      {w:"nine",pron:"나인",pos:"n",mean:"아홉, 9",emoji:"9️⃣",ex:"There are nine cats.",exKo:"고양이가 아홉 마리 있어요."},
      {w:"ten",pron:"텐",pos:"n",mean:"열, 10",emoji:"🔟",ex:"I count to ten.",exKo:"나는 열까지 세요."},
      // 몸
      {w:"head",pron:"헤드",pos:"n",mean:"머리",emoji:"🙂",ex:"I touch my head.",exKo:"나는 머리를 만져요."},
      {w:"hand",pron:"핸드",pos:"n",mean:"손",emoji:"✋",ex:"Wash your hands.",exKo:"손을 씻어요."},
      {w:"foot",pron:"풋",pos:"n",mean:"발",emoji:"🦶",ex:"My foot is small.",exKo:"내 발은 작아요."},
      {w:"eye",pron:"아이",pos:"n",mean:"눈",emoji:"👁️",ex:"I close my eyes.",exKo:"나는 눈을 감아요."},
      {w:"ear",pron:"이어",pos:"n",mean:"귀",emoji:"👂",ex:"I hear with my ears.",exKo:"나는 귀로 들어요."},
      {w:"nose",pron:"노즈",pos:"n",mean:"코",emoji:"👃",ex:"The nose smells.",exKo:"코로 냄새를 맡아요."},
      {w:"mouth",pron:"마우쓰",pos:"n",mean:"입",emoji:"👄",ex:"I eat with my mouth.",exKo:"나는 입으로 먹어요."},
      {w:"hair",pron:"헤어",pos:"n",mean:"머리카락",emoji:"💇",ex:"Her hair is long.",exKo:"그녀의 머리카락은 길어요."},
      {w:"arm",pron:"암",pos:"n",mean:"팔",emoji:"💪",ex:"My arm is strong.",exKo:"내 팔은 힘이 세요."},
      {w:"leg",pron:"레그",pos:"n",mean:"다리",emoji:"🦵",ex:"I run with my legs.",exKo:"나는 다리로 달려요."},
      {w:"tooth",pron:"투쓰",pos:"n",mean:"이, 치아",emoji:"🦷",ex:"Brush your teeth.",exKo:"이를 닦아요."},
      {w:"finger",pron:"핑거",pos:"n",mean:"손가락",emoji:"👆",ex:"I point with my finger.",exKo:"나는 손가락으로 가리켜요."},
      // 가족
      {w:"mother",pron:"마더",pos:"n",mean:"엄마",emoji:"👩",ex:"My mother is kind.",exKo:"우리 엄마는 친절해요."},
      {w:"father",pron:"파더",pos:"n",mean:"아빠",emoji:"👨",ex:"My father is tall.",exKo:"우리 아빠는 키가 커요."},
      {w:"sister",pron:"시스터",pos:"n",mean:"언니, 누나, 여동생",emoji:"👧",ex:"I have a sister.",exKo:"나는 여자 형제가 있어요."},
      {w:"brother",pron:"브라더",pos:"n",mean:"형, 오빠, 남동생",emoji:"👦",ex:"My brother is nice.",exKo:"우리 형은 착해요."},
      {w:"baby",pron:"베이비",pos:"n",mean:"아기",emoji:"👶",ex:"The baby is small.",exKo:"아기는 작아요."},
      {w:"grandmother",pron:"그랜드마더",pos:"n",mean:"할머니",emoji:"👵",ex:"I love my grandmother.",exKo:"나는 할머니를 사랑해요."},
      {w:"grandfather",pron:"그랜드파더",pos:"n",mean:"할아버지",emoji:"👴",ex:"My grandfather is old.",exKo:"우리 할아버지는 나이가 많아요."},
      {w:"friend",pron:"프렌드",pos:"n",mean:"친구",emoji:"🧑‍🤝‍🧑",ex:"She is my friend.",exKo:"그녀는 내 친구예요."},
      // 자연·날씨
      {w:"sun",pron:"썬",pos:"n",mean:"해, 태양",emoji:"☀️",ex:"The sun is hot.",exKo:"해는 뜨거워요."},
      {w:"moon",pron:"문",pos:"n",mean:"달",emoji:"🌙",ex:"The moon is bright.",exKo:"달이 밝아요."},
      {w:"star",pron:"스타",pos:"n",mean:"별",emoji:"⭐",ex:"I see many stars.",exKo:"나는 별을 많이 봐요."},
      {w:"rain",pron:"레인",pos:"n",mean:"비",emoji:"🌧️",ex:"I like the rain.",exKo:"나는 비를 좋아해요."},
      {w:"snow",pron:"스노우",pos:"n",mean:"눈",emoji:"❄️",ex:"Snow is white and cold.",exKo:"눈은 하얗고 차가워요."},
      {w:"cloud",pron:"클라우드",pos:"n",mean:"구름",emoji:"☁️",ex:"The cloud is white.",exKo:"구름은 하얘요."},
      {w:"wind",pron:"윈드",pos:"n",mean:"바람",emoji:"🌬️",ex:"The wind is strong.",exKo:"바람이 세요."},
      {w:"tree",pron:"트리",pos:"n",mean:"나무",emoji:"🌳",ex:"The tree is tall.",exKo:"나무는 키가 커요."},
      {w:"flower",pron:"플라워",pos:"n",mean:"꽃",emoji:"🌷",ex:"The flower smells good.",exKo:"꽃은 좋은 냄새가 나요."},
      {w:"sea",pron:"씨",pos:"n",mean:"바다",emoji:"🌊",ex:"Fish live in the sea.",exKo:"물고기는 바다에 살아요."},
      {w:"mountain",pron:"마운틴",pos:"n",mean:"산",emoji:"⛰️",ex:"The mountain is high.",exKo:"산은 높아요."},
      {w:"river",pron:"리버",pos:"n",mean:"강",emoji:"🏞️",ex:"The river is long.",exKo:"강은 길어요."},
      {w:"sky",pron:"스카이",pos:"n",mean:"하늘",emoji:"🌤️",ex:"The sky is blue.",exKo:"하늘은 파래요."},
      {w:"fire",pron:"파이어",pos:"n",mean:"불",emoji:"🔥",ex:"Fire is hot.",exKo:"불은 뜨거워요."},
      // 사물·집
      {w:"house",pron:"하우스",pos:"n",mean:"집",emoji:"🏠",ex:"I live in a house.",exKo:"나는 집에 살아요."},
      {w:"door",pron:"도어",pos:"n",mean:"문",emoji:"🚪",ex:"Open the door.",exKo:"문을 열어요."},
      {w:"window",pron:"윈도우",pos:"n",mean:"창문",emoji:"🪟",ex:"Close the window.",exKo:"창문을 닫아요."},
      {w:"chair",pron:"체어",pos:"n",mean:"의자",emoji:"🪑",ex:"Sit on the chair.",exKo:"의자에 앉아요."},
      {w:"bed",pron:"베드",pos:"n",mean:"침대",emoji:"🛏️",ex:"I sleep in my bed.",exKo:"나는 침대에서 자요."},
      {w:"clock",pron:"클락",pos:"n",mean:"시계",emoji:"🕐",ex:"The clock is on the wall.",exKo:"시계가 벽에 있어요."},
      {w:"phone",pron:"폰",pos:"n",mean:"전화",emoji:"📱",ex:"I have a phone.",exKo:"나는 전화가 있어요."},
      {w:"cup",pron:"컵",pos:"n",mean:"컵",emoji:"☕",ex:"The cup is full.",exKo:"컵이 가득 찼어요."},
      {w:"ball",pron:"볼",pos:"n",mean:"공",emoji:"⚽",ex:"I play with a ball.",exKo:"나는 공을 가지고 놀아요."},
      {w:"book",pron:"북",pos:"n",mean:"책",emoji:"📖",ex:"I read a book.",exKo:"나는 책을 읽어요."},
      {w:"pencil",pron:"펜슬",pos:"n",mean:"연필",emoji:"✏️",ex:"I write with a pencil.",exKo:"나는 연필로 써요."},
      {w:"pen",pron:"펜",pos:"n",mean:"펜",emoji:"🖊️",ex:"The pen is blue.",exKo:"펜은 파란색이에요."},
      {w:"bag",pron:"백",pos:"n",mean:"가방",emoji:"🎒",ex:"My bag is heavy.",exKo:"내 가방은 무거워요."},
      {w:"key",pron:"키",pos:"n",mean:"열쇠",emoji:"🔑",ex:"I have a key.",exKo:"나는 열쇠가 있어요."},
      {w:"box",pron:"박스",pos:"n",mean:"상자",emoji:"📦",ex:"The box is big.",exKo:"상자는 커요."},
      {w:"car",pron:"카",pos:"n",mean:"자동차",emoji:"🚗",ex:"The car is fast.",exKo:"자동차는 빨라요."},
      // 학교
      {w:"school",pron:"스쿨",pos:"n",mean:"학교",emoji:"🏫",ex:"I go to school.",exKo:"나는 학교에 가요."},
      {w:"teacher",pron:"티처",pos:"n",mean:"선생님",emoji:"👩‍🏫",ex:"My teacher is kind.",exKo:"우리 선생님은 친절해요."},
      {w:"student",pron:"스튜던트",pos:"n",mean:"학생",emoji:"🧑‍🎓",ex:"I am a student.",exKo:"나는 학생이에요."},
      {w:"desk",pron:"데스크",pos:"n",mean:"책상",emoji:"🗄️",ex:"My book is on the desk.",exKo:"내 책이 책상 위에 있어요."},
      {w:"paper",pron:"페이퍼",pos:"n",mean:"종이",emoji:"📄",ex:"I draw on paper.",exKo:"나는 종이에 그려요."},
      {w:"ruler",pron:"룰러",pos:"n",mean:"자",emoji:"📏",ex:"I use a ruler.",exKo:"나는 자를 써요."},
      // 동작
      {w:"run",pron:"런",pos:"v",mean:"달리다",emoji:"🏃",ex:"I can run fast.",exKo:"나는 빨리 달릴 수 있어요."},
      {w:"jump",pron:"점프",pos:"v",mean:"뛰다, 점프하다",emoji:"🤸",ex:"Frogs jump high.",exKo:"개구리는 높이 뛰어요."},
      {w:"walk",pron:"워크",pos:"v",mean:"걷다",emoji:"🚶",ex:"I walk to school.",exKo:"나는 학교에 걸어가요."},
      {w:"eat",pron:"잇",pos:"v",mean:"먹다",emoji:"🍽️",ex:"I eat lunch.",exKo:"나는 점심을 먹어요."},
      {w:"drink",pron:"드링크",pos:"v",mean:"마시다",emoji:"🥤",ex:"I drink water.",exKo:"나는 물을 마셔요."},
      {w:"sleep",pron:"슬립",pos:"v",mean:"자다",emoji:"😴",ex:"I sleep at night.",exKo:"나는 밤에 자요."},
      {w:"read",pron:"리드",pos:"v",mean:"읽다",emoji:"📚",ex:"I read every day.",exKo:"나는 매일 읽어요."},
      {w:"write",pron:"라이트",pos:"v",mean:"쓰다",emoji:"✍️",ex:"I write my name.",exKo:"나는 내 이름을 써요."},
      {w:"sing",pron:"싱",pos:"v",mean:"노래하다",emoji:"🎤",ex:"I sing a song.",exKo:"나는 노래를 불러요."},
      {w:"dance",pron:"댄스",pos:"v",mean:"춤추다",emoji:"💃",ex:"We dance together.",exKo:"우리는 함께 춤춰요."},
      {w:"play",pron:"플레이",pos:"v",mean:"놀다, (운동을) 하다",emoji:"🧸",ex:"I play with my friends.",exKo:"나는 친구들과 놀아요."},
      {w:"swim",pron:"스윔",pos:"v",mean:"수영하다",emoji:"🏊",ex:"Fish swim well.",exKo:"물고기는 수영을 잘해요."},
      {w:"fly",pron:"플라이",pos:"v",mean:"날다",emoji:"🕊️",ex:"Birds fly in the sky.",exKo:"새는 하늘을 날아요."},
      {w:"cry",pron:"크라이",pos:"v",mean:"울다",emoji:"😭",ex:"The baby cries.",exKo:"아기가 울어요."},
      {w:"smile",pron:"스마일",pos:"v",mean:"웃다, 미소짓다",emoji:"😊",ex:"She smiles at me.",exKo:"그녀가 나에게 미소 지어요."},
      {w:"sit",pron:"싯",pos:"v",mean:"앉다",emoji:"🪑",ex:"Please sit down.",exKo:"앉으세요."},
      // 형용사
      {w:"big",pron:"빅",pos:"adj",mean:"큰",emoji:"🐘",ex:"The elephant is big.",exKo:"코끼리는 커요."},
      {w:"small",pron:"스몰",pos:"adj",mean:"작은",emoji:"🐜",ex:"The ant is small.",exKo:"개미는 작아요."},
      {w:"hot",pron:"핫",pos:"adj",mean:"뜨거운, 더운",emoji:"🥵",ex:"The soup is hot.",exKo:"수프는 뜨거워요."},
      {w:"cold",pron:"콜드",pos:"adj",mean:"차가운, 추운",emoji:"🥶",ex:"The ice is cold.",exKo:"얼음은 차가워요."},
      {w:"happy",pron:"해피",pos:"adj",mean:"행복한, 기쁜",emoji:"😀",ex:"I am happy.",exKo:"나는 행복해요."},
      {w:"sad",pron:"새드",pos:"adj",mean:"슬픈",emoji:"😢",ex:"He is sad.",exKo:"그는 슬퍼요."},
      {w:"fast",pron:"패스트",pos:"adj",mean:"빠른",emoji:"🚀",ex:"The car is fast.",exKo:"자동차는 빨라요."},
      {w:"slow",pron:"슬로우",pos:"adj",mean:"느린",emoji:"🐢",ex:"The turtle is slow.",exKo:"거북이는 느려요."},
      {w:"new",pron:"뉴",pos:"adj",mean:"새로운",emoji:"✨",ex:"I have a new bag.",exKo:"나는 새 가방이 있어요."},
      {w:"old",pron:"올드",pos:"adj",mean:"오래된, 늙은",emoji:"📜",ex:"The house is old.",exKo:"그 집은 오래됐어요."},
      {w:"tall",pron:"톨",pos:"adj",mean:"키가 큰",emoji:"🦒",ex:"The giraffe is tall.",exKo:"기린은 키가 커요."},
      {w:"long",pron:"롱",pos:"adj",mean:"긴",emoji:"📏",ex:"The snake is long.",exKo:"뱀은 길어요."},
    ]
  }
};

/* 고정 시드 셔플 (mulberry32) — 알파벳/주제 순서를 섞어 학습 순서를 만듭니다 */
function _mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function _seededShuffle(arr, seed){
  const a=arr.slice(), rnd=_mulberry32(seed);
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(rnd()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
const SHUFFLE_SEED = 20260608;
LEVELS.E1._order = _seededShuffle(LEVELS.E1.words, SHUFFLE_SEED);  // 섞인 학습 순서(고정)

const ACTIVE_LEVEL = "E1";
function getLevel(code){ return LEVELS[code || ACTIVE_LEVEL]; }
function getWords(code){ return getLevel(code)._order; }     // ★ 섞인 순서를 반환
function getPerDay(code){ return getLevel(code).perDay || 10; }
function getDayCount(code){ return Math.ceil(getWords(code).length / getPerDay(code)); }
function getDayIndices(day, code){
  const per=getPerDay(code), n=getWords(code).length, start=(day-1)*per, out=[];
  for(let i=start;i<Math.min(start+per,n);i++) out.push(i);
  return out;
}
