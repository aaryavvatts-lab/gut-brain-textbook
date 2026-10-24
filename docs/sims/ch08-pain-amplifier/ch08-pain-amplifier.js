// Pain Amplifier MicroSim
// Chapter 8 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 610 (drawHeight 440 + controlHeight 170); iframe height 612px
// Learning objective (Understand/Analyze): explain how peripheral sensitization,
// central sensitization (spinal gain), and descending modulation from the brain
// change the felt pain produced by the SAME gut stretch.
// This is a teaching cartoon. All numbers are illustrative (arbitrary units),
// not measurements, and the pain scale output is not a prediction for any person.

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 440;
let controlHeight = 170;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 215;
let defaultTextSize = 16;
let meterColumn = 92; // width of the pain meter column on the right

// ---------- controls ----------
let startButton, resetButton, typicalCheckbox;
let stretchSlider, periphSlider, centralSlider, descSlider;
let isRunning = false; // MicroSims always open paused

// ---------- model state ----------
let pulses = [];      // traveling signal dots: {seg, t}
let spawnTimer = 0;
let shownPain = 0;    // smoothed value for the meter needle
const THRESHOLD = 4;  // signal needed before anything is felt (illustrative)
const SCALE = 6;      // how quickly felt pain rises above threshold (illustrative)

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

  typicalCheckbox = createCheckbox(' Show typical body', true);
  typicalCheckbox.position(145, drawHeight + 10);

  stretchSlider = createSlider(0, 10, 6, 1);
  stretchSlider.position(sliderLeftMargin, drawHeight + 46);

  periphSlider = createSlider(1, 3, 1, 0.25);
  periphSlider.position(sliderLeftMargin, drawHeight + 76);

  centralSlider = createSlider(1, 3, 1, 0.25);
  centralSlider.position(sliderLeftMargin, drawHeight + 106);

  descSlider = createSlider(-2, 2, 0, 1);
  descSlider.position(sliderLeftMargin, drawHeight + 136);

  sizeSliders();

  describe('A pathway from a stretched gut to the brain. Signal dots travel from the gut to a ' +
    'dorsal root ganglion, into the dorsal horn of the spinal cord, up to the thalamus, and on to ' +
    'the insula and anterior cingulate cortex. A descending line from the brain turns the spinal ' +
    'signal down when calm or up when stressed. A meter on the right shows felt pain from 0 to 10 ' +
    'for the same gut stretch, with a marker for a typical body.');
}

// ---------- model ----------
function descFactor(d) {
  // -2 = very calm (strong turning down) ... +2 = very stressed (turning up)
  return 1 + 0.2 * d;
}

function painFrom(stretch, periph, central, desc) {
  const signal = stretch * periph * central * descFactor(desc);
  if (signal <= THRESHOLD) return 0;
  return 10 * (1 - Math.exp(-(signal - THRESHOLD) / SCALE));
}

function currentPain() {
  return painFrom(stretchSlider.value(), periphSlider.value(), centralSlider.value(), descSlider.value());
}

function typicalPain() {
  return painFrom(stretchSlider.value(), 1, 1, 0);
}

// signal level on each segment (for dot size and glow)
function segLevels() {
  const s = stretchSlider.value();
  const p = periphSlider.value();
  const c = centralSlider.value();
  const f = descFactor(descSlider.value());
  const nerve = s * p;            // gut -> ganglion -> dorsal horn
  const up = s * p * c * f;       // leaves the dorsal horn
  const passes = up > THRESHOLD;  // below threshold the brain does not register it as pain
  return [nerve, nerve, passes ? up : up * 0.4, passes ? up : 0];
}

function draw() {
  updateCanvasSize();

  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (isRunning) stepModel(1 / 60);
  shownPain = currentPain();

  drawTitle();
  const nodes = nodePositions();
  drawPathway(nodes);
  drawPulses(nodes);
  drawMeter();
  drawReadout();
  drawControlLabels();
}

function stepModel(dt) {
  const s = stretchSlider.value();
  spawnTimer -= dt;
  if (s > 0 && spawnTimer <= 0) {
    pulses.push({ seg: 0, t: 0 });
    spawnTimer = 0.55;
  }
  const lv = segLevels();
  for (const pu of pulses) {
    pu.t += dt * 0.9;
    if (pu.t >= 1) {
      pu.seg++;
      pu.t = 0;
      if (pu.seg < 4 && lv[pu.seg] <= 0) pu.seg = 99; // blocked: nothing goes on
    }
  }
  pulses = pulses.filter(pu => pu.seg < 4);
}

// ---------- geometry ----------
function nodePositions() {
  const W = canvasWidth - meterColumn;
  const top = canvasWidth < 560 ? 112 : 96;
  const bottom = 300;
  const cordX = W * 0.52;
  return {
    gut: { x: W * 0.13, y: bottom },
    drg: { x: W * 0.33, y: bottom },
    horn: { x: cordX, y: bottom },
    thal: { x: cordX, y: (top + bottom) / 2 + 12 },
    cortex: { x: cordX, y: top + 18 },
    descX: W * 0.80,
    W: W,
    top: top,
    bottom: bottom
  };
}

function segEnds(n, seg) {
  if (seg === 0) return [n.gut, n.drg];
  if (seg === 1) return [n.drg, n.horn];
  if (seg === 2) return [n.horn, n.thal];
  return [n.thal, n.cortex];
}

// ---------- drawing ----------
function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  let ts = 24;
  const title = 'Pain Amplifier';
  textSize(ts);
  while (textWidth(title) > canvasWidth - 2 * margin && ts > 16) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);

  textSize(15);
  fill('dimgray');
  text('Keep the gut stretch the same. Change the three dials and watch the felt pain.',
    margin, 38, canvasWidth - 2 * margin, 44);
}

function drawPathway(n) {
  const lv = segLevels();

  // spinal cord (gray column) and brain (pink oval)
  noStroke();
  fill('gainsboro');
  rect(n.horn.x - 22, n.thal.y + 22, 44, n.bottom - n.thal.y + 2, 10);
  fill('mistyrose');
  stroke('rosybrown');
  strokeWeight(1);
  ellipse(n.cortex.x + n.W * 0.08, n.cortex.y + 22, n.W * 0.78, 120);

  // descending control line (brain -> dorsal horn)
  const d = descSlider.value();
  const dColor = d < 0 ? 'seagreen' : (d > 0 ? 'crimson' : 'gray');
  stroke(dColor);
  strokeWeight(2 + abs(d) * 1.5);
  drawingContext.setLineDash([6, 5]);
  line(n.descX, n.cortex.y + 40, n.descX, n.horn.y);
  line(n.descX, n.horn.y, n.horn.x + 14, n.horn.y);
  drawingContext.setLineDash([]);
  noStroke();
  fill(dColor);
  triangle(n.horn.x + 14, n.horn.y, n.horn.x + 24, n.horn.y - 6, n.horn.x + 24, n.horn.y + 6);

  // descending label (rotated)
  push();
  translate(n.descX + 16, (n.cortex.y + 40 + n.horn.y) / 2);
  rotate(-HALF_PI);
  noStroke();
  fill(dColor);
  textSize(14);
  textAlign(CENTER, CENTER);
  const dText = d < 0 ? 'Descending: turning down' : (d > 0 ? 'Descending: turning up' : 'Descending: neutral');
  text(dText, 0, 0);
  pop();

  // ascending path lines, thickness grows with signal
  for (let seg = 0; seg < 4; seg++) {
    const [a, b] = segEnds(n, seg);
    stroke(lv[seg] > 0 ? 'darkorange' : 'lightgray');
    strokeWeight(constrain(2 + lv[seg] * 0.35, 2, 9));
    line(a.x, a.y, b.x, b.y);
  }

  // gut tube with balloon stretch
  const s = stretchSlider.value();
  noStroke();
  fill('peachpuff');
  rect(n.gut.x - 30, n.gut.y - 16 - s * 1.2, 60, 32 + s * 2.4, 14);
  fill('khaki');
  ellipse(n.gut.x, n.gut.y, 14 + s * 3, 12 + s * 2.6);

  // nodes
  drawNode(n.drg, lv[0]);
  drawNode(n.horn, lv[2]);
  drawNode(n.thal, lv[3]);
  drawNode(n.cortex, lv[3]);

  // labels
  noStroke();
  fill('black');
  textSize(14);
  textAlign(CENTER, TOP);
  text('Gut', n.gut.x, n.bottom + 34);
  text('Root\nganglion', n.drg.x, n.bottom + 34);
  text('Dorsal\nhorn', n.horn.x, n.bottom + 34);
  textAlign(RIGHT, CENTER);
  text('Thalamus', n.thal.x - 18, n.thal.y);
  text('Insula + ACC', n.cortex.x - 18, n.cortex.y);
}

function drawNode(p, level) {
  const glow = constrain(level / 12, 0, 1);
  stroke('dimgray');
  strokeWeight(1);
  fill(lerpColor(color('white'), color('orangered'), glow));
  circle(p.x, p.y, 22);
}

function drawPulses(n) {
  const lv = segLevels();
  noStroke();
  for (const pu of pulses) {
    const [a, b] = segEnds(n, pu.seg);
    const x = lerp(a.x, b.x, pu.t);
    const y = lerp(a.y, b.y, pu.t);
    const r = constrain(5 + lv[pu.seg] * 0.6, 5, 16);
    fill('orangered');
    circle(x, y, r);
  }
}

function drawMeter() {
  const x0 = canvasWidth - meterColumn + 18;
  const w = 30;
  const top = canvasWidth < 560 ? 120 : 104;
  const bottom = 312;
  const h = bottom - top;

  noStroke();
  fill('black');
  textSize(14);
  textAlign(CENTER, BOTTOM);
  text('Felt pain', x0 + w / 2 + 6, top - 12);

  stroke('gray');
  strokeWeight(1);
  fill('white');
  rect(x0, top, w, h);

  // gradient-ish fill
  const frac = shownPain / 10;
  noStroke();
  const c = lerpColor(color('gold'), color('crimson'), frac);
  fill(c);
  rect(x0 + 1, bottom - h * frac, w - 1, h * frac);

  // tick labels 0, 5, 10
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  for (const v of [0, 5, 10]) {
    const y = bottom - h * v / 10;
    stroke('gray');
    line(x0 + w, y, x0 + w + 4, y);
    noStroke();
    text(v, x0 + w + 6, y);
  }

  // typical-body marker
  if (typicalCheckbox.checked()) {
    const ty = bottom - h * typicalPain() / 10;
    stroke('navy');
    strokeWeight(3);
    line(x0 - 8, ty, x0 + w, ty);
    noStroke();
    fill('navy');
    triangle(x0 - 8, ty - 6, x0 - 8, ty + 6, x0 - 1, ty);
  }
}

function drawReadout() {
  const y = 386;
  noStroke();
  fill('white');
  stroke('silver');
  rect(margin / 2, y - 6, canvasWidth - margin, 50, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(15);
  const mine = currentPain();
  let line1 = 'Felt pain: ' + nf(mine, 1, 1) + ' / 10';
  if (typicalCheckbox.checked()) line1 += '   (typical body: ' + nf(typicalPain(), 1, 1) + ')';
  text(line1, margin, y);
  fill('dimgray');
  textSize(14);
  let msg;
  if (stretchSlider.value() === 0) msg = 'No stretch, so no signal.';
  else if (mine === 0) msg = 'Signal stays below the pain threshold: sensed, not painful.';
  else if (mine > typicalPain() + 0.5) msg = 'Same stretch, more pain: the system is turned up.';
  else if (mine < typicalPain() - 0.5) msg = 'Same stretch, less pain: the system is turned down.';
  else msg = 'Pain matches a typical body for this stretch.';
  text(msg, margin, y + 22, canvasWidth - 2 * margin, 24);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Gut stretch: ' + stretchSlider.value(), 10, drawHeight + 56);
  text('Peripheral sensitivity: ' + nf(periphSlider.value(), 1, 2) + 'x', 10, drawHeight + 86);
  text('Central gain: ' + nf(centralSlider.value(), 1, 2) + 'x', 10, drawHeight + 116);
  const d = descSlider.value();
  const names = { '-2': 'very calm', '-1': 'calm', '0': 'neutral', '1': 'stressed', '2': 'very stressed' };
  text('Brain state: ' + names[String(d)], 10, drawHeight + 146);
}

// ---------- controls ----------
function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function resetSimulation() {
  isRunning = false;
  startButton.html('Start');
  stretchSlider.value(6);
  periphSlider.value(1);
  centralSlider.value(1);
  descSlider.value(0);
  typicalCheckbox.checked(true);
  pulses = [];
  spawnTimer = 0;
}

function sizeSliders() {
  const w = max(80, canvasWidth - sliderLeftMargin - margin);
  for (const s of [stretchSlider, periphSlider, centralSlider, descSlider]) s.size(w);
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
