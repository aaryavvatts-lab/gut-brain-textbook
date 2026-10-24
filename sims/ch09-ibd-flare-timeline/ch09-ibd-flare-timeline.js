// IBD Flare Timeline MicroSim
// Chapter 9 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 640 (drawHeight 510 + controlHeight 130); iframe height 642px
// Learning objective (Analyze): relate gut inflammation, symptoms, energy, and
// mood over 12 months, and analyze how treatment events (steroids, a biologic,
// missed doses) and other events (a gut infection, a stressful exam week)
// change each curve differently.
// This is an ILLUSTRATIVE teaching model, not a prediction for any real person.
// All values are on a 0 to 100 scale in arbitrary units.

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 510;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 120;
let defaultTextSize = 16;

// ---------- controls ----------
let startButton, resetButton, clearButton, addButton, eventSelect, monthSlider;
let isRunning = false; // starts paused

// ---------- model ----------
const DAYS = 365;
const DAYS_PER_MONTH = DAYS / 12;
const EV_STEROID = 'Start steroids';
const EV_BIO = 'Start biologic';
const EV_MISS = 'Missed biologic doses';
const EV_INF = 'Gut infection';
const EV_STRESS = 'Stressful exam week';
const EV_CODES = {};
EV_CODES[EV_STEROID] = { code: 'S', color: 'darkorange' };
EV_CODES[EV_BIO] = { code: 'B', color: 'seagreen' };
EV_CODES[EV_MISS] = { code: 'M', color: 'crimson' };
EV_CODES[EV_INF] = { code: 'I', color: 'saddlebrown' };
EV_CODES[EV_STRESS] = { code: 'X', color: 'purple' };

let events = [];          // {type, day}
let curves = null;        // {infl:[], symp:[], energy:[], mood:[]}
let playDay = 0;          // playhead position in days
let message = '';

const SERIES = [
  { key: 'infl', name: 'Gut inflammation', color: 'firebrick' },
  { key: 'symp', name: 'Symptoms', color: 'darkorange' },
  { key: 'energy', name: 'Energy', color: 'royalblue' },
  { key: 'mood', name: 'Mood', color: 'mediumpurple' }
];

function defaultEvents() {
  return [
    { type: EV_STEROID, day: Math.round(0.25 * DAYS_PER_MONTH) },
    { type: EV_BIO, day: Math.round(1.0 * DAYS_PER_MONTH) }
  ];
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: Start/Pause, Reset, Clear events
  startButton = createButton('Start');
  startButton.position(10, drawHeight + 8);
  startButton.mousePressed(toggleSimulation);

  resetButton = createButton('Reset');
  resetButton.position(75, drawHeight + 8);
  resetButton.mousePressed(resetSimulation);

  clearButton = createButton('Clear events');
  clearButton.position(145, drawHeight + 8);
  clearButton.mousePressed(clearEvents);

  // Row 2: event type + Add
  eventSelect = createSelect();
  [EV_STEROID, EV_BIO, EV_MISS, EV_INF, EV_STRESS].forEach(e => eventSelect.option(e));
  eventSelect.selected(EV_MISS);
  eventSelect.position(70, drawHeight + 46);

  addButton = createButton('Add event');
  addButton.position(270, drawHeight + 46);
  addButton.mousePressed(addEvent);

  // Row 3: month slider
  monthSlider = createSlider(0, 12, 6, 0.5);
  monthSlider.position(sliderLeftMargin, drawHeight + 92);
  monthSlider.size(canvasWidth - sliderLeftMargin - margin);

  events = defaultEvents();
  recompute();
  message = 'Paused at month 0. Press Start to move through the year, or add an event.';

  describe('A 12-month line chart for a fictional teen with Crohn\'s disease. Four curves show gut ' +
    'inflammation, symptoms, energy, and mood. Markers show treatment events such as steroids and a ' +
    'biologic medicine, and other events such as missed doses, a gut infection, or a stressful exam week. ' +
    'Inflammation falls slowly after treatment starts, symptoms fall faster, and stress changes symptoms and mood.');
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
    playDay += 1.2;
    if (playDay >= DAYS - 1) {
      playDay = DAYS - 1;
      isRunning = false;
      startButton.html('Start');
    }
  }

  drawTitle();
  drawChart();
  drawReadout();
  drawControlLabels();
}

// ---------- the model ----------
function steroidEffect(d, start) {
  // fast onset (about 1 week), full effect to week 8, tapered off by week 12
  const t = d - start;
  if (t < 0) return 0;
  if (t < 7) return 0.7 * (t / 7);
  if (t < 56) return 0.7;
  if (t < 84) return 0.7 * (1 - (t - 56) / 28);
  return 0;
}

function recompute() {
  const infl = [], symp = [], energy = [], mood = [];
  let I = 75;    // starts with active disease at diagnosis
  let S = 70;
  let b = 0;     // biologic effect, 0 to 0.85
  const bioStart = minDay(EV_BIO);
  for (let d = 0; d < DAYS; d++) {
    // steroids: take the strongest active course
    let s = 0;
    events.filter(e => e.type === EV_STEROID).forEach(e => { s = max(s, steroidEffect(d, e.day)); });

    // biologic: builds over weeks; missed doses let the effect fade
    let bTarget = 0, tau = 18;
    if (bioStart !== null && d >= bioStart) {
      bTarget = 0.85;
      const missing = events.some(e => e.type === EV_MISS && e.day >= bioStart && d >= e.day && d < e.day + 45);
      if (missing) { bTarget = 0.15; tau = 12; }
    }
    b += (bTarget - b) / tau;

    // inflammation relaxes toward a target set by untreated disease drive and treatment
    const suppression = 1 - (1 - s) * (1 - b);
    let target = 75 * (1 - suppression);
    let infBump = 0, symBumpInf = 0, stress = 0;
    events.forEach(e => {
      const t = d - e.day;
      if (e.type === EV_INF && t >= 0) {
        infBump += 22 * exp(-t / 12);
        symBumpInf += 22 * exp(-t / 8);
      }
      if (e.type === EV_STRESS && t >= 0 && t < 14) stress = 1;
      if (e.type === EV_STRESS && t >= 14 && t < 24) stress = max(stress, 1 - (t - 14) / 10);
    });
    target = min(100, target + infBump);
    I += (target - I) / 20; // slow: inflammation heals over weeks to months

    // symptoms follow inflammation faster; steroids blunt symptoms quickly;
    // stress raises symptoms (gut sensitivity) without changing inflammation in this model
    const sTarget = 0.9 * I * (1 - 0.35 * s) + symBumpInf + 14 * stress;
    S += (sTarget - S) / 5;

    const E = 100 - 0.55 * S - 0.25 * I;
    const M = 82 - 0.4 * S - 20 * stress;
    infl.push(constrain(I, 0, 100));
    symp.push(constrain(S, 0, 100));
    energy.push(constrain(E, 0, 100));
    mood.push(constrain(M, 0, 100));
  }
  curves = { infl, symp, energy, mood };
}

function minDay(type) {
  const ds = events.filter(e => e.type === type).map(e => e.day);
  return ds.length ? Math.min(...ds) : null;
}

// ---------- controls ----------
function addEvent() {
  if (events.length >= 8) {
    message = 'That is plenty of events for one year. Press Clear events to start over.';
    return;
  }
  const type = eventSelect.value();
  const day = Math.min(DAYS - 1, Math.round(monthSlider.value() * DAYS_PER_MONTH));
  events.push({ type, day });
  recompute();
  if (type === EV_MISS && (minDay(EV_BIO) === null || day < minDay(EV_BIO))) {
    message = 'Missed doses only matter after a biologic has started. Add a biologic earlier in the year.';
  } else {
    message = 'Added "' + type + '" at month ' + monthSlider.value() + '. Compare how each curve responds.';
  }
}

function clearEvents() {
  events = [];
  recompute();
  message = 'No treatment: inflammation stays high all year. Try adding a biologic.';
}

function resetSimulation() {
  events = defaultEvents();
  recompute();
  playDay = 0;
  isRunning = false;
  startButton.html('Start');
  eventSelect.selected(EV_MISS);
  monthSlider.value(6);
  message = 'Reset to the starting plan: steroids, then a biologic. Press Start.';
}

function toggleSimulation() {
  if (!isRunning && playDay >= DAYS - 1) playDay = 0;
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

// ---------- drawing ----------
function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  let ts = 24;
  const title = 'IBD Flare Timeline';
  textSize(ts);
  while (textWidth(title) > canvasWidth - 2 * margin && ts > 16) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 8);

  textSize(14);
  fill('dimgray');
  text('Add events, then press Start. Illustrative model, not a prediction.',
    margin, 36, canvasWidth - 2 * margin, 40);
}

function chartBox() {
  const top = canvasWidth < 560 ? 100 : 80;
  return { left: 46, right: canvasWidth - 14, top: top, bottom: canvasWidth < 560 ? 300 : 320 };
}

function dayToX(d, box) { return map(d, 0, DAYS - 1, box.left, box.right); }
function valToY(v, box) { return map(v, 0, 100, box.bottom, box.top); }

function drawChart() {
  const box = chartBox();
  // plot background
  stroke(210);
  fill('white');
  rect(box.left, box.top, box.right - box.left, box.bottom - box.top);

  // remission zone (low inflammation)
  noStroke();
  fill(220, 245, 220);
  rect(box.left, valToY(15, box), box.right - box.left, box.bottom - valToY(15, box));
  fill('darkgreen');
  textSize(14);
  textAlign(RIGHT, BOTTOM);
  text('healing zone', box.right - 4, box.bottom - 2);

  // grid and axes
  stroke(225);
  for (let v = 25; v <= 100; v += 25) line(box.left, valToY(v, box), box.right, valToY(v, box));
  noStroke();
  fill('dimgray');
  textAlign(RIGHT, CENTER);
  textSize(14);
  for (let v = 0; v <= 100; v += 50) text(v, box.left - 4, valToY(v, box));
  textAlign(CENTER, TOP);
  const step = canvasWidth < 560 ? 3 : 1;
  for (let m = 0; m <= 12; m += step) text(m, dayToX(min(m * DAYS_PER_MONTH, DAYS - 1), box), box.bottom + 3);
  text('Month', (box.left + box.right) / 2, box.bottom + 19);

  // event markers
  events.forEach(e => {
    const x = dayToX(e.day, box);
    const info = EV_CODES[e.type];
    stroke(info.color);
    strokeWeight(1);
    drawingContext.setLineDash([4, 4]);
    line(x, box.top, x, box.bottom);
    drawingContext.setLineDash([]);
    noStroke();
    fill(info.color);
    circle(x, box.top - 9, 16);
    fill('white');
    textSize(14);
    textAlign(CENTER, CENTER);
    text(info.code, x, box.top - 9);
  });

  // curves
  noFill();
  strokeWeight(2.5);
  SERIES.forEach(s => {
    stroke(s.color);
    beginShape();
    for (let d = 0; d < DAYS; d += 2) vertex(dayToX(d, box), valToY(curves[s.key][d], box));
    endShape();
  });

  // playhead
  const px = dayToX(playDay, box);
  stroke('black');
  strokeWeight(1.5);
  line(px, box.top, px, box.bottom);
  strokeWeight(1);

  // legend
  noStroke();
  textSize(14);
  textAlign(LEFT, CENTER);
  const ly = box.bottom + 42;
  const colW = (canvasWidth - 2 * margin) / 2;
  SERIES.forEach((s, i) => {
    const lx = margin + (i % 2) * colW;
    const yy = ly + Math.floor(i / 2) * 20;
    fill(s.color);
    rect(lx, yy - 4, 16, 8);
    fill('black');
    text(s.name, lx + 22, yy);
  });
  fill('dimgray');
  textAlign(LEFT, TOP);
  text('S steroids, B biologic, M missed doses, I infection, X exam stress',
    margin, ly + 34, canvasWidth - 2 * margin, 40);
}

function contextNote(d) {
  const recent = events.filter(e => d >= e.day && d - e.day < 50).sort((a, b) => b.day - a.day);
  if (recent.length === 0) {
    if (curves.infl[floor(d)] > 50) return 'Inflammation is high, so symptoms are high and energy and mood are low.';
    if (curves.infl[floor(d)] < 15) return 'In the healing zone: the gut lining has time to heal. Treatment continues.';
    return 'Inflammation is changing slowly. In this model, symptoms roughly follow it.';
  }
  const t = recent[0].type;
  if (t === EV_STEROID) return 'Steroids calm symptoms within days, but they are a short-term bridge, not a long-term plan.';
  if (t === EV_BIO) return 'The biologic builds up over weeks. Inflammation falls more slowly than symptoms.';
  if (t === EV_MISS) return 'Missed doses: the medicine fades, and inflammation creeps back weeks later.';
  if (t === EV_INF) return 'A gut infection raises symptoms and inflammation for a few weeks.';
  return 'Exam stress raises symptoms and lowers mood here, but this model does not let it change inflammation.';
}

function drawReadout() {
  const d = floor(playDay);
  const px = margin;
  const narrow = canvasWidth < 560;
  const py = narrow ? drawHeight - 96 : drawHeight - 66;
  const pw = canvasWidth - 2 * margin;
  const ph = narrow ? 90 : 58;
  stroke(200);
  fill(255, 255, 255, 235);
  rect(px, py, pw, ph, 8);
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  const m = nf(d / DAYS_PER_MONTH, 1, 1);
  const line1 = 'Month ' + m + ':  inflammation ' + round(curves.infl[d]) + ', symptoms ' +
    round(curves.symp[d]) + ', energy ' + round(curves.energy[d]) + ', mood ' + round(curves.mood[d]);
  const note = (isRunning || playDay > 0) ? contextNote(d) : message;
  text(line1 + '\n' + note, px + 8, py + 4, pw - 16, ph - 6);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Event:', 10, drawHeight + 57);
  text('Month: ' + monthSlider.value(), 10, drawHeight + 102);
}

// ---------- responsive ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  monthSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
