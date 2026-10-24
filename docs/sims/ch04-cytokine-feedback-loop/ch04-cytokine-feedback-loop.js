// Cytokine Feedback Loop MicroSim
// Chapter 4 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 610 (drawHeight 470 + controlHeight 140); iframe height 612px
// Learning objective (Understand/Analyze): explain immune-to-brain signaling as a
// feedback loop (gut inflammation -> cytokines -> brain/microglia -> sleep and mood
// -> stress, with sleep and stress feeding back) and analyze how breaking one link
// weakens the whole loop.
// All weights and levels are illustrative teaching values (arbitrary units 0 to 1),
// not measurements.

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 190;
let defaultTextSize = 16;

// ---------- controls ----------
let startButton, resetButton, breakSelect;
let gutSlider, sleepSlider, stressSlider;
let isRunning = false; // MicroSims open paused

const BREAK_NONE = 'No link broken';
const BREAK_GUT = 'Treat gut inflammation';
const BREAK_SLEEP = 'Protect sleep';
const BREAK_STRESS = 'Manage stress';

// ---------- model ----------
// node ids
const G = 0, C = 1, B = 2, S = 3, M = 4, T = 5;
const nodeNames = [
  'Gut inflammation',
  'Cytokines (IL-1β, IL-6, TNF)',
  'Brain and microglia',
  'Sleep problems',
  'Low mood and fatigue',
  'Stress'
];
const nodeColors = ['tomato', 'orangered', 'mediumpurple', 'steelblue', 'slateblue', 'darkorange'];
let level = [0, 0, 0, 0, 0, 0];

// edges: [from, to, weight, isFeedback]
const edges = [
  [G, C, 0.8, false],
  [C, B, 0.8, false],
  [B, S, 0.5, false],
  [B, M, 0.6, false],
  [S, M, 0.25, false],
  [M, T, 0.4, false],
  [S, C, 0.3, true],
  [T, C, 0.2, true],
  [T, G, 0.2, true]
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  startButton = createButton('Start');
  startButton.position(10, drawHeight + 8);
  startButton.mousePressed(toggleSimulation);

  resetButton = createButton('Reset');
  resetButton.position(72, drawHeight + 8);
  resetButton.mousePressed(resetSimulation);

  breakSelect = createSelect();
  breakSelect.option(BREAK_NONE);
  breakSelect.option(BREAK_GUT);
  breakSelect.option(BREAK_SLEEP);
  breakSelect.option(BREAK_STRESS);
  breakSelect.selected(BREAK_NONE);
  breakSelect.position(140, drawHeight + 9);

  gutSlider = createSlider(0, 10, 2, 1);
  gutSlider.position(sliderLeftMargin, drawHeight + 46);
  sleepSlider = createSlider(4, 10, 8, 0.5);
  sleepSlider.position(sliderLeftMargin, drawHeight + 78);
  stressSlider = createSlider(0, 10, 3, 1);
  stressSlider.position(sliderLeftMargin, drawHeight + 110);
  sizeSliders();

  describe('A loop of six boxes: gut inflammation, cytokines, brain and microglia, sleep problems, ' +
    'low mood and fatigue, and stress, connected by arrows. Arrows grow brighter and thicker as ' +
    'signals get stronger, and a loop strength meter in the middle shows how strong the whole loop is. ' +
    'Sliders set gut inflammation, hours of sleep, and life stress, and a menu breaks one link.');
}

function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (isRunning) stepModel();

  drawTitle();
  drawLoop();
  drawStatus();
  drawControlLabels();
}

// ---------- model ----------
function edgeWeight(e) {
  const choice = breakSelect.value();
  let w = e[2];
  if (choice === BREAK_SLEEP && e[0] === S) w *= 0.15;          // sleep problems no longer feed the loop
  if (choice === BREAK_STRESS && e[0] === T) w *= 0.15;         // stress no longer feeds inflammation
  return w;
}

function inputs() {
  const choice = breakSelect.value();
  let gut = gutSlider.value() / 10;
  if (choice === BREAK_GUT) gut *= 0.3;                        // treatment lowers gut inflammation
  let sleepLoss = constrain((9 - sleepSlider.value()) / 5, 0, 1); // 9+ h = none, 4 h = most
  if (choice === BREAK_SLEEP) sleepLoss *= 0.3;
  let stress = stressSlider.value() / 10;
  if (choice === BREAK_STRESS) stress *= 0.5;
  const inp = [gut, 0, 0, sleepLoss * 0.4, 0, stress * 0.5];
  return inp;
}

function stepModel() {
  const inp = inputs();
  const target = inp.slice();
  for (const e of edges) target[e[1]] += edgeWeight(e) * level[e[0]];
  for (let i = 0; i < 6; i++) {
    target[i] = constrain(target[i], 0, 1);
    level[i] += 0.03 * (target[i] - level[i]);
  }
}

function loopStrength() {
  return round(100 * (level[C] + level[B] + level[S] + level[M]) / 4);
}

function resetSimulation() {
  level = [0, 0, 0, 0, 0, 0];
  gutSlider.value(2);
  sleepSlider.value(8);
  stressSlider.value(3);
  breakSelect.selected(BREAK_NONE);
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
  const title = 'Cytokine Feedback Loop';
  textSize(ts);
  while (textWidth(title) > canvasWidth - 2 * margin && ts > 16) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);

  textSize(15);
  fill('dimgray');
  text('Press Start, raise gut inflammation, then try breaking one link.',
    margin, 38, canvasWidth - 2 * margin, 44);
}

function layout() {
  const cx = canvasWidth / 2;
  const cy = 262;
  const rx = min(canvasWidth * 0.34, 230);
  const ry = 118;
  const bw = canvasWidth < 520 ? 96 : 132;
  const bh = 46;
  const pos = [];
  for (let i = 0; i < 6; i++) {
    const a = -HALF_PI + i * TWO_PI / 6;
    pos.push({ x: cx + rx * cos(a), y: cy + ry * sin(a) });
  }
  return { cx, cy, rx, ry, bw, bh, pos };
}

// point where the line from a to b leaves a box of half-size hw x hh centered on b
function clipToBox(ax, ay, bx, by, hw, hh) {
  const dx = ax - bx, dy = ay - by;
  const s = min(hw / max(abs(dx), 0.001), hh / max(abs(dy), 0.001));
  return { x: bx + dx * s, y: by + dy * s };
}

function drawArrow(x1, y1, x2, y2, col, wt) {
  stroke(col);
  strokeWeight(wt);
  line(x1, y1, x2, y2);
  const ang = atan2(y2 - y1, x2 - x1);
  const hs = 8 + wt;
  noStroke();
  fill(col);
  triangle(x2, y2,
    x2 - hs * cos(ang - 0.4), y2 - hs * sin(ang - 0.4),
    x2 - hs * cos(ang + 0.4), y2 - hs * sin(ang + 0.4));
}

function drawLoop() {
  const L = layout();
  const choice = breakSelect.value();

  // arrows
  for (const e of edges) {
    const a = L.pos[e[0]], b = L.pos[e[1]];
    const start = clipToBox(b.x, b.y, a.x, a.y, L.bw / 2 + 2, L.bh / 2 + 2);
    const end = clipToBox(a.x, a.y, b.x, b.y, L.bw / 2 + 4, L.bh / 2 + 4);
    const sig = constrain(edgeWeight(e) * level[e[0]] / 0.6, 0, 1);
    const base = e[3] ? color(128, 0, 128) : color(205, 55, 0);
    base.setAlpha(70 + 185 * sig);
    drawArrow(start.x, start.y, end.x, end.y, base, 1 + 5 * sig);

    const cut = (choice === BREAK_SLEEP && e[0] === S) || (choice === BREAK_STRESS && e[0] === T);
    if (cut) {
      const mx = (start.x + end.x) / 2, my = (start.y + end.y) / 2;
      stroke('black');
      strokeWeight(3);
      line(mx - 7, my - 7, mx + 7, my + 7);
      line(mx - 7, my + 7, mx + 7, my - 7);
    }
  }

  // nodes
  for (let i = 0; i < 6; i++) {
    const p = L.pos[i];
    const c = lerpColor(color('white'), color(nodeColors[i]), constrain(level[i], 0, 1) * 0.85);
    stroke(nodeColors[i]);
    strokeWeight(2);
    fill(c);
    rect(p.x - L.bw / 2, p.y - L.bh / 2, L.bw, L.bh, 10);
    noStroke();
    fill('black');
    textAlign(CENTER, CENTER);
    let label = nodeNames[i];
    if (i === C && L.bw < 120) label = 'Cytokines';
    textSize(14);
    text(label, p.x - L.bw / 2 + 4, p.y - L.bh / 2 + 2, L.bw - 8, L.bh - 4);
  }
  if (choice === BREAK_GUT) {
    noStroke();
    fill('darkgreen');
    textSize(14);
    textAlign(CENTER, BOTTOM);
    text('treated', L.pos[G].x, L.pos[G].y - L.bh / 2 - 2);
  }

  // loop strength meter in the middle
  const mw = min(140, L.rx * 0.8);
  const mx = L.cx - mw / 2;
  const my = L.cy - 8;
  noStroke();
  fill('black');
  textSize(14);
  textAlign(CENTER, BOTTOM);
  text('Loop strength', L.cx, my - 4);
  stroke('gray');
  strokeWeight(1);
  fill('white');
  rect(mx, my, mw, 16, 4);
  const ls = loopStrength();
  noStroke();
  fill(ls > 55 ? 'crimson' : ls >= 25 ? 'orange' : 'mediumseagreen');
  rect(mx + 1, my + 1, (mw - 2) * ls / 100, 14, 3);
  fill('black');
  textAlign(CENTER, TOP);
  text(ls + ' / 100', L.cx, my + 19);
}

function statusText() {
  const ls = loopStrength();
  const choice = breakSelect.value();
  if (!isRunning && ls === 0) return 'Paused. Press Start to send signals around the loop.';
  let s;
  if (ls < 25) s = 'Quiet loop: little inflammation, so the brain gets few cytokine messages.';
  else if (ls <= 55) s = 'Building: cytokines are reaching the brain, and sleep and mood are starting to shift.';
  else s = 'Strong loop: sleep problems and stress are feeding signal back into the start.';
  if (choice === BREAK_GUT) s += ' Treatment has lowered gut inflammation.';
  if (choice === BREAK_SLEEP) s += ' Protected sleep has cut the sleep feedback arrow.';
  if (choice === BREAK_STRESS) s += ' Managing stress has cut the stress feedback arrows.';
  return s;
}

function drawStatus() {
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text(statusText(), margin, 408, canvasWidth - 2 * margin, 40);
  fill('gray');
  const key = 'Red = forward, purple = feedback. Not to scale.';
  let ks = 14;
  while (textWidth(key) > canvasWidth - 2 * margin && ks > 10) { ks--; textSize(ks); } // fit narrow screens
  text(key, margin, 450, canvasWidth - 2 * margin, 20);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Gut inflammation: ' + gutSlider.value(), 10, drawHeight + 56);
  text('Sleep: ' + nf(sleepSlider.value(), 1, 1) + ' hours', 10, drawHeight + 88);
  text('Life stress: ' + stressSlider.value(), 10, drawHeight + 120);
}

// ---------- responsive ----------
function sizeSliders() {
  const w = canvasWidth - sliderLeftMargin - margin;
  gutSlider.size(w);
  sleepSlider.size(w);
  stressSlider.size(w);
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
