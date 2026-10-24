// Conversation Practice MicroSim
// Chapter 19 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 510 (drawHeight 420 + controlHeight 90); iframe height 512px
// Learning objective (Apply): use supportive, accurate communication moves
// (acknowledge, give one fact, offer a role, set calm boundaries, bring backup)
// to respond to mistaken or stigmatizing comments about gut and mental health.
// Branching: the other person's second line depends on the first choice.
// Feedback labels are teaching judgments, not research data. No scores kept.
// All characters are fictional. Nothing is stored or sent.

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

// ---------- controls ----------
let scenarioSelect, restartButton, nextButton;
let choiceButtons = [];

// ---------- state ----------
// stage: 'q1' (choose first reply), 'f1' (feedback 1), 'q2' (choose second), 'f2' (feedback 2)
let stage = 'q1';
let pick1 = -1, pick2 = -1;

const GOOD = 'Likely to land well';
const MIXED = 'Mixed: depends on the moment';
const BAD = 'Likely to backfire';

const SCENARIOS = [
  {
    name: 'Aunt at dinner (Riya)',
    setting: 'Sunday dinner. Riya, 16, has Crohn\'s disease. Her aunt speaks up in front of everyone.',
    who: 'Aunt',
    opener: '"You\'re too thin. Just eat more ghee and stop worrying. In our day nobody had this Crohn\'s business."',
    first: [
      { say: '"That\'s not true. You don\'t know anything about Crohn\'s."', tag: BAD,
        why: 'The facts are on Riya\'s side, but a public put-down makes most people defensive, and the myth stays put.' },
      { say: '"I know you want me to feel better. Crohn\'s is an immune condition, and my doctor is treating it with medicine. I still love Nani\'s cooking."', tag: GOOD,
        why: 'It acknowledges the care, gives one clear fact, and keeps food as a source of connection instead of a fight.' },
      { say: '(Say nothing and change the subject.)', tag: MIXED,
        why: 'Avoiding a scene at the table is a fair choice. But the myth isn\'t corrected, so it helps to follow up later or ask a parent for backup.' }
    ],
    replies: [
      '"Arre, I was only trying to help! Young people never listen."',
      '"Medicine? At your age? Is it safe to take that all the time?"',
      'Later, in the kitchen: "So, will you try the ghee?"'
    ],
    second: [
      { say: '"Could you help me find recipes that are gentle on my stomach during flares? And you can ask Dr. Alvarez about the medicine at my next visit."', tag: GOOD,
        why: 'It gives the aunt a caring role and points her to a trusted source instead of making Riya defend her medicine alone.' },
      { say: '"Please don\'t talk about my weight in front of everyone."', tag: MIXED,
        why: 'A fair, calm boundary. It usually lands better in private, and pairing it with a role ("here\'s how you can help") softens it.' },
      { say: '"Fine, maybe I\'ll stop my medicine and just try the ghee."', tag: BAD,
        why: 'Never stop or change a medicine without the care team. Food can\'t replace treatment for Crohn\'s, and stopping can lead to a flare.' }
    ]
  },
  {
    name: 'Teacher and the restroom (Riya)',
    setting: 'Third period quiz. Riya needs the restroom for the second time this class.',
    who: 'Teacher',
    opener: '"You\'ve asked to leave three times this week. I need you to stay in your seat during the quiz."',
    first: [
      { say: '(Get up and leave without saying anything.)', tag: BAD,
        why: 'Her need is real, but walking out without a word reads as defiance, and the teacher still doesn\'t understand.' },
      { say: '"I have a health condition, and my 504 plan includes restroom access. Could we talk after class about making it less disruptive?"', tag: GOOD,
        why: 'Short, private, and specific. Mentioning the 504 plan tells the teacher this is an agreed accommodation, not an excuse.' },
      { say: '(Explain every symptom in detail in front of the class.)', tag: MIXED,
        why: 'Honesty helps, but you don\'t owe the whole class medical details. A short statement now and details in private protect your privacy.' }
    ],
    replies: [
      'Next day: "Riya, we need to talk about yesterday."',
      '"Oh, I didn\'t know there was a plan. Can you remind me what it says?"',
      'An awkward pause. "Okay... let\'s talk after class."'
    ],
    second: [
      { say: '"It includes unlimited restroom access and stop-the-clock testing. The counselor has a copy, and I can use a quiet signal so I don\'t interrupt."', tag: GOOD,
        why: 'Specific accommodations plus an offer to reduce disruption make it easy for the teacher to say yes.' },
      { say: '"Never mind. I\'ll just hold it."', tag: BAD,
        why: 'Hiding symptoms (illness concealment) adds stress and discomfort, and the plan exists so she doesn\'t have to.' },
      { say: '"Can my mom email you about it?"', tag: MIXED,
        why: 'Bringing in backup is fine, especially at first. Over time, speaking up for yourself is a skill worth practicing.' }
    ]
  },
  {
    name: 'Friend asks about missed school (Riya)',
    setting: 'At lockers. Riya was out two days for a flare and an appointment.',
    who: 'Friend',
    opener: '"You were gone again. Are you just skipping? People are talking."',
    first: [
      { say: '"I have Crohn\'s disease. It\'s inflammation in my gut, so sometimes I\'m out for flares or appointments."', tag: GOOD,
        why: 'Sharing as much as she\'s comfortable with turns a rumor into understanding, and gives a friend a chance to support her.' },
      { say: '"That\'s none of your business."', tag: MIXED,
        why: 'Privacy is her right, and some days that\'s the right call. It may leave the friend confused, so she might add "I\'ll explain another time."' },
      { say: '"I had a dentist appointment."', tag: MIXED,
        why: 'A cover story protects privacy today, but repeated excuses can be hard to keep up and can make support harder to get.' }
    ],
    replies: [
      '"Whoa, I had no idea. Is it contagious? Do you need anything?"',
      '"Okay, sorry. I was just worried about you."',
      '"Again? That\'s a lot of dentist appointments."'
    ],
    second: [
      { say: '"It\'s not contagious. Mostly I\'d love it if you saved me notes and didn\'t make a big deal when I leave class."', tag: GOOD,
        why: 'Corrects a common worry and gives the friend a simple, concrete way to help: classic peer support.' },
      { say: '"Forget it. Nobody gets it."', tag: MIXED,
        why: 'That frustration is understandable, but it closes a door that was opening. It\'s okay to say "I\'m tired of explaining today."' },
      { say: '"Can you keep it between us for now? But thanks for asking."', tag: GOOD,
        why: 'Setting limits on who knows is reasonable, and thanking the friend keeps the connection.' }
    ]
  },
  {
    name: 'Coach before a race (Sam)',
    setting: 'Cross-country meet. Sam, 16, has IBS. His stomach is cramping before the start.',
    who: 'Coach',
    opener: '"Your stomach again? It\'s just nerves. Push through it."',
    first: [
      { say: '"It\'s IBS, a real gut condition. Nerves make it worse, but it isn\'t just in my head. Can I warm up near the restrooms?"', tag: GOOD,
        why: 'Agrees with the true part (stress affects the gut), corrects the false part, and asks for one specific thing.' },
      { say: '(Say nothing, hide it, and run anyway.)', tag: MIXED,
        why: 'Sometimes running through mild symptoms works. But hiding them means the coach can\'t help if things get worse mid-race.' },
      { say: '"Yeah, maybe I\'m just weak."', tag: BAD,
        why: 'That\'s self-stigma talking. IBS is a real condition, and believing you\'re weak can add stress and make symptoms worse.' }
    ],
    replies: [
      '"Okay. What helps you on race days?"',
      'After the race: "You stopped at mile two. What happened out there?"',
      '"Hey, that\'s not what I meant. Talk to me."'
    ],
    second: [
      { say: '"Slow breathing before the start and knowing where the restrooms are. My doctor can write a note if that helps."', tag: GOOD,
        why: 'Concrete strategies plus an offer of medical backup make it easy for the coach to support him.' },
      { say: '"Nothing helps. Forget it."', tag: MIXED,
        why: 'Frustration is normal, but it shuts down a coach who\'s now willing to listen.' },
      { say: '"Could my parents and I meet with you to make a plan for meets?"', tag: GOOD,
        why: 'Bringing in backup and planning ahead turns one awkward moment into a lasting solution.' }
    ]
  }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: scenario select + restart
  scenarioSelect = createSelect();
  for (const s of SCENARIOS) scenarioSelect.option(s.name);
  scenarioSelect.selected(SCENARIOS[0].name);
  scenarioSelect.position(10, drawHeight + 10);
  scenarioSelect.changed(restart);

  restartButton = createButton('Restart');
  restartButton.mousePressed(restart);

  // Row 2: choice buttons + next
  const labels = ['Choose A', 'Choose B', 'Choose C'];
  for (let i = 0; i < 3; i++) {
    const b = createButton(labels[i]);
    b.mousePressed(() => choose(i));
    choiceButtons.push(b);
  }
  nextButton = createButton('Next');
  nextButton.mousePressed(goNext);

  positionControls();
  updateButtons();

  describe('A conversation practice scenario. A speech bubble shows what another person says, ' +
    'followed by three possible replies labeled A, B, and C. After you choose, a feedback card ' +
    'says whether the reply is likely to land well, mixed, or likely to backfire, and explains why.');
}

function positionControls() {
  restartButton.position(min(canvasWidth - 80, 280), drawHeight + 10);
  let x = 10;
  for (const b of choiceButtons) {
    b.position(x, drawHeight + 50);
    x += 82;
  }
  nextButton.position(x + 4, drawHeight + 50);
}

function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawContent();
}

// ---------- state changes ----------
function current() {
  return SCENARIOS.find(s => s.name === scenarioSelect.value());
}

function restart() {
  stage = 'q1';
  pick1 = -1;
  pick2 = -1;
  updateButtons();
}

function choose(i) {
  if (stage === 'q1') { pick1 = i; stage = 'f1'; }
  else if (stage === 'q2') { pick2 = i; stage = 'f2'; }
  updateButtons();
}

function goNext() {
  if (stage === 'f1') { stage = 'q2'; }
  updateButtons();
}

function updateButtons() {
  const choosing = stage === 'q1' || stage === 'q2';
  for (const b of choiceButtons) {
    if (choosing) b.removeAttribute('disabled'); else b.attribute('disabled', '');
  }
  if (stage === 'f1') nextButton.removeAttribute('disabled'); else nextButton.attribute('disabled', '');
}

// ---------- text helpers ----------
function wrapLines(str, w) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const wd of words) {
    const test = line ? line + ' ' + wd : wd;
    if (textWidth(test) > w && line) { lines.push(line); line = wd; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function lineH() { return textSize() * 1.28; }

// draw wrapped text at (x, y), return height
function para(str, x, y, w) {
  const lines = wrapLines(str, w);
  textAlign(LEFT, TOP);
  lines.forEach((l, i) => text(l, x, y + i * lineH()));
  return lines.length * lineH();
}

function paraHeight(str, w) {
  return wrapLines(str, w).length * lineH();
}

function tagColor(tag) {
  if (tag === GOOD) return 'seagreen';
  if (tag === BAD) return 'firebrick';
  return 'darkorange';
}

// ---------- drawing ----------
function drawContent() {
  const s = current();
  const w = canvasWidth - 2 * margin;
  let bodySize = canvasWidth < 520 ? 14 : 15;

  // title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  let ts = 22;
  textSize(ts);
  const title = 'Conversation Practice';
  while (textWidth(title) > canvasWidth - 20 && ts > 14) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 8);

  textSize(14);
  fill('dimgray');
  let y = 38;
  const instr = stage === 'q1' || stage === 'q2'
    ? 'Read the line, then press Choose A, B, or C below.'
    : (stage === 'f1' ? 'Read the feedback, then press Next.' : 'Try another path with Restart, or pick a new scenario.');
  textAlign(CENTER, TOP);
  text(instr, canvasWidth / 2, y);
  y += 22;

  textSize(bodySize);
  fill('darkslategray');
  textStyle(ITALIC);
  y += para(s.setting, margin, y, w) + 6;
  textStyle(NORMAL);

  // speech bubble from the other person
  const line = (stage === 'q1' || stage === 'f1') ? s.opener : s.replies[pick1];
  const bubbleH = paraHeight(line, w - 20) + lineH() + 14;
  fill('white');
  stroke('steelblue');
  strokeWeight(2);
  rect(margin, y, w, bubbleH, 12);
  noStroke();
  fill('steelblue');
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(s.who + ' says:', margin + 10, y + 7);
  textStyle(NORMAL);
  fill('black');
  para(line, margin + 10, y + 7 + lineH(), w - 20);
  y += bubbleH + 10;

  const opts = (stage === 'q1' || stage === 'f1') ? s.first : s.second;
  const letters = ['A', 'B', 'C'];

  if (stage === 'q1' || stage === 'q2') {
    fill('black');
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text((s.who === 'Coach' ? 'Sam' : 'Riya') + ' could say:', margin, y);
    textStyle(NORMAL);
    y += lineH() + 2;
    for (let i = 0; i < 3; i++) {
      const h = paraHeight(opts[i].say, w - 34) + 10;
      fill(255, 255, 255, 230);
      stroke(200);
      strokeWeight(1);
      rect(margin, y, w, h, 8);
      noStroke();
      fill('navy');
      textStyle(BOLD);
      text(letters[i], margin + 10, y + 5);
      textStyle(NORMAL);
      fill('black');
      para(opts[i].say, margin + 28, y + 5, w - 34);
      y += h + 6;
    }
  } else {
    const p = stage === 'f1' ? pick1 : pick2;
    const o = opts[p];
    fill('black');
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('You chose ' + letters[p] + ':', margin, y);
    textStyle(NORMAL);
    y += lineH();
    y += para(o.say, margin, y, w) + 10;

    // feedback card
    const col = tagColor(o.tag);
    const cardH = lineH() + paraHeight(o.why, w - 20) + 18;
    fill('white');
    stroke(col);
    strokeWeight(3);
    rect(margin, y, w, cardH, 10);
    noStroke();
    fill(col);
    textStyle(BOLD);
    text(o.tag, margin + 10, y + 7);
    textStyle(NORMAL);
    fill('black');
    para(o.why, margin + 10, y + 7 + lineH(), w - 20);
    y += cardH + 10;

    if (stage === 'f2') {
      fill('dimgray');
      textSize(14);
      para('There is no single perfect script. A "mixed" reply can be the right choice for you in a given moment.', margin, y, w);
    }
  }
}

// ---------- responsive ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionControls();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
