// Gut-First or Brain-First? MicroSim
// Chapter 14 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 670 (drawHeight 560 + controlHeight 110); iframe height 672px
// Learning objective (Analyze/Evaluate): compare the gut-first and brain-first
// hypotheses of Parkinson's disease by the order of early symptoms each predicts,
// and explain why cutting the vagus nerve matters only in the gut-first route.
// This is a MODEL OF COMPETING HYPOTHESES (Braak 2003; Borghammer and Van Den Berge 2019).
// All travel times are illustrative "model years", not measured values.

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 560;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let sliderLeftMargin = 150;
let defaultTextSize = 16;

// ---------- controls ----------
let startButton, resetButton, routeSelect, vagusCheckbox, speedSlider;
let isRunning = false; // opens paused

const ROUTE_GUT = 'Gut-first: starts in the gut wall';
const ROUTE_BRAIN = 'Brain-first: starts inside the brain';

// ---------- model ----------
const MAX_YEARS = 25;
const SYMPTOM_LAG = 1.5;   // model years from arrival to a noticeable symptom
const RAMP = 3;            // model years for a region to fill with pathology
let t = 0;                 // model years since the starting point

// Regions. x is an offset from the body's center line (px at full scale),
// y is a fraction of the body diagram height.
const regions = {
  cortex: { name: 'Cortex', dx: 0, fy: 0.07, side: 'right' },
  smell: { name: 'Smell center', dx: -30, fy: 0.15, side: 'left' },
  amyg: { name: 'Amygdala', dx: 30, fy: 0.19, side: 'right' },
  sn: { name: 'Substantia nigra', dx: 8, fy: 0.27, side: 'right' },
  pons: { name: 'Pons (sleep)', dx: -10, fy: 0.34, side: 'left' },
  dmv: { name: 'Vagus nucleus', dx: 6, fy: 0.42, side: 'right' },
  gut: { name: 'Gut wall (ENS)', dx: 0, fy: 0.85, side: 'right' }
};

// Connections with illustrative travel delays (model years)
const edges = [
  ['gut', 'dmv', 5],     // along the vagus nerve
  ['dmv', 'pons', 3],
  ['pons', 'smell', 3],
  ['pons', 'amyg', 4],
  ['pons', 'sn', 6],
  ['smell', 'amyg', 2],
  ['amyg', 'sn', 3],
  ['sn', 'cortex', 8],
  ['amyg', 'cortex', 10]
];

// Symptoms tied to regions
const symptoms = [
  { region: 'gut', label: 'Constipation', color: 'darkorange' },
  { region: 'pons', label: 'Acts out dreams', color: 'mediumpurple' },
  { region: 'smell', label: 'Smell loss', color: 'seagreen' },
  { region: 'sn', label: 'Movement (diagnosis)', color: 'crimson' },
  { region: 'cortex', label: 'Thinking changes', color: 'steelblue' }
];

let arrival = {}; // region -> model year pathology arrives (Infinity = never)
let parent = {};  // region -> region it came from (for drawing the spread)

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: Start/Pause, Reset, route select
  startButton = createButton('Start');
  startButton.position(10, drawHeight + 8);
  startButton.mousePressed(toggleSimulation);

  resetButton = createButton('Reset');
  resetButton.position(72, drawHeight + 8);
  resetButton.mousePressed(resetSimulation);

  routeSelect = createSelect();
  routeSelect.option(ROUTE_GUT);
  routeSelect.option(ROUTE_BRAIN);
  routeSelect.selected(ROUTE_GUT);
  routeSelect.position(136, drawHeight + 8);
  sizeRouteSelect();
  routeSelect.changed(restartTime);

  // Row 2: vagotomy checkbox
  vagusCheckbox = createCheckbox(' Cut the vagus nerve', false);
  vagusCheckbox.position(10, drawHeight + 42);
  vagusCheckbox.changed(restartTime);

  // Row 3: speed slider
  speedSlider = createSlider(0.5, 4, 2, 0.5);
  speedSlider.position(sliderLeftMargin, drawHeight + 78);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);

  computeArrivals();

  describe('A model of two competing hypotheses about Parkinson\'s disease. A simple body diagram shows the gut, ' +
    'the vagus nerve, and brain regions. Red pathology spreads along connections from the chosen starting point, ' +
    'and a timeline below shows when constipation, acting out dreams, smell loss, movement symptoms, and thinking ' +
    'changes appear in each route. Cutting the vagus nerve blocks gut-to-brain spread.');
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
    t += speedSlider.value() / 60;
    if (t >= MAX_YEARS) {
      t = MAX_YEARS;
      isRunning = false;
      startButton.html('Start');
    }
  }

  drawTitle();
  drawBody();
  drawTimeline();
  drawStatus();
  drawControlLabels();
}

// ---------- model ----------
function computeArrivals() {
  const start = routeSelect.value() === ROUTE_GUT ? 'gut' : 'amyg';
  const cut = vagusCheckbox.checked();
  arrival = {};
  parent = {};
  for (const k in regions) arrival[k] = Infinity;
  arrival[start] = 0;
  const done = {};
  // Dijkstra on a tiny graph
  for (let i = 0; i < Object.keys(regions).length; i++) {
    let best = null;
    for (const k in regions) {
      if (!done[k] && (best === null || arrival[k] < arrival[best])) best = k;
    }
    if (best === null || arrival[best] === Infinity) break;
    done[best] = true;
    for (const e of edges) {
      if (cut && ((e[0] === 'gut' && e[1] === 'dmv') || (e[0] === 'dmv' && e[1] === 'gut'))) continue;
      let other = null;
      if (e[0] === best) other = e[1];
      else if (e[1] === best) other = e[0];
      if (other && !done[other] && arrival[best] + e[2] < arrival[other]) {
        arrival[other] = arrival[best] + e[2];
        parent[other] = { from: best, delay: e[2] };
      }
    }
  }
}

function level(k) {
  if (arrival[k] === Infinity || t < arrival[k]) return 0;
  return constrain((t - arrival[k]) / RAMP, 0, 1);
}

function symptomOnset(region) {
  return arrival[region] === Infinity ? Infinity : arrival[region] + SYMPTOM_LAG;
}

// ---------- drawing ----------
function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  const title = 'Gut-First or Brain-First?';
  let ts = 20;
  textSize(ts);
  while (textWidth(title) > canvasWidth - 20 && ts > 14) {
    ts -= 1;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);
  textSize(14);
  fill('dimgray');
  text('A model of two competing ideas. Pick a start, press Start, and compare the symptom order.', 10, 34, canvasWidth - 20, 40);
}

function bodyBox() {
  // area for the body diagram
  return { top: 80, h: 240, cx: canvasWidth / 2 };
}

function regionXY(k) {
  const b = bodyBox();
  const r = regions[k];
  const s = min(1, canvasWidth / 500);
  return { x: b.cx + r.dx * s, y: b.top + r.fy * b.h };
}

function drawBody() {
  const b = bodyBox();
  const s = min(1, canvasWidth / 500);
  const headR = 62 * s;
  const headY = b.top + 0.24 * b.h;

  // body outline
  stroke('lightsteelblue');
  strokeWeight(2);
  fill('white');
  ellipse(b.cx, headY, headR * 2.1, b.h * 0.5);         // head
  rect(b.cx - 12 * s, headY + b.h * 0.24, 24 * s, b.h * 0.08); // neck
  rect(b.cx - 70 * s, b.top + b.h * 0.6, 140 * s, b.h * 0.4, 30 * s); // torso

  // gut loop drawing inside torso
  noFill();
  stroke('burlywood');
  strokeWeight(7 * s + 2);
  const g = regionXY('gut');
  beginShape();
  for (let a = 0; a <= TWO_PI * 1.5; a += 0.2) {
    curveVertex(g.x + cos(a) * (36 * s) * (1 - a / 14), g.y + sin(a) * 18 * s);
  }
  endShape();

  // connection lines (faint), vagus nerve highlighted
  for (const e of edges) {
    const a = regionXY(e[0]);
    const c = regionXY(e[1]);
    const isVagus = (e[0] === 'gut' && e[1] === 'dmv');
    stroke(isVagus ? 'teal' : 'gainsboro');
    strokeWeight(isVagus ? 3 : 2);
    if (isVagus) {
      drawVagus(a, c);
    } else {
      line(a.x, a.y, c.x, c.y);
    }
  }

  // spread in progress along the paths actually used
  for (const k in parent) {
    const pa = parent[k];
    const from = regionXY(pa.from);
    const to = regionXY(k);
    const startT = arrival[pa.from];
    const frac = constrain((t - startT) / pa.delay, 0, 1);
    if (frac > 0) {
      stroke('crimson');
      strokeWeight(4);
      if (pa.from === 'gut' && k === 'dmv' || pa.from === 'dmv' && k === 'gut') {
        drawVagus(from, to, frac);
      } else {
        line(from.x, from.y, lerp(from.x, to.x, frac), lerp(from.y, to.y, frac));
      }
    }
  }

  // cut mark
  if (vagusCheckbox.checked()) {
    const a = regionXY('gut');
    const c = regionXY('dmv');
    const my = lerp(c.y, a.y, 0.55);
    stroke('black');
    strokeWeight(3);
    line(b.cx - 26 * s - 8, my - 8, b.cx - 26 * s + 8, my + 8);
    line(b.cx - 26 * s - 8, my + 8, b.cx - 26 * s + 8, my - 8);
  }

  // regions and labels
  for (const k in regions) {
    const p = regionXY(k);
    const lv = level(k);
    stroke('dimgray');
    strokeWeight(1);
    fill(lerpColor(color('lightgray'), color('crimson'), lv));
    circle(p.x, p.y, k === 'gut' ? 22 : 16);

    // label with leader line
    const r = regions[k];
    noStroke();
    fill('black');
    textSize(14);
    const lx = r.side === 'left' ? b.cx - headR * 1.15 - 6 : b.cx + headR * 1.15 + 6;
    if (r.side === 'left') {
      textAlign(RIGHT, CENTER);
      text(r.name, lx, p.y);
    } else {
      textAlign(LEFT, CENTER);
      text(r.name, k === 'gut' ? b.cx + 76 * s : lx, p.y);
    }
    stroke('silver');
    strokeWeight(1);
    const lineEnd = k === 'gut' ? b.cx + 72 * s : (r.side === 'left' ? lx + 3 : lx - 3);
    line(p.x + (r.side === 'left' ? -9 : 9), p.y, lineEnd, p.y);
  }

  // vagus label
  noStroke();
  fill('teal');
  textSize(14);
  textAlign(RIGHT, CENTER);
  const vy = lerp(regionXY('dmv').y, regionXY('gut').y, 0.4);
  text('Vagus nerve', b.cx - 30 * s - 4, vy);
}

function drawVagus(a, c, frac) {
  // wavy nerve from the gut (a) up to the vagus nucleus (c), offset to the left
  const s = min(1, canvasWidth / 500);
  const f = frac === undefined ? 1 : frac;
  const fromGut = a.y > c.y;
  const lo = fromGut ? a : c;  // gut end
  const hi = fromGut ? c : a;  // brainstem end
  noFill();
  beginShape();
  const n = 30;
  for (let i = 0; i <= n * f; i++) {
    // fill from the end the spread starts at
    const u = fromGut ? i / n : 1 - i / n;
    const yy = lerp(lo.y, hi.y, u);
    const xx = lerp(lo.x - 26 * s, hi.x - 10 * s, u) + sin(u * 12) * 4;
    vertex(xx, yy);
  }
  endShape();
}

function drawTimeline() {
  const top = 330;
  const labelW = min(150, canvasWidth * 0.36);
  const x0 = margin + labelW;
  const x1 = canvasWidth - margin - 6;
  const rowH = 30;
  const h = rowH * symptoms.length + 34;

  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(margin - 4, top - 6, canvasWidth - 2 * margin + 8, h + 14, 8);

  // axis
  const yAxis = top + rowH * symptoms.length + 4;
  stroke('gray');
  line(x0, yAxis, x1, yAxis);
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(CENTER, TOP);
  for (let yr = 0; yr <= MAX_YEARS; yr += 5) {
    const x = map(yr, 0, MAX_YEARS, x0, x1);
    stroke('gray');
    line(x, yAxis, x, yAxis + 4);
    noStroke();
    text(yr, x, yAxis + 5);
  }
  textAlign(RIGHT, TOP);
  text('model years', x1, yAxis + 20 > top + h ? yAxis + 5 : yAxis + 20);

  // rows
  for (let i = 0; i < symptoms.length; i++) {
    const sym = symptoms[i];
    const y = top + i * rowH + rowH / 2;
    noStroke();
    fill('black');
    textAlign(RIGHT, CENTER);
    textSize(14);
    let lab = sym.label;
    if (textWidth(lab) > labelW - 8) lab = lab.replace(' (diagnosis)', '');
    text(lab, x0 - 8, y);
    stroke('whitesmoke');
    strokeWeight(1);
    line(x0, y, x1, y);
    const on = symptomOnset(sym.region);
    if (on < MAX_YEARS && t >= on) {
      noStroke();
      fill(sym.color);
      const xa = map(on, 0, MAX_YEARS, x0, x1);
      const xb = map(min(t, MAX_YEARS), 0, MAX_YEARS, x0, x1);
      rect(xa, y - 8, max(3, xb - xa), 16, 4);
    }
  }

  // diagnosis line
  const dx = symptomOnset('sn');
  if (dx < MAX_YEARS && t >= dx) {
    const x = map(dx, 0, MAX_YEARS, x0, x1);
    stroke('crimson');
    strokeWeight(1.5);
    drawingContext.setLineDash([5, 4]);
    line(x, top - 2, x, yAxis);
    drawingContext.setLineDash([]);
  }

  // now line
  const xn = map(t, 0, MAX_YEARS, x0, x1);
  stroke('black');
  strokeWeight(1);
  line(xn, top - 2, xn, yAxis);
}

function drawStatus() {
  const y = 518;
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text(statusText(), margin, y, canvasWidth - 2 * margin, 40);
}

function statusText() {
  const yr = 'Year ' + nf(t, 1, 1) + ': ';
  const gutRoute = routeSelect.value() === ROUTE_GUT;
  const cut = vagusCheckbox.checked();
  const dx = symptomOnset('sn');
  const cons = symptomOnset('gut');
  if (t === 0 && !isRunning) {
    return 'Paused. Illustrative years only; this is not a forecast for any person.';
  }
  if (gutRoute && cut) {
    return yr + 'with the vagus cut, the spread stays in the gut, as in the 2019 mouse study.';
  }
  if (dx < Infinity && t >= dx) {
    if (cons < dx) {
      return yr + 'constipation began ' + nf(dx - cons, 1, 1) + ' model years before movement symptoms.';
    }
    if (cons === Infinity || t < cons) {
      return yr + 'movement symptoms came first; no gut symptoms yet in this route.';
    }
    return yr + 'constipation came ' + nf(cons - dx, 1, 1) + ' model years after movement symptoms.';
  }
  return yr + 'pathology is spreading; no movement symptoms yet.';
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Speed: ' + nf(speedSlider.value(), 1, 1) + ' yr/s', 10, drawHeight + 88);
}

// ---------- controls ----------
function toggleSimulation() {
  if (t >= MAX_YEARS) t = 0;
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function restartTime() {
  computeArrivals();
  t = 0;
}

function resetSimulation() {
  isRunning = false;
  startButton.html('Start');
  routeSelect.selected(ROUTE_GUT);
  vagusCheckbox.checked(false);
  speedSlider.value(2);
  restartTime();
}

// ---------- responsive ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);
  sizeRouteSelect();
  redraw();
}

// phone: keep the start-point dropdown inside the canvas (desktop keeps its natural width)
function sizeRouteSelect() {
  if (canvasWidth < 500) routeSelect.size(canvasWidth - 136 - 10);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
