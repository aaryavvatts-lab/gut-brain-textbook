// Confounder Detective MicroSim
// Chapter 13 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 580 (drawHeight 460 + controlHeight 120); iframe height 582px
// Learning objective (Analyze): identify how a confounder (diet variety) can create an
// apparent microbiome difference between an autistic group and a comparison group,
// and tell a confounder apart from variables that are balanced between groups.
// ALL DATA ARE SIMULATED. By design, group membership has NO direct effect on the
// microbiome score; diet variety, age, and recent antibiotics do. The autistic group
// has lower average diet variety (selective eating), while age and antibiotics are
// balanced. This mirrors the logic of Yap et al. 2021 (Cell), not its numbers.

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

// ---------- controls ----------
let sampleButton, colorSelect, dietBox, ageBox, abxBox;
const COLOR_NONE = 'None';
const COLOR_DIET = 'Diet variety';
const COLOR_AGE = 'Age';
const COLOR_ABX = 'Recent antibiotics';

// ---------- data ----------
const N_PER_GROUP = 40;
let kids = [];     // {g: 1 autistic / 0 comparison, diet, age, abx, y, jitter}
let seed = 7;
const Y_MIN = 10, Y_MAX = 70;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  sampleButton = createButton('New sample');
  sampleButton.position(10, drawHeight + 8);
  sampleButton.mousePressed(newSample);

  colorSelect = createSelect();
  colorSelect.option(COLOR_NONE);
  colorSelect.option(COLOR_DIET);
  colorSelect.option(COLOR_AGE);
  colorSelect.option(COLOR_ABX);
  colorSelect.selected(COLOR_NONE);
  colorSelect.position(228, drawHeight + 9);

  dietBox = createCheckbox(' Diet variety', false);
  dietBox.position(10, drawHeight + 84);
  ageBox = createCheckbox(' Age', false);
  ageBox.position(130, drawHeight + 84);
  abxBox = createCheckbox(' Antibiotics', false);
  abxBox.position(196, drawHeight + 84);

  makeData();

  describe('Two columns of dots show simulated microbiome diversity scores for an autistic group ' +
    'and a comparison group, with a line at each group average. The autistic group starts lower. ' +
    'Coloring dots by diet variety shows that low scores belong mostly to children who eat fewer ' +
    'kinds of food. Accounting for diet variety shrinks the gap to near zero; accounting for age ' +
    'or antibiotics barely changes it.');
}

function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const topY = drawTitle();
  const stats = computeStats();
  drawPlot(topY, stats);
  drawResults(stats);
  drawControlLabels();
}

// ---------- data generation ----------
function makeData() {
  randomSeed(seed);
  kids = [];
  for (let g = 1; g >= 0; g--) {
    for (let i = 0; i < N_PER_GROUP; i++) {
      // selective eating: autistic group eats fewer kinds of food on average (illustrative)
      const diet = constrain(randomGaussian(g === 1 ? 17 : 26, 6), 5, 40); // foods per week
      const age = random(6, 14);                 // balanced between groups
      const abx = random() < 0.2 ? 1 : 0;        // balanced between groups
      const y = 40 + 1.1 * (diet - 22) + 0.6 * (age - 10) - 6 * abx + randomGaussian(0, 4);
      kids.push({ g: g, diet: diet, age: age, abx: abx, y: y, jitter: random(-1, 1) });
    }
  }
}

function newSample() {
  seed = floor(random(1, 100000));
  makeData();
}

// ---------- statistics ----------
// Solve A x = b by Gaussian elimination (small systems only)
function solve(A, b) {
  const n = b.length;
  const M = A.map((row, i) => row.concat([b[i]]));
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (abs(M[r][c]) > abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    if (abs(M[c][c]) < 1e-9) return null;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((row, i) => row[n] / row[i]);
}

function selectedVars() {
  const v = [];
  if (dietBox.checked()) v.push('diet');
  if (ageBox.checked()) v.push('age');
  if (abxBox.checked()) v.push('abx');
  return v;
}

function computeStats() {
  const vars = selectedVars();
  const means = {};
  for (const v of ['diet', 'age', 'abx']) {
    means[v] = kids.reduce((s, k) => s + k[v], 0) / kids.length;
  }
  // regression y = b0 + bg*g + sum(bk * xk)
  const cols = (k) => [1, k.g].concat(vars.map(v => k[v]));
  const p = 2 + vars.length;
  const XtX = Array.from({ length: p }, () => new Array(p).fill(0));
  const Xty = new Array(p).fill(0);
  for (const k of kids) {
    const x = cols(k);
    for (let i = 0; i < p; i++) {
      Xty[i] += x[i] * k.y;
      for (let j = 0; j < p; j++) XtX[i][j] += x[i] * x[j];
    }
  }
  const beta = vars.length ? solve(XtX, Xty) : null;
  for (const k of kids) {
    let adj = k.y;
    if (beta) vars.forEach((v, idx) => { adj -= beta[2 + idx] * (k[v] - means[v]); });
    k.adj = adj;
  }
  const meanOf = (g, key) => {
    const s = kids.filter(k => k.g === g);
    return s.reduce((a, k) => a + k[key], 0) / s.length;
  };
  const rawA = meanOf(1, 'y'), rawC = meanOf(0, 'y');
  const adjA = meanOf(1, 'adj'), adjC = meanOf(0, 'adj');
  return {
    vars: vars,
    rawA: rawA, rawC: rawC, rawDiff: rawC - rawA,
    adjA: adjA, adjC: adjC, adjDiff: adjC - adjA,
    dietA: meanOf(1, 'diet'), dietC: meanOf(0, 'diet')
  };
}

// ---------- drawing ----------
function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  let ts = 24;
  const title = 'Confounder Detective';
  textSize(ts);
  while (textWidth(title) > canvasWidth - 2 * margin && ts > 16) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);
  textSize(15);
  fill('dimgray');
  text('Why do the groups differ? Color the dots to look for clues, then check "Account for" boxes. All data are simulated.',
    margin, 38, canvasWidth - 2 * margin, 62);
  return 38 + (canvasWidth < 560 ? 3 : 2) * 18 + 4;
}

function dotColor(k) {
  const mode = colorSelect.value();
  if (mode === COLOR_DIET) {
    if (k.diet < 18) return color('darkorange');
    if (k.diet < 26) return color('gold');
    return color('teal');
  }
  if (mode === COLOR_AGE) {
    return lerpColor(color('lightskyblue'), color('navy'), constrain((k.age - 6) / 8, 0, 1));
  }
  if (mode === COLOR_ABX) {
    return k.abx ? color('crimson') : color('silver');
  }
  return color('slategray');
}

function drawPlot(topY, stats) {
  const axisX = margin + 34;
  const plotTop = topY + 26;
  const plotBottom = 318;
  const right = canvasWidth - margin;
  const plotW = right - axisX;
  const yOf = (v) => map(constrain(v, Y_MIN, Y_MAX), Y_MIN, Y_MAX, plotBottom, plotTop);
  const adjusted = stats.vars.length > 0;

  // axis title
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text(adjusted ? 'Adjusted microbiome diversity score (made-up units)'
                : 'Microbiome diversity score (made-up units)', margin, topY + 4, canvasWidth - 2 * margin, 20);

  // plot background and grid
  fill('white');
  stroke('gainsboro');
  rect(axisX, plotTop, plotW, plotBottom - plotTop);
  textSize(14);
  for (let v = 20; v <= 60; v += 20) {
    stroke('gainsboro');
    line(axisX, yOf(v), right, yOf(v));
    noStroke();
    fill('dimgray');
    textAlign(RIGHT, CENTER);
    text(v, axisX - 4, yOf(v));
  }

  const cx = [axisX + plotW * 0.28, axisX + plotW * 0.72];
  const spread = min(70, plotW * 0.18);
  const labels = ['Autistic group', 'Comparison group'];
  const means = [adjusted ? stats.adjA : stats.rawA, adjusted ? stats.adjC : stats.rawC];

  for (let col = 0; col < 2; col++) {
    const g = col === 0 ? 1 : 0;
    for (const k of kids) {
      if (k.g !== g) continue;
      const val = adjusted ? k.adj : k.y;
      noStroke();
      fill(dotColor(k));
      circle(cx[col] + k.jitter * spread, yOf(val), 8);
    }
    // mean line
    stroke('black');
    strokeWeight(3);
    line(cx[col] - spread - 10, yOf(means[col]), cx[col] + spread + 10, yOf(means[col]));
    strokeWeight(1);
    noStroke();
    fill('black');
    textSize(14);
    textAlign(CENTER, TOP);
    text(labels[col], cx[col], plotBottom + 4);
  }

  // legend for colors
  const mode = colorSelect.value();
  let legend = 'Black line = group average.';
  if (mode === COLOR_DIET) legend = 'Kinds of food: orange = few, gold = some, teal = many.';
  if (mode === COLOR_AGE) legend = 'Light blue = younger (6), navy = older (14).';
  if (mode === COLOR_ABX) legend = 'Red = antibiotics in the past month.';
  fill('dimgray');
  textAlign(CENTER, TOP);
  text(legend, canvasWidth / 2, plotBottom + 22);
}

function drawResults(stats) {
  const px = margin;
  const py = 360;
  const pw = canvasWidth - 2 * margin;
  const ph = 96;
  stroke(200);
  fill(255, 255, 255, 235);
  rect(px, py, pw, ph, 8);

  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  const raw = nf(stats.rawDiff, 1, 1);
  let line1 = 'Gap between averages: ' + raw + ' points';
  if (stats.vars.length) line1 = 'Gap: ' + raw + ' points raw, ' + nf(stats.adjDiff, 1, 1) + ' after accounting';
  text(line1, px + 8, py + 6, pw - 16, 20);

  // gap bar (0 to 15 points)
  const bx = px + 8, bw = pw - 16, by = py + 26;
  fill('gainsboro');
  rect(bx, by, bw, 10, 4);
  const shown = stats.vars.length ? stats.adjDiff : stats.rawDiff;
  fill(abs(shown) < 2.5 ? 'mediumseagreen' : 'tomato');
  rect(bx, by, bw * constrain(abs(shown) / 15, 0, 1), 10, 4);

  fill('black');
  textLeading(17);
  text(statusText(stats), px + 8, py + 42, pw - 16, ph - 44);
}

function statusText(s) {
  const hasDiet = s.vars.includes('diet');
  if (s.vars.length === 0) {
    return 'The autistic group averages lower. Is autism the reason, or something else? Color the dots to look for clues.';
  }
  if (hasDiet) {
    return 'Diet accounted for: the gap shrinks to about ' + nf(abs(s.adjDiff), 1, 1) +
      ' points. Diet is the confounder: it differs between groups and shapes the microbiome.';
  }
  return 'Barely changed. Age and antibiotics affect scores but are spread evenly across groups, so they don\'t explain the gap.';
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Color dots by:', 118, drawHeight + 20);
  text('Account for:', 10, drawHeight + 62);
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
