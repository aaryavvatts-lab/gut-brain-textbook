// Hype Meter Sorter MicroSim
// Chapter 20 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 515 (drawHeight 430 + controlHeight 85); iframe height 517px
// Learning objective (Evaluate): grade real gut-brain claims from across the book
// as Strong, Moderate, Preliminary, or Hype, then compare with the book's grade
// and its one-sentence reason. Tracks whether misses lean "too generous" or "too harsh".
// Every grade and number below matches the chapter text and CLAUDE.md canonical values.
// Not animated, so there is no Start/Pause button.

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 85;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

// ---------- grades ----------
const GRADES = ['Strong', 'Moderate', 'Preliminary', 'Hype'];
const GRADE_COLORS = {
  Strong: 'forestgreen',
  Moderate: 'royalblue',
  Preliminary: 'darkorange',
  Hype: 'firebrick'
};
const GRADE_TINTS = {
  Strong: 'honeydew',
  Moderate: 'aliceblue',
  Preliminary: 'oldlace',
  Hype: 'mistyrose'
};

// ---------- claim cards (book grade + one-sentence reason) ----------
const CARDS = [
  { claim: '"70% of your immune system lives in your gut."', grade: 'Hype', ch: 4,
    reason: 'The gut holds about 70% of the antibody-making plasma cells, but only about 3% of all immune cells (Sender et al. 2023).' },
  { claim: '"More than 90% of your body\'s serotonin is made in your gut."', grade: 'Strong', ch: 5,
    reason: 'Human and animal studies agree that gut enterochromaffin cells make most of the body\'s serotonin (some estimates say about 95%).' },
  { claim: '"Probiotics treat depression."', grade: 'Preliminary', ch: 16,
    reason: 'A 2024 review of 12 trials (707 people) found a benefit on one depression scale but not on three others.' },
  { claim: '"Gut-directed hypnotherapy can ease IBS symptoms."', grade: 'Moderate', ch: 18,
    reason: 'A 2020 analysis of 41 trials of psychological therapies found it helped, but many trials had a high risk of bias, so the benefit may be overestimated.' },
  { claim: '"Implanted vagus nerve stimulation is FDA approved for treatment-resistant depression."', grade: 'Strong', ch: 17,
    reason: 'FDA approved it in 2005 as an add-on for adults after 4 or more failed treatments. The approval is solid; evidence of benefit is Moderate.' },
  { claim: '"Leaky gut causes autism."', grade: 'Hype', ch: 13,
    reason: 'No human study shows this. The idea leans on a mouse model, and autism is a neurodevelopmental difference, not a gut disease.' },
  { claim: '"Poor sleep is linked to later Crohn\'s flares."', grade: 'Preliminary', ch: 18,
    reason: 'One large patient study found poor sleep during Crohn\'s remission went with twice the odds of a flare 6 months later. It needs repeating, and a link is not proof of cause.' },
  { claim: '"Vagus nerve stimulation can calm Crohn\'s disease."', grade: 'Preliminary', ch: 17,
    reason: 'Only small open-label studies (7 and 16 patients) with no comparison group so far. VNS is not approved for Crohn\'s.' },
  { claim: '"Your gut has more neurons than your brain."', grade: 'Hype', ch: 1,
    reason: 'The gut has about 400 to 600 million neurons. The brain has about 86 billion.' },
  { claim: '"An FDA-approved microbiome pill helps stop C. diff infection from coming back."', grade: 'Strong', ch: 17,
    reason: 'Vowst was approved in 2023 for adults after antibiotics for recurrent C. diff. In its trial, recurrence was 12.4% vs 39.8% on placebo.' },
  { claim: '"A Mediterranean-style diet helps adults with depression."', grade: 'Preliminary', ch: 15,
    reason: 'The SMILES trial (67 adults, 12 weeks) was promising, but it was small, short, and people knew which group they were in.' },
  { claim: '"People with IBD are more likely to have anxiety and depression symptoms."', grade: 'Strong', ch: 11,
    reason: 'A review of 77 studies (30,118 adults) found anxiety symptoms in about 32% and depression symptoms in about 25%, higher during flares. A link, not a cause.' },
  { claim: '"Serotonin from your gut travels to your brain and lifts your mood."', grade: 'Hype', ch: 5,
    reason: 'Gut serotonin does not cross the blood-brain barrier. The brain makes its own serotonin from tryptophan.' },
  { claim: '"Stress can physically change how your gut works."', grade: 'Moderate', ch: 7,
    reason: 'Small human experiments show stress hormones can speed up the colon and make the gut leakier, but how big these effects are in daily life is unclear.' },
  { claim: '"People with Alzheimer\'s disease have different gut bacteria."', grade: 'Preliminary', ch: 14,
    reason: 'Small early studies (one compared 25 people with Alzheimer\'s to 25 without) found differences, but they can\'t show cause.' },
  { claim: '"Fecal transplant can help some people with active ulcerative colitis reach remission."', grade: 'Preliminary', ch: 17,
    reason: 'A 2023 Cochrane review of 12 small trials found it may help, but rated the evidence low certainty. It is still experimental for UC.' }
];

// ---------- state ----------
let order = [];       // indices into CARDS
let pos = 0;          // which card in the order
let choice = null;    // the learner's grade for the current card
let matched = 0, tooGenerous = 0, tooHarsh = 0, answered = 0;
let sortedCounts = { Strong: 0, Moderate: 0, Preliminary: 0, Hype: 0 };

// ---------- controls ----------
let gradeButtons = [];
let nextButton, restartButton, hintCheckbox;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: the four grade buttons
  for (let g of GRADES) {
    const b = createButton(g);
    b.style('font-size', '15px');
    b.style('border', '2px solid ' + GRADE_COLORS[g]);
    b.style('background', GRADE_TINTS[g]);
    b.style('border-radius', '4px');
    b.style('padding', '3px 8px');
    b.mousePressed(() => chooseGrade(g));
    gradeButtons.push(b);
  }

  // Row 2: next card, start over, chapter hint
  nextButton = createButton('Next card');
  nextButton.style('font-size', '15px');
  nextButton.mousePressed(nextCard);
  restartButton = createButton('Start over');
  restartButton.style('font-size', '15px');
  restartButton.mousePressed(() => resetSorter(true));
  hintCheckbox = createCheckbox(' Show chapter', false);
  hintCheckbox.style('font-size', '15px');

  positionControls();
  resetSorter(false);

  describe('A claim-sorting game. A card shows a popular gut-brain claim. The learner picks Strong, ' +
    'Moderate, Preliminary, or Hype, then sees the textbook\'s grade, a one-sentence reason, and a running ' +
    'count of matches and of grades that were too generous or too harsh.');
}

function positionControls() {
  let x = 10;
  for (let b of gradeButtons) {
    b.position(x, drawHeight + 8);
    x += b.elt.offsetWidth + 8;
  }
  nextButton.position(10, drawHeight + 46);
  restartButton.position(10 + nextButton.elt.offsetWidth + 8, drawHeight + 46);
  hintCheckbox.position(10 + nextButton.elt.offsetWidth + restartButton.elt.offsetWidth + 24, drawHeight + 49);
}

function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  if (pos < order.length) {
    drawCard();
    drawFeedback();
  } else {
    drawSummary();
  }
  drawTally();
}

// ---------- logic ----------
function resetSorter(shuffleCards) {
  order = CARDS.map((c, i) => i);
  if (shuffleCards) order = shuffle(order);
  pos = 0;
  choice = null;
  matched = tooGenerous = tooHarsh = answered = 0;
  sortedCounts = { Strong: 0, Moderate: 0, Preliminary: 0, Hype: 0 };
  setGradeButtonsEnabled(true);
  nextButton.html('Next card');
  nextButton.elt.disabled = true;
  positionControls();
}

function chooseGrade(g) {
  if (choice !== null || pos >= order.length) return;
  choice = g;
  const book = CARDS[order[pos]].grade;
  answered++;
  sortedCounts[book]++;
  const diff = GRADES.indexOf(g) - GRADES.indexOf(book);
  if (diff === 0) matched++;
  else if (diff < 0) tooGenerous++; // picked a grade closer to Strong than the evidence supports
  else tooHarsh++;
  setGradeButtonsEnabled(false);
  nextButton.elt.disabled = false;
  if (pos === order.length - 1) nextButton.html('See results');
  positionControls();
}

function nextCard() {
  if (choice === null && pos < order.length) return;
  pos++;
  choice = null;
  if (pos < order.length) {
    setGradeButtonsEnabled(true);
    nextButton.elt.disabled = true;
  } else {
    nextButton.elt.disabled = true;
  }
}

function setGradeButtonsEnabled(on) {
  for (let b of gradeButtons) b.elt.disabled = !on;
}

// ---------- drawing ----------
function fitText(str, maxW, startSize, minSize) {
  let ts = startSize;
  textSize(ts);
  while (textWidth(str) > maxW && ts > minSize) {
    ts--;
    textSize(ts);
  }
  return ts;
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  fitText('Hype Meter Sorter', canvasWidth - 2 * margin, 24, 16);
  text('Hype Meter Sorter', canvasWidth / 2, 8);
  textStyle(NORMAL);
  fill('dimgray');
  const instr = 'Read the claim. Pick a grade below. Then compare with the book.';
  const ts = fitText(instr, canvasWidth - 2 * margin, 15, 14);
  if (textWidth(instr) <= canvasWidth - 2 * margin) {
    text(instr, canvasWidth / 2, 38);
  } else {
    textSize(14);
    text(instr, margin, 36, canvasWidth - 2 * margin, 40);
  }
}

function drawCard() {
  const c = CARDS[order[pos]];
  const x = margin, y = 78, w = canvasWidth - 2 * margin, h = 112;
  stroke('slategray');
  strokeWeight(1.5);
  fill('white');
  rect(x, y, w, h, 10);

  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Card ' + (pos + 1) + ' of ' + order.length, x + 12, y + 8);
  if (hintCheckbox.checked()) {
    textAlign(RIGHT, TOP);
    text('From Chapter ' + c.ch, x + w - 12, y + 8);
  }

  fill('black');
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textSize(canvasWidth < 520 ? 16 : 18);
  text(c.claim, x + 14, y + 28, w - 28, h - 34);
  textStyle(NORMAL);
}

function drawFeedback() {
  const x = margin, y = 200, w = canvasWidth - 2 * margin, h = 140;
  const c = CARDS[order[pos]];
  noStroke();
  if (choice === null) {
    fill('dimgray');
    textAlign(CENTER, TOP);
    textSize(15);
    const q = w < 480 ? 'Which grade fits this claim, as stated?' : 'Which grade fits the evidence for this claim, as stated?';
    text(q, x, y + 6, w, 44);
    // a short legend of the four grades (text only, so it doesn't look clickable)
    const narrow = w < 480;
    const defs = narrow ? [
      ['Strong', 'consistent evidence in people'],
      ['Moderate', 'some human data, cause unclear'],
      ['Preliminary', 'small, early, or animal studies'],
      ['Hype', 'evidence does not support it']
    ] : [
      ['Strong', 'consistent evidence in people'],
      ['Moderate', 'some human evidence, or a solid link with unclear cause'],
      ['Preliminary', 'small, early, short, or mostly animal studies'],
      ['Hype', 'popular, but the evidence does not support it']
    ];
    textAlign(LEFT, TOP);
    textSize(14);
    let ly = y + 40;
    for (let d of defs) {
      textStyle(BOLD);
      fill(GRADE_COLORS[d[0]]);
      text(d[0] + ':', x + 8, ly);
      const lw = textWidth(d[0] + ': ');
      textStyle(NORMAL);
      fill('black');
      const rest = d[1];
      if (lw + textWidth(rest) <= w - 16) {
        text(rest, x + 8 + lw, ly);
        ly += 21;
      } else {
        text(rest, x + 8 + lw, ly, w - 16 - lw, 40);
        ly += 38;
      }
    }
    return;
  }

  // answered: show the book's grade and reason
  const book = c.grade;
  fill(GRADE_TINTS[book]);
  stroke(GRADE_COLORS[book]);
  strokeWeight(2);
  rect(x, y, w, h, 10);
  noStroke();
  fill(GRADE_COLORS[book]);
  rect(x, y, w, 30, 10, 10, 0, 0);
  fill('white');
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  fitText("Book's grade: " + book, w - 24, 17, 14);
  text("Book's grade: " + book, x + 12, y + 15);
  textStyle(NORMAL);

  const diff = GRADES.indexOf(choice) - GRADES.indexOf(book);
  let verdict;
  if (diff === 0) verdict = 'You chose ' + choice + '. Match!';
  else if (diff < 0) verdict = 'You chose ' + choice + ': too generous for this evidence.';
  else verdict = 'You chose ' + choice + ': too harsh for this evidence.';
  fill(diff === 0 ? 'darkgreen' : 'black');
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(verdict, x + 12, y + 36, w - 24, 40);
  textStyle(NORMAL);
  fill('black');
  textSize(15);
  const vLines = textWidth(verdict) > w - 24 ? 2 : 1;
  text(c.reason, x + 12, y + 40 + vLines * 19, w - 24, h - 44 - vLines * 19);
}

function drawSummary() {
  const x = margin, y = 78, w = canvasWidth - 2 * margin, h = 262;
  stroke('slategray');
  strokeWeight(1.5);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(20);
  text('All ' + order.length + ' cards sorted!', x, y + 14, w, 30);
  textStyle(NORMAL);
  textSize(17);
  text('You matched the book on ' + matched + ' of ' + order.length + '.', x + 12, y + 50, w - 24, 50);
  textSize(15);
  let lean;
  if (tooGenerous === 0 && tooHarsh === 0) lean = 'No misses at all. You read evidence like a scientist.';
  else if (tooGenerous > tooHarsh) lean = 'Your misses leaned too generous (' + tooGenerous + ' vs ' + tooHarsh +
    '). Ask: was it tested in people, and how many?';
  else if (tooHarsh > tooGenerous) lean = 'Your misses leaned too harsh (' + tooHarsh + ' vs ' + tooGenerous +
    '). Some gut-brain facts really are solid; skepticism is not the same as doubting everything.';
  else lean = 'Your misses were balanced (' + tooGenerous + ' too generous, ' + tooHarsh + ' too harsh).';
  text(lean, x + 16, y + 104, w - 32, 90);
  fill('dimgray');
  text('Press Start over to reshuffle and try again.', x + 16, y + 210, w - 32, 50);
}

function drawTally() {
  const x = margin, y = 370, w = canvasWidth - 2 * margin;
  const segW = w / 4;
  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(14);
  text("Cards so far, by the book's grade:", x + 2, y - 20);
  for (let i = 0; i < 4; i++) {
    const g = GRADES[i];
    stroke(GRADE_COLORS[g]);
    strokeWeight(1.5);
    fill(GRADE_TINTS[g]);
    rect(x + i * segW + 2, y, segW - 4, 26);
    noStroke();
    fill(GRADE_COLORS[g]);
    textAlign(CENTER, CENTER);
    const label = (segW > 110 ? g + ': ' : g.charAt(0) + ': ') + sortedCounts[g];
    textSize(14);
    text(label, x + i * segW + segW / 2, y + 13);
  }
  fill('black');
  const score = 'Matched ' + matched + ' of ' + answered + '   Too generous ' + tooGenerous + '   Too harsh ' + tooHarsh;
  textAlign(CENTER, TOP);
  fitText(score, w, 15, 14);
  if (textWidth(score) <= w) {
    text(score, canvasWidth / 2, y + 34);
  } else {
    textSize(14);
    text('Matched ' + matched + '/' + answered + '  Generous ' + tooGenerous + '  Harsh ' + tooHarsh,
      canvasWidth / 2, y + 34);
  }
}

// ---------- responsive ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
