// HPA Axis Stress Dial MicroSim
// Chapter 7 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 650 (drawHeight 530 + controlHeight 120); iframe height 652px
// Learning objective (Understand): explain how the HPA axis (CRH -> ACTH -> cortisol)
// switches on during stress and how cortisol's negative feedback switches it off after
// acute stress, while repeated (chronic) stress keeps it active, and describe the gut
// effects of stress signaling (faster colon movement, more sensitivity).
// All levels and times are illustrative relative units. Sources for the shape of the
// model: Smith & Vale 2006 (cascade and glucocorticoid feedback); Tache & Million 2015
// and Fukudo 1998 (CRH/CRF speeds colon motility); Barbara 2004 and Vanuytsel 2014
// (mast cells, sensitivity, permeability).

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 530;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 190;
let defaultTextSize = 16;

// ---------- controls ----------
let startButton, resetButton, feedbackCheckbox, intensitySlider, patternSelect;
let isRunning = false; // MicroSims open paused

const ACUTE = 'One stressful event (acute)';
const CHRONIC = 'Stress every day (chronic)';
const RUN_HOURS = 96;      // length of one run, in illustrative hours
const HOURS_PER_FRAME = 0.1;
const BASE = 0.15;         // resting level of each hormone (relative)

// ---------- model state ----------
let t = 0;                 // hours since start
let brain = 0;             // the brain's stress signal (from the amygdala, cortex, brainstem)
let crh = BASE, acth = BASE, cort = BASE;
let motility = 0, sensitivity = 0, mast = 0, load = 0;
let history = [];          // {t, s, crh, acth, cort}

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

  feedbackCheckbox = createCheckbox(' Cortisol feedback on', true);
  feedbackCheckbox.position(145, drawHeight + 10);

  intensitySlider = createSlider(0, 10, 6, 1);
  intensitySlider.position(sliderLeftMargin, drawHeight + 48);
  intensitySlider.size(canvasWidth - sliderLeftMargin - margin);

  patternSelect = createSelect();
  patternSelect.option(ACUTE);
  patternSelect.option(CHRONIC);
  patternSelect.selected(ACUTE);
  patternSelect.position(85, drawHeight + 84);
  patternSelect.changed(clearRun);

  clearRun();

  describe('A stress-response model. On the left, three linked boxes show the hypothalamus releasing CRH, ' +
    'the pituitary releasing ACTH, and the adrenal gland releasing cortisol, with a dashed negative-feedback ' +
    'arrow from cortisol back to the hypothalamus and pituitary. On the right, a gut panel shows colon movement, ' +
    'gut sensitivity, and gut permeability, and a graph plots CRH, ACTH, and cortisol over time. After one ' +
    'stressful event, levels rise and then fall back; with daily stress, they keep rising again.');
}

function draw() {
  updateCanvasSize();

  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (isRunning) {
    for (let i = 0; i < 2; i++) stepModel(HOURS_PER_FRAME);
  }

  drawTitle();
  drawAxis();
  drawGutPanel();
  drawGraph();
  drawStatus();
  drawControlLabels();
}

// ---------- model ----------
function stressorOn(hours) {
  if (patternSelect.value() === ACUTE) {
    return hours >= 6 && hours < 8;            // a 2-hour event, like a big exam
  }
  const h = hours % 24;
  return h >= 6 && h < 18;                     // 12 stressful hours every day
}

function stepModel(dt) {
  if (t >= RUN_HOURS) {
    isRunning = false;
    startButton.html('Start');
    return;
  }
  const S = stressorOn(t) ? intensitySlider.value() / 10 : 0;
  const fb = feedbackCheckbox.checked() ? 1 : 0;

  // the brain's stress signal rises quickly and fades over a few hours once the stressor ends
  brain += (S > brain ? (S - brain) / 0.3 : (S - brain) / 3.0) * dt;
  // repeated stress slowly builds a background "load" that keeps the system from fully
  // resetting and makes feedback less effective (an illustrative simplification)
  load += (brain > load ? (brain - load) / 40 : (brain - load) / 80) * dt;

  // cortisol feeds back to turn down CRH (hypothalamus) and ACTH (pituitary)
  const excessCort = max(0, cort - BASE);
  const f = fb * (1 - 0.5 * load / 0.6);
  const crhTarget = max(0.02, BASE + 1.1 * brain + 0.6 * load - f * 1.0 * excessCort);
  crh += (crhTarget - crh) / 0.3 * dt;
  const acthTarget = max(0.02, BASE + 1.1 * (crh - BASE) - f * 0.4 * excessCort);
  acth += (acthTarget - acth) / 0.4 * dt;
  const cortTarget = max(0.02, BASE + 1.0 * (acth - BASE));
  cort += (cortTarget - cort) / 1.0 * dt;

  // gut effects: CRH signaling speeds colon movement quickly; mast cell activation builds
  // slowly with repeated stress and fades slowly, raising sensitivity and permeability
  const drive = max(0, crh - BASE);
  motility += (constrain(drive * 1.1, 0, 1) - motility) / 0.5 * dt;
  const mastTarget = constrain(drive * 1.5, 0, 1);
  mast += (mastTarget > mast ? (mastTarget - mast) / 20 : (mastTarget - mast) / 80) * dt;
  sensitivity = constrain(0.7 * mast + 0.4 * drive, 0, 1);

  t += dt;
  history.push({ t: t, s: S > 0, crh: crh, acth: acth, cort: cort });
}

function permeability() {
  // CRH acting on gut mast cells drives most of the stress-linked rise in permeability
  // (in a 2014 human public-speaking study, this effect depended on mast cells, not cortisol alone)
  return constrain(0.65 * mast + 0.45 * max(0, crh - BASE), 0, 1);
}

function clearRun() {
  t = 0;
  brain = 0;
  crh = BASE; acth = BASE; cort = BASE;
  motility = 0; sensitivity = 0; mast = 0; load = 0;
  history = [];
}

function resetSimulation() {
  isRunning = false;
  startButton.html('Start');
  intensitySlider.value(6);
  patternSelect.selected(ACUTE);
  feedbackCheckbox.checked(true);
  clearRun();
}

function toggleSimulation() {
  if (!isRunning && t >= RUN_HOURS) clearRun();
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

// ---------- drawing ----------
function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  let ts = 24;
  const title = 'HPA Axis Stress Dial';
  textSize(ts);
  while (textWidth(title) > canvasWidth - 2 * margin && ts > 16) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);
  textSize(15);
  fill('dimgray');
  text('Set the stress level and pattern, press Start, and watch cortisol rise and (maybe) fall.',
    margin, 38, canvasWidth - 2 * margin, 40);
}

function topY() { return canvasWidth < 600 ? 92 : 74; }
function leftW() { return constrain(canvasWidth * 0.36, 140, 230); }

function levelColor(v) {
  return lerpColor(color('honeydew'), color('tomato'), constrain((v - BASE) / 0.9, 0, 1));
}

function drawGland(x, y, w, h, name, hormone, value) {
  stroke('gray');
  strokeWeight(1);
  fill(levelColor(value));
  rect(x, y, w, h, 10);
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(15);
  text(name, x + 4, y + 6, w - 8, 20);
  textSize(14);
  fill('dimgray');
  text('makes ' + hormone, x + 4, y + 25, w - 8, 20);
  // level bar
  stroke('silver');
  fill('white');
  rect(x + 10, y + h - 18, w - 20, 10, 5);
  noStroke();
  fill('firebrick');
  rect(x + 10, y + h - 18, max(3, (w - 20) * constrain(value / 1.2, 0, 1)), 10, 5);
}

function arrowDown(x, y1, y2, label) {
  stroke('dimgray');
  strokeWeight(2);
  line(x, y1, x, y2 - 6);
  noStroke();
  fill('dimgray');
  triangle(x - 5, y2 - 8, x + 5, y2 - 8, x, y2);
  textSize(14);
  textAlign(LEFT, CENTER);
  fill('black');
  text(label, x + 8, (y1 + y2) / 2);
}

function drawAxis() {
  const x = margin + 18;
  const w = leftW() - 18;
  const y0 = topY();
  const h = 62;
  const gap = 34;
  const yH = y0, yP = y0 + h + gap, yA = y0 + 2 * (h + gap);
  drawGland(x, yH, w, h, 'Hypothalamus', 'CRH', crh);
  drawGland(x, yP, w, h, 'Pituitary', 'ACTH', acth);
  drawGland(x, yA, w, h, 'Adrenal gland', 'cortisol', cort);
  arrowDown(x + w / 2, yH + h, yP, 'CRH');
  arrowDown(x + w / 2, yP + h, yA, 'ACTH');
  arrowDown(x + w / 2, yA + h, yA + h + 30, 'cortisol');

  // negative feedback loop along the left edge
  const on = feedbackCheckbox.checked();
  stroke(on ? 'royalblue' : 'lightgray');
  strokeWeight(2);
  drawingContext.setLineDash([5, 4]);
  noFill();
  const fx = margin + 6;
  line(x, yA + h / 2, fx, yA + h / 2);
  line(fx, yA + h / 2, fx, yH + h / 2);
  line(fx, yH + h / 2, x - 4, yH + h / 2);
  line(fx, yP + h / 2, x - 4, yP + h / 2);
  drawingContext.setLineDash([]);
  noStroke();
  fill(on ? 'royalblue' : 'lightgray');
  triangle(x - 2, yH + h / 2, x - 10, yH + h / 2 - 5, x - 10, yH + h / 2 + 5);
  triangle(x - 2, yP + h / 2, x - 10, yP + h / 2 - 5, x - 10, yP + h / 2 + 5);
  textSize(14);
  textAlign(LEFT, TOP);
  text(on ? (canvasWidth < 600 ? 'Blue dashes: negative feedback' : 'Blue dashes: cortisol turns CRH and ACTH down (negative feedback)') :
    'Feedback switched off', margin, yA + h + 34, leftW() + 4, 62);
}

function drawMeter(x, y, w, label, value, col) {
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text(label, x, y, w, 18);
  stroke('silver');
  fill('white');
  rect(x, y + 18, w, 10, 5);
  noStroke();
  fill(col);
  rect(x, y + 18, max(3, w * value), 10, 5);
}

function drawGutPanel() {
  const x = margin + leftW() + 12;
  const w = canvasWidth - x - margin;
  const y = topY();
  const h = 146;
  stroke('sienna');
  strokeWeight(1);
  fill('lavenderblush');
  rect(x, y, w, h, 10);

  // a wiggling colon whose waves speed up with motility
  noFill();
  stroke('sienna');
  strokeWeight(5);
  const speed = 1 + 6 * motility;
  const amp = 4 + 6 * motility;
  beginShape();
  for (let i = 0; i <= 30; i++) {
    const xx = x + 10 + i * (w - 20) / 30;
    const yy = y + 30 + amp * sin(i * 0.7 - frameCount * 0.02 * speed * (isRunning ? 1 : 0));
    vertex(xx, yy);
  }
  endShape();
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, TOP);
  text('Gut', x + 8, y + 4);

  drawMeter(x + 8, y + 44, w - 16, 'Colon movement', motility, 'darkorange');
  drawMeter(x + 8, y + 76, w - 16, 'Gut sensitivity', sensitivity, 'crimson');
  drawMeter(x + 8, y + 108, w - 16, 'Gut permeability', permeability(), 'saddlebrown');
}

function drawGraph() {
  const x = margin + leftW() + 12;
  const w = canvasWidth - x - margin;
  const y = topY() + 156;
  const h = 216;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 6);

  const px = x + 8, pw = w - 16, py = y + 44, ph = h - 70;
  // stressor shading
  noStroke();
  fill(255, 228, 196);
  for (let hr = 0; hr < RUN_HOURS; hr += 0.5) {
    if (stressorOn(hr)) rect(px + hr / RUN_HOURS * pw, py, pw * 0.5 / RUN_HOURS + 0.5, ph);
  }
  // axes
  stroke('gray');
  line(px, py + ph, px + pw, py + ph);
  line(px, py, px, py + ph);

  const series = [['crh', 'mediumpurple', 'CRH'], ['acth', 'teal', 'ACTH'], ['cort', 'firebrick', 'Cortisol']];
  for (const [key, col] of series) {
    stroke(col);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < history.length; i += 2) {
      const d = history[i];
      vertex(px + d.t / RUN_HOURS * pw, py + ph - constrain(d[key] / 1.3, 0, 1) * ph);
    }
    endShape();
  }

  // legend and labels
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  let lx = px;
  let legGap = 22;
  const legTotal = () => series.reduce((a, [, , n]) => a + textWidth(n) + legGap, 0) - 9;
  if (legTotal() > pw) { textSize(12); legGap = 18; } // narrow: shrink legend to fit
  if (legTotal() > pw) legGap = 15;
  for (const [, col, name] of series) {
    fill(col);
    rect(lx, y + 8, 10, 10);
    fill('black');
    text(name, lx + 13, y + 6);
    lx += textWidth(name) + legGap;
  }
  textSize(14);
  fill('dimgray');
  text('Shaded = stressor on', px, y + 24, pw, 18);
  textAlign(CENTER, TOP);
  text('Time: ' + floor(t) + ' of ' + RUN_HOURS + ' hours (illustrative)', px, py + ph + 4, pw, 18);
}

function statusText() {
  if (t === 0) return 'Paused. Choose a pattern and press Start.';
  if (t >= RUN_HOURS) return 'Run finished. Press Start to run again, or change a setting.';
  const on = stressorOn(t);
  const chronic = patternSelect.value() === CHRONIC;
  if (intensitySlider.value() === 0) return 'Stress level is 0, so the axis stays at its resting level.';
  if (on) return 'Stressor on: CRH, then ACTH, then cortisol rise. The colon speeds up.';
  if (!feedbackCheckbox.checked()) return 'Stressor over, but with no feedback the levels fall slowly and peak higher.';
  if (chronic) return 'Between stressful days: levels dip but don\'t fully reset, and gut sensitivity keeps building.';
  return 'Stressor over: rising cortisol turns CRH and ACTH down, so the system resets.';
}

function drawStatus() {
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text(statusText(), margin, drawHeight - 50, canvasWidth - 2 * margin, 46);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Stress level: ' + intensitySlider.value(), 10, drawHeight + 58);
  text('Pattern:', 10, drawHeight + 96);
}

// ---------- responsive ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  intensitySlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
