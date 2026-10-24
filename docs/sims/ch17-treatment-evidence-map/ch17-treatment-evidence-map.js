// Treatment Evidence Map MicroSim
// Chapter 17 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 560 (drawHeight 500 + controlHeight 60); iframe height 562px
// Learning objective (Evaluate): classify gut-brain treatments by FDA status
// and strength of evidence: approved/cleared or guideline standard care,
// experimental (still in trials), or unproven/unsafe.
// Statuses are as of October 2026 and match Chapter 17. Not medical advice.

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

// ---------- controls ----------
let nextButton, restartButton;

// ---------- data ----------
const BINS = [
  { key: 'approved', title: 'Approved, cleared, or standard care', color: 'honeydew', edge: 'seagreen' },
  { key: 'experimental', title: 'Experimental (still being tested)', color: 'lightyellow', edge: 'darkgoldenrod' },
  { key: 'unproven', title: 'Unproven or unsafe', color: 'mistyrose', edge: 'firebrick' }
];

const CARDS = [
  { label: 'Microbiome product to prevent C. diff coming back', short: 'C. diff product',
    bin: 'approved',
    why: 'FDA approved Rebyota (Nov 30, 2022) and Vowst (Apr 26, 2023) to prevent recurrent C. diff in adults after antibiotics.' },
  { label: 'Fecal transplant for ulcerative colitis', short: 'FMT for UC',
    bin: 'experimental',
    why: 'A 2023 Cochrane review found it may help some people reach remission, but the evidence is low certainty. Not approved.' },
  { label: 'Fecal transplant for autism', short: 'FMT for autism',
    bin: 'experimental',
    why: 'Only small studies so far, including an open-label study of 18 children with no placebo group. Not approved, and not a cure.' },
  { label: 'Do-it-yourself fecal transplant at home', short: 'DIY FMT',
    bin: 'unproven',
    why: 'Unscreened stool can carry dangerous germs. Even screened FMT once spread a drug-resistant E. coli infection that killed a patient (2019).' },
  { label: 'Implanted vagus nerve stimulator for epilepsy', short: 'VNS epilepsy',
    bin: 'approved',
    why: 'FDA approved in 1997 as an add-on treatment for drug-resistant partial-onset seizures.' },
  { label: 'Implanted vagus nerve stimulator for treatment-resistant depression', short: 'VNS depression',
    bin: 'approved',
    why: 'FDA approved in 2005 as an add-on for adults whose depression has not improved after 4 or more treatments.' },
  { label: 'Implanted vagus nerve stimulator for rheumatoid arthritis', short: 'VNS arthritis',
    bin: 'approved',
    why: 'The SetPoint System was FDA approved July 30, 2025 for adults whose RA did not respond to biologic or targeted drugs.' },
  { label: 'Vagus nerve stimulation for Crohn\'s disease', short: 'VNS Crohn\'s',
    bin: 'experimental',
    why: 'Only tiny pilot studies (one followed 7 patients). Not approved for Crohn\'s disease.' },
  { label: 'Handheld neck stimulator (gammaCore) for cluster headache', short: 'gammaCore',
    bin: 'approved',
    why: 'FDA authorized it in 2017 (cluster headache) and cleared it in 2018 (migraine) for adults. Authorized and cleared, not "approved."' },
  { label: '$300 ear-clip "vagus" gadget sold to cure anxiety', short: 'Ear gadget',
    bin: 'unproven',
    why: 'Consumer wellness gadgets are not the devices tested in trials, and no device is approved to treat anxiety this way.' },
  { label: 'Low-dose tricyclic antidepressant for IBS pain', short: 'TCA for IBS',
    bin: 'approved',
    why: 'US guidelines support it (ACG 2021 strongly, AGA 2022 conditionally), backed by trials. It is off-label but standard care.' },
  { label: 'Biologic medicine for Crohn\'s disease', short: 'Biologic',
    bin: 'approved',
    why: 'Several biologics are FDA approved for Crohn\'s disease and are standard care, like Riya\'s injections.' },
  { label: 'Fecal transplant for Parkinson\'s disease', short: 'FMT Parkinson\'s',
    bin: 'experimental',
    why: 'Small placebo-controlled trials disagree: one found a mild movement benefit, two found no meaningful movement benefit. Not approved.' }
];

// ---------- state ----------
let order = [];
let idx = 0;
let placed = [];          // {card, chosen, correct}
let feedback = null;      // {correct, card, chosen}
let dragging = false;
let dragOffX = 0, dragOffY = 0;
let cardX = 0, cardY = 0; // top-left of the current card while dragging

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  nextButton = createButton('Next card');
  nextButton.position(10, drawHeight + 15);
  nextButton.mousePressed(nextCard);

  restartButton = createButton('Start over');
  restartButton.position(110, drawHeight + 15);
  restartButton.mousePressed(restart);

  restart();

  describe('A card sorting activity. One treatment card at a time appears at the top. ' +
    'Drag it, or tap a bin, to sort it into Approved, cleared, or standard care; Experimental; or Unproven or unsafe. ' +
    'After each choice, a panel explains the correct answer and the reason. A score is shown.');
}

function restart() {
  order = shuffle([...Array(CARDS.length).keys()]);
  idx = 0;
  placed = [];
  feedback = null;
  dragging = false;
}

function nextCard() {
  if (feedback && idx < CARDS.length) {
    idx++;
    feedback = null;
  }
}

// ---------- geometry ----------
function cardRect() {
  const w = min(canvasWidth - 40, 460);
  return { x: (canvasWidth - w) / 2, y: 78, w: w, h: 74 };
}
function binRects() {
  const top = 300, h = 194, gap = 8;
  const w = (canvasWidth - 2 * margin - 2 * gap) / 3;
  return BINS.map((b, i) => ({ x: margin + i * (w + gap), y: top, w: w, h: h, bin: b }));
}

// ---------- draw ----------
function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawBins();
  drawFeedback();
  drawCurrentCard();
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  let ts = 24;
  textSize(ts);
  const title = 'Treatment Evidence Map';
  while (textWidth(title) > canvasWidth - 20 && ts > 16) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 10);
  fill('dimgray');
  textSize(14);
  textWrap(WORD);
  text('Drag the card into a bin (or tap a bin). Status as of October 2026.', 10, 42, canvasWidth - 20);
}

function drawCurrentCard() {
  const r = cardRect();
  if (idx >= CARDS.length) {
    noStroke();
    fill('black');
    textAlign(CENTER, CENTER);
    textSize(18);
    const score = placed.filter(p => p.correct).length;
    text('All sorted! Score: ' + score + ' of ' + CARDS.length, canvasWidth / 2, r.y + r.h / 2 - 10);
    textSize(14);
    fill('dimgray');
    text('Press Start over to shuffle and try again.', canvasWidth / 2, r.y + r.h / 2 + 16);
    return;
  }
  if (feedback) {
    // card already placed: show a faded placeholder
    noStroke();
    fill('dimgray');
    textAlign(CENTER, CENTER);
    textSize(15);
    text('Card ' + (idx + 1) + ' of ' + CARDS.length + ' sorted. Press Next card.', canvasWidth / 2, r.y + r.h / 2);
    return;
  }
  const c = CARDS[order[idx]];
  const x = dragging ? cardX : r.x;
  const y = dragging ? cardY : r.y;
  stroke('steelblue');
  strokeWeight(2);
  fill('white');
  rect(x, y, r.w, r.h, 8);
  noStroke();
  fill('steelblue');
  textSize(14);
  textAlign(LEFT, TOP);
  text('Card ' + (idx + 1) + ' of ' + CARDS.length, x + 10, y + 6);
  fill('black');
  textSize(16);
  textWrap(WORD);
  text(c.label, x + 10, y + 26, r.w - 20);
}

function drawBins() {
  for (const br of binRects()) {
    const over = dragging && pointIn(mouseX, mouseY, br);
    stroke(br.bin.edge);
    strokeWeight(over ? 4 : 2);
    fill(br.bin.color);
    rect(br.x, br.y, br.w, br.h, 8);
    noStroke();
    fill(br.bin.edge);
    textAlign(CENTER, TOP);
    textSize(14);
    textWrap(WORD);
    text(br.bin.title, br.x + 4, br.y + 6, br.w - 8);
    // list sorted cards
    const items = placed.filter(p => p.chosen === br.bin.key);
    textAlign(LEFT, TOP);
    textSize(14);
    const lines = wrapCount(br.bin.title, br.w - 8);
    let yy = br.y + 12 + lines * 18;
    const maxItems = max(1, floor((br.y + br.h - 4 - yy) / 18));
    for (const p of items.slice(-maxItems)) {
      fill(p.correct ? 'darkgreen' : 'firebrick');
      let s = (p.correct ? '✓ ' : '✗ ') + p.card.short;
      while (textWidth(s) > br.w - 10 && s.length > 4) s = s.slice(0, -2) + '…';
      text(s, br.x + 6, yy);
      yy += 18;
    }
  }
}

function drawFeedback() {
  const y0 = 160, h = 132;
  if (!feedback) {
    noStroke();
    fill('dimgray');
    textSize(14);
    textAlign(CENTER, CENTER);
    textWrap(WORD);
    const score = placed.filter(p => p.correct).length;
    text('Score so far: ' + score + ' of ' + placed.length, canvasWidth / 2, y0 + h / 2);
    return;
  }
  const good = feedback.correct;
  stroke(good ? 'seagreen' : 'firebrick');
  strokeWeight(2);
  fill('white');
  rect(10, y0, canvasWidth - 20, h, 8);
  noStroke();
  fill(good ? 'darkgreen' : 'firebrick');
  textAlign(LEFT, TOP);
  textSize(16);
  const correctBin = BINS.find(b => b.key === feedback.card.bin);
  const head = good ? 'Correct!' : 'Not quite. It belongs in: ' + correctBin.title;
  textWrap(WORD);
  text(head, 20, y0 + 8, canvasWidth - 40);
  const headLines = wrapCount(head, canvasWidth - 40);
  fill('black');
  textSize(14);
  text(feedback.card.why, 20, y0 + 14 + headLines * 21, canvasWidth - 40);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(14);
  if (canvasWidth > 330) {
    const score = placed.filter(p => p.correct).length;
    text('Score: ' + score + '/' + placed.length, 215, drawHeight + 27);
  }
}

// count the lines a string needs when word-wrapped at the current text size
function wrapCount(s, w) {
  const words = s.split(' ');
  let lines = 1, line = '';
  for (const wd of words) {
    const test = line ? line + ' ' + wd : wd;
    if (textWidth(test) > w && line) { lines++; line = wd; } else { line = test; }
  }
  return lines;
}

// ---------- interaction ----------
function pointIn(px, py, r) {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

function mousePressed() {
  if (idx >= CARDS.length || feedback) return;
  const r = cardRect();
  if (pointIn(mouseX, mouseY, r)) {
    dragging = true;
    dragOffX = mouseX - r.x;
    dragOffY = mouseY - r.y;
    cardX = r.x;
    cardY = r.y;
    return false;
  }
  // tap a bin to place the card
  for (const br of binRects()) {
    if (pointIn(mouseX, mouseY, br)) { placeCard(br.bin.key); return false; }
  }
}

function mouseDragged() {
  if (dragging) {
    cardX = mouseX - dragOffX;
    cardY = mouseY - dragOffY;
    return false;
  }
}

function mouseReleased() {
  if (!dragging) return;
  dragging = false;
  for (const br of binRects()) {
    if (pointIn(mouseX, mouseY, br)) { placeCard(br.bin.key); return false; }
  }
}

function placeCard(key) {
  const c = CARDS[order[idx]];
  const ok = c.bin === key;
  placed.push({ card: c, chosen: key, correct: ok });
  feedback = { correct: ok, card: c, chosen: key };
}

// ---------- responsive ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
