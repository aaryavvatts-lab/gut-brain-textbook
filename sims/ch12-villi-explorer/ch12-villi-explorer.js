// Villi Explorer MicroSim
// Chapter 12 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 560 (drawHeight 440 + controlHeight 120); iframe height 562px
// Learning objective (Understand): explain how gluten exposure in celiac disease
// shortens the intestinal villi (villous atrophy) and reduces absorption, why villi
// stay normal without celiac disease, and why testing must come before a
// gluten-free diet (the diet lowers tTG antibodies and lets villi heal, so tests
// done later can look normal).
// All rates and percentages are illustrative teaching values, not measurements.
// Real timing varies: symptoms often improve in days to weeks (NIDDK), while the
// lining can take months to years to heal (Rubio-Tapia et al. 2010).

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 440;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

// ---------- controls ----------
let startButton, resetButton, testButton, personSelect, dietSelect;
let isRunning = false; // MicroSims open paused

const PERSON_CELIAC = 'Has celiac disease';
const PERSON_NONE = 'Does not have celiac disease';
const DIET_GLUTEN = 'Eats gluten';
const DIET_GF = 'Gluten-free diet';

// ---------- model state (all 0..1 unless noted) ----------
let month = 0;          // simulated months since start
let villus = 1;         // villus height, 1 = normal, ~0.15 = flat
let inflammation = 0;   // immune activity in the lining
let antibody = 0;       // tTG antibody level in the blood
let lastTest = null;    // {month, ttg, biopsy}
const MONTHS_PER_FRAME = 1 / 50; // about 1.2 simulated months per real second

// gluten particles drifting in the lumen (positions as fractions)
let particles = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  startButton = createButton('Start');
  startButton.position(10, drawHeight + 8);
  startButton.mousePressed(toggleSimulation);

  resetButton = createButton('Reset');
  resetButton.position(75, drawHeight + 8);
  resetButton.mousePressed(resetSimulation);

  testButton = createButton('Run tests');
  testButton.position(140, drawHeight + 8);
  testButton.mousePressed(runTests);

  personSelect = createSelect();
  personSelect.option(PERSON_CELIAC);
  personSelect.option(PERSON_NONE);
  personSelect.selected(PERSON_CELIAC);
  personSelect.position(80, drawHeight + 46);
  personSelect.changed(resetState);

  dietSelect = createSelect();
  dietSelect.option(DIET_GLUTEN);
  dietSelect.option(DIET_GF);
  dietSelect.selected(DIET_GLUTEN);
  dietSelect.position(80, drawHeight + 84);

  for (let i = 0; i < 16; i++) {
    particles.push({ x: random(), y: random(), s: random(0.6, 1.2) });
  }

  describe('A magnified strip of small-intestine lining with finger-like villi. ' +
    'In a person with celiac disease who eats gluten, purple immune cells gather and the villi ' +
    'shrink over months, lowering an absorption meter. On a gluten-free diet the villi slowly ' +
    'grow back. Without celiac disease the villi stay tall. Meters show villus height, ' +
    'absorption, tTG antibodies, and symptoms.');
}

function draw() {
  updateCanvasSize();

  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (isRunning) stepModel(MONTHS_PER_FRAME);

  const topY = drawTitle();
  drawLining(topY);
  drawMeters();
  drawStatusPanel();
  drawControlLabels();
}

// ---------- model ----------
function stepModel(dt) {
  month += dt;
  const celiac = personSelect.value() === PERSON_CELIAC;
  const gluten = dietSelect.value() === DIET_GLUTEN;

  if (celiac && gluten) {
    inflammation += (1 - inflammation) * dt / 0.7;   // immune reaction builds over weeks
    antibody += (1 - antibody) * dt / 1.5;           // tTG antibodies rise
    villus += (0.15 - villus) * inflammation * dt / 2.5; // villi shorten over months
  } else {
    inflammation += (0 - inflammation) * dt / 0.5;   // settles within weeks off gluten
    antibody += (0 - antibody) * dt / 4;             // antibodies fall over months
    villus += (1 - villus) * (1 - inflammation) * dt / 14; // slow regrowth (many months)
  }
  inflammation = constrain(inflammation, 0, 1);
  antibody = constrain(antibody, 0, 1);
  villus = constrain(villus, 0.12, 1);

  for (const p of particles) {
    p.x += 0.002 * p.s;
    if (p.x > 1) p.x -= 1;
  }
}

function absorptionPct() { return 25 + 75 * villus; }
function symptomLevel() {
  return constrain(0.72 * inflammation + 0.28 * (1 - villus) / 0.85, 0, 1);
}

function runTests() {
  const ttg = antibody > 0.35 ? 'POSITIVE' : 'negative';
  let biopsy;
  if (villus < 0.6) biopsy = 'villous atrophy';
  else if (villus < 0.88) biopsy = 'mildly shortened villi';
  else biopsy = 'normal villi';
  if (inflammation > 0.3) biopsy += ' + extra immune cells';
  lastTest = { month: month, ttg: ttg, biopsy: biopsy };
}

function resetState() {
  month = 0;
  villus = 1;
  inflammation = 0;
  antibody = 0;
  lastTest = null;
}

function resetSimulation() {
  resetState();
  personSelect.selected(PERSON_CELIAC);
  dietSelect.selected(DIET_GLUTEN);
  isRunning = false;
  startButton.html('Start');
}

function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

// ---------- drawing ----------
function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  let ts = 24;
  const title = 'Villi Explorer';
  textSize(ts);
  while (textWidth(title) > canvasWidth - 2 * margin && ts > 16) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);

  textSize(15);
  fill('dimgray');
  const instr = 'Choose a person and a diet, press Start, and watch the villi over the months. Try Run tests at different times.';
  text(instr, margin, 38, canvasWidth - 2 * margin, 62);
  const lines = canvasWidth < 560 ? 3 : 2;
  return 38 + lines * 18 + 4;
}

// fixed pseudo-random value for villus i, item k (keeps cells from jittering)
function hash(i, k) {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

function drawLining(topY) {
  const left = margin;
  const right = canvasWidth - margin;
  const W = right - left;
  const stripTop = topY + 4;
  const baseY = 268;              // top of the tissue band (bottom of villi)
  const maxH = baseY - stripTop - 56; // tallest villus
  const celiac = personSelect.value() === PERSON_CELIAC;
  const gluten = dietSelect.value() === DIET_GLUTEN;

  // lumen (food side)
  noStroke();
  fill('lightyellow');
  rect(left, stripTop, W, baseY - stripTop, 6, 6, 0, 0);

  // month counter and lumen label
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text('Inside the intestine (food side)', left + 6, stripTop + 4);
  textAlign(RIGHT, TOP);
  text('Month ' + nf(month, 1, 0), right - 6, stripTop + 4);

  // gluten particles
  if (gluten) {
    for (const p of particles) {
      fill('burlywood');
      circle(left + p.x * W, stripTop + 40 + p.y * 10, 6 * p.s);
    }
  }

  // tissue band below villi
  fill('mistyrose');
  stroke('rosybrown');
  strokeWeight(1);
  rect(left, baseY, W, 26, 0, 0, 6, 6);

  // villi
  const spacing = 30;
  const n = max(6, floor(W / spacing));
  const step = W / n;
  const vw = step * 0.62;
  for (let i = 0; i < n; i++) {
    const cx = left + step * (i + 0.5);
    const vary = 0.9 + 0.1 * hash(i, 0);
    const h = max(10, maxH * villus * vary);
    const top = baseY - h;

    // villus body
    stroke('sienna');
    strokeWeight(1.5);
    fill('peachpuff');
    rect(cx - vw / 2, top, vw, h + 2, vw / 2, vw / 2, 0, 0);

    // capillary inside
    noFill();
    stroke('indianred');
    strokeWeight(1);
    if (h > 24) line(cx, baseY, cx, top + 8);

    // brush border (microvilli) only when villi are reasonably healthy
    if (villus > 0.35) {
      stroke('rosybrown');
      strokeWeight(1);
      const ticks = floor(4 + 4 * villus);
      for (let k = 0; k < ticks; k++) {
        const a = PI + (k + 0.5) * PI / ticks;
        const r = vw / 2;
        const x0 = cx + cos(a) * r;
        const y0 = top + r + sin(a) * r;
        line(x0, y0, x0 + cos(a) * 3, y0 + sin(a) * 3);
      }
    }

    // immune cells crowding in
    const cells = floor(inflammation * 6 + 0.001);
    noStroke();
    fill('purple');
    for (let k = 0; k < cells; k++) {
      const px = cx + (hash(i, k + 1) - 0.5) * vw * 0.6;
      const py = baseY - 4 - hash(i, k + 7) * max(6, h - 10);
      circle(px, py, 5);
    }
    // crypt between villi
    noFill();
    stroke('rosybrown');
    strokeWeight(1);
    const crx = left + step * (i + 1);
    if (i < n - 1) arc(crx, baseY, step * 0.28, 14, 0, PI);
  }

  // labels
  noStroke();
  fill('saddlebrown');
  textSize(14);
  textAlign(LEFT, TOP);
  text('Lining (villi grow up from here)', left + 6, baseY + 10);
  if (gluten) {
    fill('saddlebrown');
    textAlign(LEFT, TOP);
    text('tan dots = gluten', left + 6, stripTop + 21);
  }
  if (inflammation > 0.15) {
    fill('purple');
    textAlign(RIGHT, TOP);
    text('purple = immune cells', right - 6, stripTop + 21);
  } else if (!celiac) {
    fill('darkgreen');
    textAlign(RIGHT, TOP);
    text('No celiac disease', right - 6, stripTop + 21);
  }
}

function drawMeter(y, label, value, display, col) {
  const left = margin;
  const labelW = canvasWidth < 480 ? 118 : 150;
  const barX = left + labelW;
  const barW = canvasWidth - margin - barX;
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  text(label, left, y + 8);
  fill('gainsboro');
  rect(barX, y, barW, 16, 4);
  fill(col);
  rect(barX, y, barW * constrain(value, 0, 1), 16, 4);
  fill('black');
  textAlign(RIGHT, CENTER);
  text(display, barX + barW - 4, y + 8);
}

function drawMeters() {
  const y0 = 302;
  drawMeter(y0, 'Villus height', villus, nf(villus * 100, 1, 0) + '%', 'peru');
  drawMeter(y0 + 20, 'Absorption', absorptionPct() / 100, nf(absorptionPct(), 1, 0) + '%', 'mediumseagreen');
  drawMeter(y0 + 40, 'tTG antibodies', antibody, antibody > 0.35 ? 'high' : 'low', 'mediumpurple');
  drawMeter(y0 + 60, 'Symptoms', symptomLevel(), nf(symptomLevel() * 100, 1, 0) + '%', 'tomato');
}

function statusText() {
  const celiac = personSelect.value() === PERSON_CELIAC;
  const gluten = dietSelect.value() === DIET_GLUTEN;
  if (!isRunning && month === 0) return 'Paused. Press Start. Time runs in months (not to scale).';
  if (!celiac) return 'No celiac disease: gluten does not trigger an immune attack, so the villi stay tall on either diet.';
  if (gluten && villus > 0.88) return 'Gluten is reaching the lining, and immune cells are gathering. Antibodies are rising.';
  if (gluten) return 'Celiac disease + gluten: inflammation is shortening the villi. Less surface means less absorption.';
  if (villus < 0.88) return 'Gluten-free: symptoms ease fast, but villi regrow slowly. Antibodies fall, so tests now may look normal.';
  return 'Villi have regrown on the gluten-free diet. It must continue for life to keep the lining healthy.';
}

function drawStatusPanel() {
  const px = margin;
  const py = 386;
  const pw = canvasWidth - 2 * margin;
  const ph = 50;
  stroke(200);
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(px, py, pw, ph, 8);

  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  if (lastTest && (!isRunning || month - lastTest.month < 4)) {
    fill('black');
    const t = 'Tests at month ' + nf(lastTest.month, 1, 0) + ': tTG blood test ' + lastTest.ttg +
      '; biopsy: ' + lastTest.biopsy + '.';
    text(t, px + 8, py + 4, pw - 16, ph - 6);
  } else {
    fill('black');
    text(statusText(), px + 8, py + 4, pw - 16, ph - 6);
  }
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Person:', 10, drawHeight + 57);
  text('Diet:', 10, drawHeight + 95);
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
