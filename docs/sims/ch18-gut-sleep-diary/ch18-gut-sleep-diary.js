// Gut and Sleep Diary MicroSim
// Chapter 18 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 600 (drawHeight 450 + controlHeight 150); iframe height 602px
// Learning objective (Evaluate): record or explore one week of sleep, stress, and
// gut-symptom ratings, read the correlation between sleep and symptoms, and judge
// the limits of personal data (small samples, confounders, reverse direction).
// PRIVACY: all data lives in memory only. Nothing is stored (no localStorage,
// no cookies) and nothing is sent over the network. Reloading erases it.
// The preloaded week is fictional practice data, clearly labeled.

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 15;
let sliderLeftMargin = 190;
let defaultTextSize = 16;

// ---------- controls ----------
let daySelect, sampleButton, clearButton, stressCheckbox;
let sleepSlider, stressSlider, gutSlider;
let syncing = false; // true while we move sliders to show a stored day

// ---------- data (memory only) ----------
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
// Fictional practice week for Sam (made up for this exercise)
const SAMPLE = [
  { sleep: 7.5, stress: 3, gut: 2 },
  { sleep: 6.0, stress: 5, gut: 4 },
  { sleep: 5.0, stress: 8, gut: 7 }, // chemistry test day
  { sleep: 8.0, stress: 4, gut: 3 },
  { sleep: 6.5, stress: 6, gut: 5 },
  { sleep: 9.0, stress: 2, gut: 2 },
  { sleep: 7.0, stress: 5, gut: 3 }
];
let entries = [];       // {sleep, stress, gut, logged}
let usingSample = true; // label shown on the chart

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: day select, sample data, clear
  daySelect = createSelect();
  for (const d of DAYS) daySelect.option(d);
  daySelect.selected('Wed');
  daySelect.position(50, drawHeight + 8);
  daySelect.changed(showSelectedDay);

  sampleButton = createButton('Load sample data');
  sampleButton.position(115, drawHeight + 8);
  sampleButton.mousePressed(loadSample);

  clearButton = createButton('Clear all');
  clearButton.position(250, drawHeight + 8);
  clearButton.mousePressed(clearAll);

  // Row 2: show stress checkbox
  stressCheckbox = createCheckbox(' Show stress line', false);
  stressCheckbox.position(10, drawHeight + 40);

  // Rows 3 to 5: sliders
  sleepSlider = createSlider(3, 11, 7, 0.5);
  sleepSlider.position(sliderLeftMargin, drawHeight + 66);
  sleepSlider.input(recordFromSliders);

  stressSlider = createSlider(0, 10, 5, 1);
  stressSlider.position(sliderLeftMargin, drawHeight + 92);
  stressSlider.input(recordFromSliders);

  gutSlider = createSlider(0, 10, 5, 1);
  gutSlider.position(sliderLeftMargin, drawHeight + 118);
  gutSlider.input(recordFromSliders);

  resizeSliders();
  loadSample();

  describe('A one-week diary. A top chart shows hours of sleep as blue bars and gut symptom scores ' +
    'as an orange line for Monday to Sunday, with an optional purple stress line. A scatter plot ' +
    'compares sleep with gut symptoms and reports the correlation r, along with warnings about ' +
    'small samples and confounders. Data stays only in the page.');
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
  drawTimeChart();
  drawScatterAndPanel();
  drawControlLabels();
}

// ---------- data actions ----------
function loadSample() {
  entries = SAMPLE.map(e => ({ sleep: e.sleep, stress: e.stress, gut: e.gut, logged: true }));
  usingSample = true;
  showSelectedDay();
}

function clearAll() {
  entries = DAYS.map(() => ({ sleep: 7, stress: 5, gut: 5, logged: false }));
  usingSample = false;
  showSelectedDay();
}

function dayIndex() {
  return DAYS.indexOf(daySelect.value());
}

function showSelectedDay() {
  const e = entries[dayIndex()];
  syncing = true;
  sleepSlider.value(e.sleep);
  stressSlider.value(e.stress);
  gutSlider.value(e.gut);
  syncing = false;
}

function recordFromSliders() {
  if (syncing) return;
  const e = entries[dayIndex()];
  e.sleep = sleepSlider.value();
  e.stress = stressSlider.value();
  e.gut = gutSlider.value();
  e.logged = true;
  usingSample = false; // edited data is no longer the untouched sample
}

// ---------- statistics ----------
function pearson(xs, ys) {
  const n = xs.length;
  if (n < 3) return null;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  if (sxx === 0 || syy === 0) return null;
  return sxy / Math.sqrt(sxx * syy);
}

function loggedEntries() {
  return entries.filter(e => e.logged);
}

function strengthWord(r) {
  const a = Math.abs(r);
  const dir = r < 0 ? 'negative' : 'positive';
  if (a < 0.1) return 'almost no';
  if (a < 0.3) return 'weak ' + dir;
  if (a < 0.5) return 'moderate ' + dir;
  return 'strong ' + dir;
}

// ---------- drawing ----------
function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  let ts = 22;
  textSize(ts);
  const title = 'Gut and Sleep Diary';
  while (textWidth(title) > canvasWidth - 20 && ts > 14) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);
  textSize(14);
  fill('dimgray');
  const instr = 'Pick a day, move the sliders to log it. Data stays on this page only.';
  drawWrapped(instr, canvasWidth / 2, 36, canvasWidth - 20, CENTER);
}

// draws wrapped text and returns the height used
function drawWrapped(str, x, y, w, align) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const wd of words) {
    const test = line ? line + ' ' + wd : wd;
    if (textWidth(test) > w && line) {
      lines.push(line);
      line = wd;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  textAlign(align, TOP);
  const lh = textSize() * 1.25;
  lines.forEach((l, i) => text(l, x, y + i * lh));
  return lines.length * lh;
}

function chartTop() {
  return canvasWidth < 520 ? 92 : 76;
}

function drawTimeChart() {
  const top = chartTop();
  const left = 44, right = canvasWidth - 44;
  const h = 120;
  const bottom = top + h;
  const w = right - left;
  const slot = w / 7;

  // label: sample or your data
  noStroke();
  textSize(14);
  textAlign(LEFT, BOTTOM);
  if (usingSample) {
    fill('darkred');
    text('Sample data: Sam\'s made-up week', left, top - 2);
  } else {
    fill('darkslategray');
    text('Your entries (in memory only)', left, top - 2);
  }

  // axes
  stroke('gray');
  strokeWeight(1);
  line(left, bottom, right, bottom);
  line(left, top + 8, left, bottom);
  line(right, top + 8, right, bottom);

  // left axis: sleep hours 0 to 11; right axis: score 0 to 10
  noStroke();
  fill('steelblue');
  textAlign(RIGHT, CENTER);
  textSize(14);
  text('11 h', left - 4, top + 8);
  text('0', left - 4, bottom);
  fill('darkorange');
  textAlign(LEFT, CENTER);
  text('10', right + 4, top + 8);
  text('0', right + 4, bottom);

  const ySleep = v => map(v, 0, 11, bottom, top + 8);
  const yScore = v => map(v, 0, 10, bottom, top + 8);

  // sleep bars
  for (let i = 0; i < 7; i++) {
    const e = entries[i];
    const cx = left + slot * (i + 0.5);
    const isSel = i === dayIndex();
    if (e.logged) {
      noStroke();
      fill(isSel ? 'royalblue' : 'lightsteelblue');
      rect(cx - slot * 0.3, ySleep(e.sleep), slot * 0.6, bottom - ySleep(e.sleep));
    } else {
      stroke('silver');
      noFill();
      rect(cx - slot * 0.3, bottom - 20, slot * 0.6, 20);
    }
    noStroke();
    fill(isSel ? 'black' : 'dimgray');
    textAlign(CENTER, TOP);
    textSize(14);
    text(DAYS[i], cx, bottom + 3);
  }

  // gut line and stress line over logged days
  drawSeries(i => yScore(entries[i].gut), 'darkorange', left, slot);
  if (stressCheckbox.checked()) drawSeries(i => yScore(entries[i].stress), 'purple', left, slot);

  // legend
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  let lx = left;
  const ly = bottom + 22;
  fill('lightsteelblue'); rect(lx, ly + 3, 12, 12);
  fill('black'); text('Sleep (h)', lx + 16, ly);
  lx += 16 + textWidth('Sleep (h)') + 12;
  fill('darkorange'); rect(lx, ly + 7, 14, 4);
  fill('black'); text('Gut (0-10)', lx + 18, ly);
  lx += 18 + textWidth('Gut (0-10)') + 12;
  if (stressCheckbox.checked()) {
    fill('purple'); rect(lx, ly + 7, 14, 4);
    fill('black'); text('Stress', lx + 18, ly);
  }
}

function drawSeries(yf, col, left, slot) {
  stroke(col);
  strokeWeight(3);
  let prev = null;
  for (let i = 0; i < 7; i++) {
    if (!entries[i].logged) { prev = null; continue; }
    const p = { x: left + slot * (i + 0.5), y: yf(i) };
    if (prev) line(prev.x, prev.y, p.x, p.y);
    prev = p;
  }
  noStroke();
  fill(col);
  for (let i = 0; i < 7; i++) {
    if (entries[i].logged) circle(left + slot * (i + 0.5), yf(i), 8);
  }
  strokeWeight(1);
}

function drawScatterAndPanel() {
  const top = chartTop() + 120 + 48;
  const narrow = canvasWidth < 560;
  const size = narrow ? min(120, canvasWidth * 0.32) : 170;
  const bottomLimit = drawHeight - 10;
  const sx = narrow ? 38 : 46, sy = top + 6;
  const sh = min(size, bottomLimit - sy - 30);
  const sw = sh;

  // scatter plot: x = sleep hours, y = gut score
  stroke('gray');
  strokeWeight(1);
  fill('white');
  rect(sx, sy, sw, sh);
  noStroke();
  fill('black');
  textSize(14);
  textAlign(CENTER, TOP);
  text('Sleep (hours)', sx + sw / 2, sy + sh + 14);
  textAlign(CENTER, BOTTOM);
  push();
  translate(sx - 20, sy + sh / 2);
  rotate(-HALF_PI);
  text('Gut score', 0, 8);
  pop();
  textAlign(CENTER, TOP);
  fill('dimgray');
  text('3', sx, sy + sh + 1);
  text('11', sx + sw, sy + sh + 1);

  const logged = loggedEntries();
  for (let i = 0; i < 7; i++) {
    const e = entries[i];
    if (!e.logged) continue;
    const px = map(e.sleep, 3, 11, sx + 6, sx + sw - 6);
    const py = map(e.gut, 0, 10, sy + sh - 6, sy + 6);
    stroke('white');
    fill(i === dayIndex() ? 'crimson' : 'darkorange');
    circle(px, py, 11);
  }

  // stats panel
  const px = sx + sw + 18;
  const pw = canvasWidth - px - 10;
  const xs = logged.map(e => e.sleep), gs = logged.map(e => e.gut), ss = logged.map(e => e.stress);
  const rSleep = pearson(xs, gs);
  const rStressGut = pearson(ss, gs);
  const rStressSleep = pearson(ss, xs);

  fill(255, 255, 255, 230);
  stroke(200);
  rect(px - 6, sy - 4, pw + 2, bottomLimit - sy + 4, 10);
  noStroke();
  textSize(14);
  let y = sy + 2;
  fill('black');
  if (rSleep === null) {
    y += drawWrapped('Log at least 3 days (with some variety) to see a correlation.', px, y, pw - 8, LEFT);
  } else {
    textStyle(BOLD);
    y += drawWrapped('Sleep vs gut: r = ' + nf(rSleep, 1, 2), px, y, pw - 8, LEFT);
    textStyle(NORMAL);
    y += drawWrapped('(' + strengthWord(rSleep) + ')', px, y, pw - 8, LEFT) + 4;
  }
  fill('firebrick');
  y += drawWrapped('Small sample: only ' + logged.length + ' day' + (logged.length === 1 ? '' : 's') +
    '. One odd day can swing r a lot.', px, y, pw - 8, LEFT) + 4;
  if (rStressGut !== null && rStressSleep !== null &&
      Math.abs(rStressGut) >= 0.5 && Math.abs(rStressSleep) >= 0.5) {
    fill('purple');
    y += drawWrapped('Confounder alert: stress tracks both sleep and gut (stress vs gut r = ' +
      nf(rStressGut, 1, 2) + ').', px, y, pw - 8, LEFT) + 4;
  }
  fill('dimgray');
  if (y < bottomLimit - 20) {
    drawWrapped('Correlation is not cause.',
      px, y, pw - 8, LEFT);
  }
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Day:', 10, drawHeight + 20);
  const d = daySelect.value();
  text(d + ' sleep: ' + nf(sleepSlider.value(), 1, 1) + ' h', 10, drawHeight + 76);
  text(d + ' stress: ' + stressSlider.value() + '/10', 10, drawHeight + 102);
  text(d + ' gut: ' + gutSlider.value() + '/10', 10, drawHeight + 128);
}

// ---------- responsive ----------
function resizeSliders() {
  const w = max(80, canvasWidth - sliderLeftMargin - margin);
  sleepSlider.size(w);
  stressSlider.size(w);
  gutSlider.size(w);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  resizeSliders();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
