// Probiotic Trial Reader MicroSim
// Chapter 16 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 560 (drawHeight 440 + controlHeight 120); iframe height 562px
// Learning objective (Evaluate): judge how trial size, number of outcomes
// measured, and a placebo group change how much a reported result can be trusted.
// A made-up probiotic has a small TRUE effect (d = 0.2). Each simulated trial
// reports its best-looking outcome. All numbers are illustrative.

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 440;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 210;
let defaultTextSize = 16;

// ---------- controls ----------
let run1Button, run20Button, clearButton, placeboCheckbox, sizeSlider, outcomeSlider;

// ---------- model ----------
const TRUE_EFFECT = 0.2;       // true standardized effect of the made-up probiotic
const PLACEBO_RESPONSE = 0.4;  // improvement everyone shows without a control group
const X_MIN = -0.8;
const X_MAX = 1.6;
const BIN = 0.05;
const MAX_TRIALS = 300;
let trials = [];               // each: {d, impressive, n, k, placebo}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: buttons and placebo checkbox
  run1Button = createButton('Run 1 trial');
  run1Button.position(10, drawHeight + 8);
  run1Button.mousePressed(() => runTrials(1));

  run20Button = createButton('Run 20');
  run20Button.position(102, drawHeight + 8);
  run20Button.mousePressed(() => runTrials(20));

  clearButton = createButton('Clear');
  clearButton.position(172, drawHeight + 8);
  clearButton.mousePressed(() => { trials = []; });

  placeboCheckbox = createCheckbox(' Placebo group', true);
  placeboCheckbox.style('white-space', 'nowrap');

  // Row 2 and 3: sliders
  sizeSlider = createSlider(10, 300, 30, 10);

  outcomeSlider = createSlider(1, 10, 1, 1);
  positionControls();

  // Start with 20 example trials at the default settings so the idea is visible
  randomSeed(16);
  runTrials(20);

  describe('A dot plot of simulated probiotic trial results on an effect-size axis. ' +
    'A dashed line marks the true effect of 0.2 and a gray line marks zero. ' +
    'Small trials scatter widely and some look impressive by chance; large trials cluster near the true effect. ' +
    'Measuring more outcomes or dropping the placebo group pushes reported effects above the truth.');
}

function positionControls() {
  // phone: the Placebo checkbox gets its own row so its label cannot wrap
  const dy = canvasWidth < 500 ? 32 : 0;
  placeboCheckbox.position(canvasWidth < 500 ? 10 : 232, drawHeight + (canvasWidth < 500 ? 42 : 10));
  sizeSlider.position(sliderLeftMargin, drawHeight + 46 + dy);
  sizeSlider.size(canvasWidth - sliderLeftMargin - margin);
  outcomeSlider.position(sliderLeftMargin, drawHeight + 82 + dy);
  outcomeSlider.size(canvasWidth - sliderLeftMargin - margin);
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
  drawPlot();
  drawStats();
  drawControlLabels();
}

// ---------- model ----------
function runTrials(count) {
  const n = sizeSlider.value();
  const k = outcomeSlider.value();
  const placebo = placeboCheckbox.checked();
  for (let i = 0; i < count; i++) {
    // standard error of a two-group comparison vs a one-group before/after change
    const se = placebo ? sqrt(2 / n) : sqrt(1 / n);
    const shift = placebo ? TRUE_EFFECT : TRUE_EFFECT + PLACEBO_RESPONSE;
    let best = -99;
    for (let j = 0; j < k; j++) {
      const d = shift + randomGaussian(0, se);
      if (d > best) best = d;
    }
    trials.push({ d: best, impressive: best / se > 1.96, n: n, k: k, placebo: placebo });
  }
  if (trials.length > MAX_TRIALS) trials = trials.slice(trials.length - MAX_TRIALS);
}

// ---------- drawing ----------
function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  let ts = 24;
  textSize(ts);
  const title = 'Probiotic Trial Reader';
  while (textWidth(title) > canvasWidth - 20 && ts > 16) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 10);
  textSize(14);
  fill('dimgray');
  const instr = 'Change the trial design, then run trials. Each dot is one trial\'s reported result.';
  textWrap(WORD);
  text(instr, 10, 40, canvasWidth - 20);
}

function xFor(d) {
  return map(d, X_MIN, X_MAX, margin + 10, canvasWidth - margin - 10);
}

function drawPlot() {
  const baseY = 268;
  const topY = 88;
  // axis
  stroke('gray');
  strokeWeight(1);
  line(xFor(X_MIN), baseY, xFor(X_MAX), baseY);
  noStroke();
  fill('black');
  textSize(14);
  textAlign(CENTER, TOP);
  const ticks = canvasWidth < 500 ? [-0.5, 0, 0.5, 1, 1.5] : [-0.5, -0.25, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5];
  for (const tk of ticks) {
    stroke('gray');
    line(xFor(tk), baseY, xFor(tk), baseY + 4);
    noStroke();
    text(nf(tk, 1, tk % 0.5 === 0 ? 1 : 2), xFor(tk), baseY + 6);
  }
  text('Reported effect size (d); right = probiotic looks better', canvasWidth / 2, baseY + 24);

  // zero line and true effect line
  stroke('gray');
  line(xFor(0), topY, xFor(0), baseY);
  stroke('darkgreen');
  strokeWeight(2);
  drawingContext.setLineDash([6, 4]);
  line(xFor(TRUE_EFFECT), topY, xFor(TRUE_EFFECT), baseY);
  drawingContext.setLineDash([]);
  noStroke();
  fill('darkgreen');
  textAlign(LEFT, TOP);
  textSize(14);
  text('true effect 0.2', xFor(TRUE_EFFECT) + 4, topY);

  // dot plot (stack dots in bins)
  const counts = {};
  const pxPerBin = xFor(BIN) - xFor(0);
  const r = constrain(pxPerBin * 0.9, 4, 9);
  const maxStack = floor((baseY - topY - 20) / r);
  for (const tr of trials) {
    const d = constrain(tr.d, X_MIN, X_MAX - 0.01);
    const b = floor((d - X_MIN) / BIN);
    counts[b] = (counts[b] || 0) + 1;
    const level = min(counts[b], maxStack) - 1;
    const cx = xFor(X_MIN + (b + 0.5) * BIN);
    const cy = baseY - r / 2 - 1 - level * r;
    stroke('white');
    strokeWeight(0.5);
    fill(tr.impressive ? 'darkorange' : 'steelblue');
    circle(cx, cy, r);
  }

  // legend
  noStroke();
  textSize(14);
  textAlign(LEFT, CENTER);
  const ly = baseY + 50;
  const legGap = 20;
  const legTotal = margin + 16 + textWidth('ordinary result') + legGap + 10 + textWidth('"impressive" (looks significant)');
  if (legTotal > canvasWidth - 8) textSize(12); // phone: shrink legend text to fit
  fill('steelblue'); circle(margin + 6, ly, 10);
  fill('black'); text('ordinary result', margin + 16, ly);
  const lx2 = margin + 16 + textWidth('ordinary result') + (legTotal > canvasWidth - 8 ? 14 : legGap);
  fill('darkorange'); circle(lx2, ly, 10);
  fill('black'); text('"impressive" (looks significant)', lx2 + 10, ly);
}

function drawStats() {
  const y0 = 340;
  noStroke();
  fill('white');
  stroke('lightgray');
  rect(10, y0, canvasWidth - 20, 92, 6);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(15);
  const n = trials.length;
  if (n === 0) {
    text('No trials yet. Press "Run 20" to simulate 20 trials.', 20, y0 + 10, canvasWidth - 40);
    return;
  }
  let sum = 0, imp = 0;
  for (const tr of trials) { sum += tr.d; if (tr.impressive) imp++; }
  const avg = sum / n;
  const pct = round(100 * imp / n);
  const line1 = 'Trials run: ' + n + '    "Impressive": ' + imp + ' (' + pct + '%)';
  const line2 = 'Average reported effect: ' + nf(avg, 1, 2) + '   (true effect: 0.20)';
  if (textWidth(line2) > canvasWidth - 40) textSize(13); // phone: shrink to fit the box
  if (textWidth(line2) > canvasWidth - 40) textSize(12);
  text(line1, 20, y0 + 8);
  text(line2, 20, y0 + 30);
  textSize(15);
  let verdict;
  const ratio = avg / TRUE_EFFECT;
  if (ratio > 1.6) {
    fill('firebrick');
    verdict = 'Reports look about ' + nf(ratio, 1, 1) + ' times bigger than the truth.';
  } else if (ratio < 0.6) {
    fill('firebrick');
    verdict = 'Reports look smaller than the truth (more runs may help).';
  } else {
    fill('darkgreen');
    verdict = 'On average, reports are close to the truth.';
  }
  textWrap(WORD);
  text(verdict, 20, y0 + 52, canvasWidth - 40);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  const dy = canvasWidth < 500 ? 32 : 0;
  text('People per group: ' + sizeSlider.value(), 10, drawHeight + 56 + dy);
  text('Outcomes measured: ' + outcomeSlider.value(), 10, drawHeight + 92 + dy);
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
  controlHeight = canvasWidth < 500 ? 152 : 120; // phone: extra checkbox row (desktop unchanged)
  canvasHeight = drawHeight + controlHeight;
  containerHeight = canvasHeight;
}
