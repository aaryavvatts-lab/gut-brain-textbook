// Vagus Signal Router MicroSim
// Chapter 2 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 660 (drawHeight 540 + controlHeight 120); iframe height 662px
// Learning objective (Analyze): compare afferent (gut-to-brain) and efferent
// (brain-to-gut) vagus signaling for four everyday events, and contrast the
// vagus route with the spinal route.
// Teaching cartoon: pulse speeds, counts, and timings are illustrative, not
// measured. The 8-of-10 fiber bundle reflects classic fiber counts in animals
// (about 80% sensory), which are approximate.

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 540;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

// ---------- controls ----------
let startButton, resetButton, cutCheckbox;
let mealButton, fatButton, inflamButton, stressButton;
let isRunning = false; // starts paused

// ---------- model state ----------
let pulses = [];        // moving signals
let pending = [];       // scheduled pulses {t, ...}
let simTime = 0;
let upCount = 0;        // afferent pulses that reached the brainstem or spinal cord
let downCount = 0;      // efferent pulses that reached the gut
let lastEvent = 'none';
let gutNote = '';       // what the gut is doing
let brainNote = '';     // what the brain registers
let flash = {};         // short highlights: nts, dmv, eec, gut, brain, spinal
let geo = {};           // geometry of the diagram, recomputed each frame

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  startButton = createButton('Start');
  startButton.mousePressed(toggleSimulation);
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetSimulation);
  cutCheckbox = createCheckbox(' Cut the vagus (vagotomy)', false);

  mealButton = createButton('Meal stretches stomach');
  mealButton.mousePressed(() => triggerEvent('meal'));
  fatButton = createButton('Fat arrives (CCK)');
  fatButton.mousePressed(() => triggerEvent('fat'));
  inflamButton = createButton('Gut inflammation');
  inflamButton.mousePressed(() => triggerEvent('inflam'));
  stressButton = createButton('Stressful thought');
  stressButton.mousePressed(() => triggerEvent('stress'));
  positionControls();

  describe('A stylized body with the brain and brainstem at the top, the gut at the bottom, and the vagus nerve ' +
    'running between them, plus a separate spinal route. Buttons trigger a meal, fat arriving, gut inflammation, ' +
    'or a stressful thought. Teal pulses travel up the nerve (afferent, gut to brain) and coral pulses travel down ' +
    '(efferent, brain to gut). A fiber bundle shows that about 8 of 10 vagus fibers are sensory.');
}

function positionControls() {
  const y1 = drawHeight + 8;
  startButton.position(10, y1);
  resetButton.position(72, y1);
  cutCheckbox.style('white-space', 'nowrap');
  if (canvasWidth < 500) {
    // phone: checkbox gets its own row so its label cannot wrap onto the buttons
    cutCheckbox.position(10, y1 + 36);
    mealButton.position(10, drawHeight + 80);
    fatButton.position(190, drawHeight + 80);
    inflamButton.position(10, drawHeight + 116);
    stressButton.position(160, drawHeight + 116);
    return;
  }
  cutCheckbox.position(140, y1 + 2);
  if (canvasWidth >= 640) {
    const y2 = drawHeight + 50;
    mealButton.position(10, y2);
    fatButton.position(190, y2);
    inflamButton.position(330, y2);
    stressButton.position(470, y2);
  } else {
    mealButton.position(10, drawHeight + 44);
    fatButton.position(190, drawHeight + 44);
    inflamButton.position(10, drawHeight + 80);
    stressButton.position(160, drawHeight + 80);
  }
}

function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  computeGeometry();
  if (isRunning) stepModel(1 / 60);

  drawTitle();
  drawDiagram();
  drawPulses();
  drawInfoPanel();
}

// ---------- geometry ----------
function computeGeometry() {
  const wide = canvasWidth >= 640;
  const top = canvasWidth >= 640 ? 64 : 104;
  let dx, dw, dh;
  if (wide) {
    dx = margin;
    dw = canvasWidth * 0.56;
    dh = drawHeight - top - 12;
  } else {
    dx = margin;
    dw = canvasWidth - 2 * margin;
    dh = 236;
  }
  geo.wide = wide;
  geo.dx = dx; geo.dy = top; geo.dw = dw; geo.dh = dh;
  const cx = dx + dw * 0.58;          // vagus nerve x
  geo.brain = { x: cx, y: top + dh * 0.10, w: min(dw * 0.5, 190), h: dh * 0.16 };
  geo.stem = { x: cx, y: top + dh * 0.27 };
  geo.nts = { x: cx - 16, y: geo.stem.y };
  geo.dmv = { x: cx + 16, y: geo.stem.y };
  geo.nodose = { x: cx, y: top + dh * 0.42 };
  geo.cutY = top + dh * 0.60;
  geo.gut = { x: cx, y: top + dh * 0.86 };
  geo.vTop = geo.stem.y + 14;
  geo.vBot = geo.gut.y - 22;
  geo.spineX = dx + dw * 0.14;         // spinal route x
  geo.spineTop = geo.stem.y + 26;
  geo.spineBot = geo.gut.y - 6;
}

// Position along a route. s goes 0 (gut end) to 1 (brain end).
function routePoint(route, dir, s) {
  const lane = dir === 'up' ? -5 : 5;
  if (route === 'vagus') {
    const y = lerp(geo.vBot, geo.vTop, s);
    return { x: geo.gut.x + lane, y: y };
  }
  // spinal route: gut -> left -> up the spinal cord -> right to brainstem
  const gx = geo.gut.x - 40, gy = geo.gut.y;
  const sx = geo.spineX + lane;
  const segA = abs(gx - sx);
  const segB = geo.spineBot - geo.spineTop;
  const segC = abs(geo.stem.x - 30 - sx);
  const L = segA + segB + segC;
  let d = s * L;
  if (d < segA) return { x: lerp(gx, sx, d / segA), y: gy + lane };
  d -= segA;
  if (d < segB) return { x: sx, y: lerp(geo.spineBot, geo.spineTop, d / segB) };
  d -= segB;
  return { x: lerp(sx, geo.stem.x - 30, d / segC), y: geo.spineTop + lane };
}

// ---------- model ----------
function schedule(delay, route, dir, kind) {
  pending.push({ t: simTime + delay, route: route, dir: dir, kind: kind });
}

function triggerEvent(ev) {
  lastEvent = ev;
  if (!isRunning) toggleSimulation();
  if (ev === 'meal') {
    for (let i = 0; i < 4; i++) schedule(i * 0.35, 'vagus', 'up', 'stretch');
    flash.gut = 1.5;
    gutNote = 'Stretch sensors in the stomach wall fire.';
    brainNote = '';
  } else if (ev === 'fat') {
    flash.eec = 2.0;
    for (let i = 0; i < 4; i++) schedule(0.5 + i * 0.35, 'vagus', 'up', 'cck');
    gutNote = 'Enteroendocrine cells release CCK, which excites vagal sensory endings.';
    brainNote = '';
  } else if (ev === 'inflam') {
    flash.gut = 2.0;
    for (let i = 0; i < 3; i++) schedule(i * 0.4, 'vagus', 'up', 'inflam');
    for (let i = 0; i < 3; i++) schedule(0.2 + i * 0.4, 'spinal', 'up', 'inflam');
    gutNote = 'Inflammatory chemicals switch on vagal and spinal sensory endings.';
    brainNote = '';
  } else if (ev === 'stress') {
    flash.brain = 2.0;
    for (let i = 0; i < 3; i++) schedule(0.6 + i * 0.4, 'spinal', 'down', 'stress');
    flash.dmvQuiet = 3.5;
    gutNote = '';
    brainNote = 'A worry starts in the brain, not the gut.';
  }
}

function stepModel(dt) {
  simTime += dt;
  for (const k in flash) flash[k] = max(0, flash[k] - dt);

  // release scheduled pulses
  for (let i = pending.length - 1; i >= 0; i--) {
    if (pending[i].t <= simTime) {
      const p = pending[i];
      pulses.push({ route: p.route, dir: p.dir, kind: p.kind, s: p.dir === 'up' ? 0 : 1, done: false });
      pending.splice(i, 1);
    }
  }

  const cut = cutCheckbox.checked();
  const cutS = (geo.cutY - geo.vBot) / (geo.vTop - geo.vBot); // s value of the cut point
  for (const p of pulses) {
    const speed = p.route === 'vagus' ? 0.42 : 0.30; // route fractions per second (illustrative)
    if (p.dir === 'up') {
      const next = p.s + speed * dt;
      if (cut && p.route === 'vagus' && p.s < cutS && next >= cutS) {
        p.done = true; p.blocked = true;
        flash.cut = 1.0;
        brainNote = 'The vagus is cut: this signal never reaches the brainstem.';
        continue;
      }
      p.s = next;
      if (p.s >= 1) { p.done = true; arriveUp(p); }
    } else {
      const next = p.s - speed * dt;
      if (cut && p.route === 'vagus' && p.s > cutS && next <= cutS) {
        p.done = true; p.blocked = true;
        flash.cut = 1.0;
        gutNote = 'The vagus is cut: the command never reaches the stomach.';
        continue;
      }
      p.s = next;
      if (p.s <= 0) { p.done = true; arriveDown(p); }
    }
  }
  pulses = pulses.filter(p => !p.done);
}

function arriveUp(p) {
  upCount++;
  flash.nts = 0.8;
  if (p.route === 'spinal') flash.spinal = 0.8;
  if (p.kind === 'stretch') {
    brainNote = 'NTS registers stretch. Fullness begins. DMV sends a "relax" command back down.';
    if (!p.reflexSent) schedule(0.5, 'vagus', 'down', 'relax');
  } else if (p.kind === 'cck') {
    brainNote = 'Satiety signal: the brain registers "I am getting full."';
    if (random() < 0.5) schedule(0.5, 'vagus', 'down', 'slow');
  } else if (p.kind === 'inflam') {
    brainNote = p.route === 'spinal'
      ? 'Spinal route: discomfort and pain signals reach the brain.'
      : 'Vagal route: the brainstem registers trouble. Nausea and feeling unwell can follow.';
    if (p.route === 'vagus' && random() < 0.5) schedule(0.5, 'vagus', 'down', 'calm');
  }
}

function arriveDown(p) {
  downCount++;
  flash.gut = 0.8;
  if (p.kind === 'relax') gutNote = 'Efferent command: the upper stomach relaxes to make room for the meal.';
  else if (p.kind === 'slow') gutNote = 'Efferent command: the stomach empties more slowly.';
  else if (p.kind === 'calm') gutNote = 'Efferent signal: an anti-inflammatory reflex (studied mostly in animals).';
  else if (p.kind === 'stress') gutNote = 'Sympathetic (fight-or-flight) signals slow digestion. Vagal output dips.';
}

function resetSimulation() {
  pulses = [];
  pending = [];
  simTime = 0;
  upCount = 0;
  downCount = 0;
  lastEvent = 'none';
  gutNote = '';
  brainNote = '';
  flash = {};
  cutCheckbox.checked(false);
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
  const title = 'Vagus Signal Router';
  textSize(ts);
  while (textWidth(title) > canvasWidth - 2 * margin && ts > 16) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 6);
  fill('dimgray');
  textSize(15);
  textAlign(CENTER, TOP);
  const l1 = 'Press an event button and watch the signals.';
  const l2 = 'Teal = afferent (up to brain). Coral = efferent (down to gut).';
  if (textWidth(l1 + ' ' + l2) < canvasWidth - 2 * margin) {
    text(l1 + ' ' + l2, canvasWidth / 2, 36);
  } else {
    text(l1, canvasWidth / 2, 34);
    textSize(14);
    text(l2, margin, 54, canvasWidth - 2 * margin, 40);
  }
}

function drawDiagram() {
  const g = geo;
  // brain
  noStroke();
  fill(flash.brain > 0 ? 'plum' : 'thistle');
  ellipse(g.brain.x, g.brain.y, g.brain.w, g.brain.h);
  fill('black');
  textSize(15);
  textAlign(CENTER, CENTER);
  text('Brain', g.brain.x, g.brain.y);

  // brainstem
  fill('lightsteelblue');
  rect(g.stem.x - 42, g.brain.y + g.brain.h / 2 - 4, 84, g.stem.y - g.brain.y - g.brain.h / 2 + 22, 10);
  // NTS and DMV
  stroke('white');
  strokeWeight(2);
  fill(flash.nts > 0 ? 'turquoise' : 'teal');
  circle(g.nts.x, g.nts.y, 24);
  const dmvActive = flash.dmvQuiet > 0 ? 'mistyrose' : 'coral';
  fill(dmvActive);
  circle(g.dmv.x, g.dmv.y, 24);
  noStroke();
  fill('white');
  textSize(14);
  textAlign(CENTER, CENTER);
  // labels beside the brainstem
  fill('black');
  textAlign(RIGHT, CENTER);
  text('NTS', g.nts.x - 18, g.nts.y);
  textAlign(LEFT, CENTER);
  text('DMV', g.dmv.x + 18, g.dmv.y);
  textAlign(LEFT, CENTER);
  fill('dimgray');
  text('Brainstem', g.stem.x + 46, g.stem.y - 22);

  // spinal route
  const spinalLit = flash.spinal > 0 || pulses.some(p => p.route === 'spinal');
  stroke(spinalLit ? 'darkorange' : 'silver');
  strokeWeight(spinalLit ? 4 : 3);
  noFill();
  beginShape();
  vertex(g.gut.x - 40, g.gut.y);
  vertex(g.spineX, g.gut.y);
  vertex(g.spineX, g.spineTop);
  vertex(g.stem.x - 30, g.spineTop);
  endShape();
  // spinal cord block
  noStroke();
  fill(spinalLit ? 'navajowhite' : 'gainsboro');
  rect(g.spineX - 9, g.spineTop + 30, 18, g.spineBot - g.spineTop - 70, 6);
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, CENTER);
  push();
  translate(g.spineX + 22, (g.spineTop + g.spineBot) / 2 + 10);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Spinal nerves', 0, 0);
  pop();

  // vagus nerve
  stroke('cadetblue');
  strokeWeight(14);
  line(g.gut.x, g.vTop, g.gut.x, g.vBot);
  stroke('lightcyan');
  strokeWeight(2);
  line(g.gut.x - 5, g.vTop, g.gut.x - 5, g.vBot);
  line(g.gut.x + 5, g.vTop, g.gut.x + 5, g.vBot);
  // nodose ganglion
  noStroke();
  fill('cadetblue');
  ellipse(g.nodose.x, g.nodose.y, 30, 40);
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Nodose ganglion', g.nodose.x + 20, g.nodose.y);
  text('Vagus nerve', g.gut.x + 14, (g.nodose.y + g.vBot) / 2 + 18);

  // cut
  if (cutCheckbox.checked()) {
    stroke(flash.cut > 0 ? 'red' : 'firebrick');
    strokeWeight(4);
    line(g.gut.x - 14, g.cutY - 10, g.gut.x + 14, g.cutY + 10);
    line(g.gut.x - 14, g.cutY + 10, g.gut.x + 14, g.cutY - 10);
    noStroke();
    fill('aliceblue');
    rect(g.gut.x - 9, g.cutY - 3, 18, 6);
    fill('firebrick');
    textAlign(LEFT, CENTER);
    text('cut', g.gut.x + 18, g.cutY);
  }

  // gut: stomach and intestine
  noStroke();
  fill(flash.gut > 0 ? 'lightpink' : 'mistyrose');
  stroke('sienna');
  strokeWeight(2);
  ellipse(g.gut.x, g.gut.y, min(g.dw * 0.42, 150), 52);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(15);
  text('Gut', g.gut.x, g.gut.y + 2);
  // enteroendocrine cell
  fill(flash.eec > 0 ? 'gold' : 'goldenrod');
  circle(g.gut.x + min(g.dw * 0.42, 150) / 2 - 14, g.gut.y - 8, flash.eec > 0 ? 14 : 10);
  if (flash.eec > 0) {
    fill('darkgoldenrod');
    textSize(14);
    textAlign(LEFT, CENTER);
    text('CCK', g.gut.x + min(g.dw * 0.42, 150) / 2 - 2, g.gut.y - 22);
  }
}

function drawPulses() {
  for (const p of pulses) {
    const pt = routePoint(p.route, p.dir, p.s);
    noStroke();
    fill(p.dir === 'up' ? 'darkcyan' : 'tomato');
    if (p.route === 'spinal') fill(p.dir === 'up' ? 'darkcyan' : 'darkorange');
    circle(pt.x, pt.y, 11);
  }
}

function drawInfoPanel() {
  let px, py, pw, ph;
  if (geo.wide) {
    px = geo.dx + geo.dw + 10;
    py = 74;
    pw = canvasWidth - px - margin;
    ph = drawHeight - py - 12;
  } else {
    px = margin;
    py = geo.dy + geo.dh + 6;
    pw = canvasWidth - 2 * margin;
    ph = drawHeight - py - 8;
  }
  stroke(200);
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(px, py, pw, ph, 10);

  // fiber bundle cross-section
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, TOP);
  const bundleLabel = 'Vagus fiber bundle (classic animal counts)';
  text(bundleLabel, px + 10, py + 8, pw - 20, 40);
  const bundleY = py + (textWidth(bundleLabel) > pw - 20 ? 64 : 46);
  const r = 9;
  const n = 10;
  const startX = px + 14;
  const gap = min(24, (pw - 28) / n);
  for (let i = 0; i < n; i++) {
    fill(i < 8 ? 'darkcyan' : 'tomato');
    circle(startX + r + i * gap, bundleY, r * 2 - 2);
  }
  fill('dimgray');
  textSize(14);
  const cap = geo.wide ? '8 of 10 sensory (afferent), 2 of 10 motor (efferent)' : '8 of 10 sensory (afferent), 2 of 10 motor (efferent)';
  text(cap, px + 10, bundleY + 14, pw - 20, 40);
  const capLines = textWidth(cap) > pw - 20 ? 2 : 1;

  // counters
  let y = bundleY + 22 + capLines * 18;
  textSize(15);
  if (geo.wide || textWidth('Signals up (afferent): 00    Signals down (efferent): 00') > pw - 20) {
    fill('darkcyan');
    text('Signals up (afferent): ' + upCount, px + 10, y);
    fill('tomato');
    text('Signals down (efferent): ' + downCount, px + 10, y + 20);
    y += 46;
  } else {
    fill('darkcyan');
    text('Signals up (afferent): ' + upCount, px + 10, y);
    fill('tomato');
    textAlign(RIGHT, TOP);
    text('Signals down (efferent): ' + downCount, px + pw - 10, y);
    textAlign(LEFT, TOP);
    y += 26;
  }

  // notes
  fill('black');
  textSize(14);
  const statusMsg = statusText();
  text(statusMsg, px + 10, y, pw - 20, py + ph - y - 6);
}

function statusText() {
  if (!isRunning && lastEvent === 'none') return 'Paused. Pick an event (or press Start) to see signals move.';
  if (!isRunning) return 'Paused. Press Start to continue.';
  let s = '';
  if (gutNote) s += 'Gut: ' + gutNote + '\n';
  if (brainNote) s += 'Brain: ' + brainNote;
  if (!s) s = 'Running. Press an event button.';
  return s;
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
  // phone: taller info panel and an extra control row (desktop unchanged)
  drawHeight = canvasWidth < 500 ? 610 : 540;
  controlHeight = canvasWidth < 500 ? 156 : 120;
  canvasHeight = drawHeight + controlHeight;
  containerHeight = canvasHeight;
}
