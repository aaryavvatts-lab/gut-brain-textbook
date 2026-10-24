// The Two-Way Street MicroSim
// Chapter 11 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 620 (drawHeight 480 + controlHeight 140); iframe height 622px
// Learning objective (Analyze): explain why a gut-to-brain effect, a brain-to-gut
// effect, or a shared third factor can each produce the same correlation at one
// time point, and how following people over time (which change came first) helps
// separate the directions.
// Model: a simulated cohort of 500 fictional people. Each has a gut-symptom score G
// and a mood-symptom score M (higher = worse), updated each time step:
//   G' = 0.5*G + (brain-to-gut)*M + (third factor)*Z + noise
//   M' = 0.5*M + (gut-to-brain)*G + (third factor)*Z + noise
// Z is a fixed hidden trait per person (for example, poor sleep or a hard life event).
// All values are illustrative; this is not data from any real study.

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 225;
let defaultTextSize = 16;

// ---------- controls ----------
let startButton, newButton, resetButton;
let g2bSlider, b2gSlider, confSlider;
let isRunning = false; // MicroSims always open paused

// ---------- model ----------
const N = 500;
const AUTO = 0.5;   // how much of last step's score carries over
const NOISE = 0.7;  // random day-to-day change
let G = [], M = [], Z = [], prevG = [], prevM = [];
let step = 0;
let frameCounter = 0;
let seed = 7;
let lastParams = '';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  startButton = createButton('Start');
  startButton.position(10, drawHeight + 8);
  startButton.mousePressed(toggleSimulation);

  newButton = createButton('New cohort');
  newButton.position(75, drawHeight + 8);
  newButton.mousePressed(newCohort);

  resetButton = createButton('Reset');
  resetButton.position(170, drawHeight + 8);
  resetButton.mousePressed(resetSimulation);

  g2bSlider = createSlider(0, 0.4, 0.3, 0.05);
  g2bSlider.position(sliderLeftMargin, drawHeight + 44);
  b2gSlider = createSlider(0, 0.4, 0, 0.05);
  b2gSlider.position(sliderLeftMargin, drawHeight + 76);
  confSlider = createSlider(0, 0.4, 0, 0.05);
  confSlider.position(sliderLeftMargin, drawHeight + 108);
  sizeSliders();

  initCohort();

  describe('A scatter plot of 500 simulated people, with gut symptoms on the horizontal axis and ' +
    'anxiety or low-mood symptoms on the vertical axis. Sliders set how strongly gut symptoms ' +
    'change later mood, how strongly mood changes later gut symptoms, and how strongly a hidden ' +
    'shared factor affects both. Bars compare the correlation at one time point with the ' +
    'correlations between earlier gut and later mood, and between earlier mood and later gut.');
}

// ---------- model functions ----------
function params() {
  return [g2bSlider.value(), b2gSlider.value(), confSlider.value()].join(',');
}

function initCohort() {
  randomSeed(seed);
  G = []; M = []; Z = [];
  for (let i = 0; i < N; i++) {
    G.push(randomGaussian(0, 1));
    M.push(randomGaussian(0, 1));
    Z.push(randomGaussian(0, 1));
  }
  step = 0;
  warmUp();
}

function warmUp() {
  // run enough steps for the cohort to settle under the current settings
  for (let k = 0; k < 40; k++) stepModel();
  step = 0;
  lastParams = params();
}

function stepModel() {
  const c = g2bSlider.value();
  const b = b2gSlider.value();
  const d = confSlider.value();
  prevG = G.slice();
  prevM = M.slice();
  for (let i = 0; i < N; i++) {
    const g = AUTO * prevG[i] + b * prevM[i] + d * Z[i] + randomGaussian(0, NOISE);
    const m = AUTO * prevM[i] + c * prevG[i] + d * Z[i] + randomGaussian(0, NOISE);
    G[i] = g;
    M[i] = m;
  }
  step++;
}

function corr(x, y) {
  const n = x.length;
  let mx = 0, my = 0;
  for (let i = 0; i < n; i++) { mx += x[i]; my += y[i]; }
  mx /= n; my /= n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx, dy = y[i] - my;
    sxy += dx * dy; sxx += dx * dx; syy += dy * dy;
  }
  if (sxx === 0 || syy === 0) return 0;
  return sxy / Math.sqrt(sxx * syy);
}

function stats(arr) {
  let m = 0;
  for (const v of arr) m += v;
  m /= arr.length;
  let s = 0;
  for (const v of arr) s += (v - m) * (v - m);
  return [m, Math.sqrt(s / arr.length) || 1];
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

  if (params() !== lastParams) warmUp();
  if (isRunning) {
    frameCounter++;
    if (frameCounter % 40 === 0) stepModel();
  }

  const rNow = corr(G, M);
  const rGM = corr(prevG, M);
  const rMG = corr(prevM, G);

  drawTitle();
  const L = layout();
  drawScatter(L);
  drawBars(L, rNow, rGM, rMG);
  drawReadout(L, rNow, rGM, rMG);
  drawControlLabels();
}

function layout() {
  const narrow = canvasWidth < 600;
  const top = narrow ? 104 : 88;
  if (narrow) {
    const S = 180;
    const sx = (canvasWidth - S) / 2 + 10;
    return { narrow, sx, sy: top, S, bx: margin, by: top + S + 34, bw: canvasWidth - 2 * margin, ry: 410 };
  }
  const S = min(280, canvasWidth * 0.42);
  const sx = margin + 30;
  const bx = sx + S + 40;
  return { narrow, sx, sy: top, S, bx, by: top + 20, bw: canvasWidth - bx - margin, ry: 410 };
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  let ts = 24;
  const title = 'The Two-Way Street';
  textSize(ts);
  while (textWidth(title) > canvasWidth - 2 * margin && ts > 16) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);

  textSize(15);
  fill('dimgray');
  text('Set which way the arrows run, then compare one snapshot with following people over time.',
    margin, 38, canvasWidth - 2 * margin, canvasWidth < 500 ? 62 : 44);
}

function drawScatter(L) {
  const { sx, sy, S } = L;
  stroke('gray');
  strokeWeight(1);
  fill('white');
  rect(sx, sy, S, S);

  const [mg, sg] = stats(G);
  const [mm, sm] = stats(M);
  noStroke();
  fill(70, 130, 180, 110); // steelblue, semi-transparent
  for (let i = 0; i < N; i++) {
    const zx = constrain((G[i] - mg) / sg, -3, 3);
    const zy = constrain((M[i] - mm) / sm, -3, 3);
    circle(sx + S / 2 + zx * S / 6.4, sy + S / 2 - zy * S / 6.4, 4);
  }

  fill('black');
  textSize(14);
  textAlign(CENTER, TOP);
  text('Gut symptoms (worse to the right)', sx + S / 2, sy + S + 4);
  push();
  translate(sx - 8, sy + S / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, BOTTOM);
  text('Mood symptoms (worse up)', 0, 0);
  pop();
}

function drawBars(L, rNow, rGM, rMG) {
  const rows = [
    ['One snapshot: gut with mood', rNow, 'slateblue'],
    ['Earlier gut, later mood', rGM, 'darkorange'],
    ['Earlier mood, later gut', rMG, 'seagreen']
  ];
  const labelW = L.narrow ? 0 : 0;
  const rowH = L.narrow ? 30 : 64;
  noStroke();
  for (let k = 0; k < rows.length; k++) {
    const [label, r, col] = rows[k];
    const y = L.by + k * rowH;
    fill('black');
    textSize(14);
    textAlign(LEFT, TOP);
    if (L.narrow) {
      text(label, L.bx, y);
      const bx = L.bx + 190;
      const bw = L.bw - 190 - 46;
      drawBar(bx, y + 1, bw, 14, r, col);
    } else {
      text(label, L.bx + labelW, y);
      drawBar(L.bx, y + 22, L.bw - 50, 18, r, col);
    }
  }
  if (!L.narrow) {
    fill('dimgray');
    textSize(14);
    textAlign(LEFT, TOP);
    text('Bars show correlation (r), from 0 to 1.', L.bx, L.by + 3 * rowH, L.bw, 40);
  }
}

function drawBar(x, y, w, h, r, col) {
  stroke('gray');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h);
  noStroke();
  fill(col);
  rect(x, y, w * constrain(r, 0, 1), h);
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('r = ' + nf(r, 1, 2), x + w + 6, y + h / 2);
}

function drawReadout(L, rNow, rGM, rMG) {
  const y = L.ry;
  stroke('silver');
  fill('white');
  rect(margin / 2, y, canvasWidth - margin, 62, 8);
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, TOP);
  const stepLine = 'Time step: ' + step + '   (500 fictional people; not real data)';
  if (textWidth(stepLine) > canvasWidth - 2 * margin) textSize(13); // narrow: shrink to fit
  if (textWidth(stepLine) > canvasWidth - 2 * margin) textSize(12);
  text(stepLine, margin, y + 6);
  fill('dimgray');
  textSize(14);
  const diff = rGM - rMG;
  let msg;
  if (rNow < 0.08) msg = 'Almost no link between gut and mood at any time.';
  else if (diff > 0.06) msg = 'Gut changes tend to come first, then mood follows.';
  else if (diff < -0.06) msg = 'Mood changes tend to come first, then gut follows.';
  else msg = 'Linked, but neither clearly comes first: both directions, or a shared cause.';
  text(msg, margin, y + 28, canvasWidth - 2 * margin, 34);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Gut to brain effect: ' + nf(g2bSlider.value(), 1, 2), 10, drawHeight + 54);
  text('Brain to gut effect: ' + nf(b2gSlider.value(), 1, 2), 10, drawHeight + 86);
  text('Shared third factor: ' + nf(confSlider.value(), 1, 2), 10, drawHeight + 118);
}

// ---------- controls ----------
function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function newCohort() {
  seed = floor(Math.random() * 100000);
  initCohort();
}

function resetSimulation() {
  isRunning = false;
  startButton.html('Start');
  g2bSlider.value(0.3);
  b2gSlider.value(0);
  confSlider.value(0);
  seed = 7;
  initCohort();
}

function sizeSliders() {
  const w = max(80, canvasWidth - sliderLeftMargin - margin);
  for (const s of [g2bSlider, b2gSlider, confSlider]) s.size(w);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  sizeSliders();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
