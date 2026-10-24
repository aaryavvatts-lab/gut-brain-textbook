// Fiber to Butyrate MicroSim
// Chapter 6 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 710 (drawHeight 570 + controlHeight 140); iframe height 712px
// Learning objective (Understand): trace dietary fiber through bacterial fermentation
// to short-chain fatty acids (acetate, propionate, butyrate) and their local effects
// on colon-lining cells, and separate human evidence from mouse-only findings.
// All levels are illustrative relative units, not measurements. Acetate is drawn as the
// most plentiful SCFA, as in human colon samples (Cummings 1987), but no fixed ratio is
// claimed. Butyrate is mostly used by colonocytes; propionate is mostly taken up by the
// liver (Cummings 1987). Mouse-only panel: Erny 2015 (microglia), Braniste 2014 (BBB).

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 570;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 210;
let defaultTextSize = 16;

// ---------- controls ----------
let startButton, resetButton, mouseCheckbox, fiberSlider, diversitySlider;
let isRunning = false; // MicroSims open paused

// ---------- model state ----------
const DIVERSITY_NAMES = ['very low', 'low', 'medium', 'high', 'very high'];
// Mouse-only comparison (illustrative, relative): bar = mice with normal microbes, black line = germ-free mice
const MOUSE_NORMAL = { microglia: 0.9, bbb: 0.9 };
const MOUSE_GERMFREE = { microglia: 0.35, bbb: 0.5 };
let particles = [];   // moving fiber strands and SCFA molecules
let spawnClock = 0;
let phase = 0;
// smoothed outputs (0 to 1)
let production = 0, fuel = 0, seal = 0, microglia = 0, bbb = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  startButton = createButton('Start');
  startButton.mousePressed(toggleSimulation);

  resetButton = createButton('Reset');
  resetButton.mousePressed(resetSimulation);

  mouseCheckbox = createCheckbox(' Show mouse-only panel', true);
  mouseCheckbox.style('white-space', 'nowrap');

  fiberSlider = createSlider(0, 40, 16, 1);

  diversitySlider = createSlider(1, 5, 3, 1);
  positionControls();

  // start the outputs at their steady state for the default settings
  const t = targets();
  production = t.production; fuel = t.fuel; seal = t.seal; microglia = t.microglia; bbb = t.bbb;
  prefill();

  describe('A colon drawn as a tube. Green fiber strands enter on the left, gut bacteria ferment them, ' +
    'and three short-chain fatty acids appear: acetate, propionate, and butyrate. Butyrate is taken up by ' +
    'the colon-lining cells, which glow brighter and seal their gaps more tightly. Meters show fermentation, ' +
    'colon-cell fuel, and tight junction seal. A separate, labeled mouse-only panel shows microglia maturity ' +
    'and blood-brain barrier tightness from germ-free mouse studies.');
}

function positionControls() {
  const narrow = canvasWidth < 500;
  const dy = narrow ? 32 : 0; // phone: checkbox gets its own row
  startButton.position(10, drawHeight + 8);
  resetButton.position(75, drawHeight + 8);
  mouseCheckbox.position(narrow ? 10 : 145, drawHeight + (narrow ? 42 : 10));
  fiberSlider.position(sliderLeftMargin, drawHeight + 48 + dy);
  fiberSlider.size(canvasWidth - sliderLeftMargin - margin);
  diversitySlider.position(sliderLeftMargin, drawHeight + 84 + dy);
  diversitySlider.size(canvasWidth - sliderLeftMargin - margin);
}

function draw() {
  updateCanvasSize();

  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // outputs ease toward the targets set by the sliders, only while running
  if (isRunning) {
    phase += 1 / 60;
    const t = targets();
    production = lerp(production, t.production, 0.02);
    fuel = lerp(fuel, t.fuel, 0.02);
    seal = lerp(seal, t.seal, 0.015);
    microglia = lerp(microglia, t.microglia, 0.01);
    bbb = lerp(bbb, t.bbb, 0.01);
    stepParticles();
  }

  drawTitle();
  drawColon();
  drawMeters();
  drawMousePanel();
  drawControlLabels();
}

// ---------- model ----------
// Fermentation depends on how much fiber reaches the colon and how many kinds of
// fiber-fermenting microbes are present (illustrative saturating curves).
function targets() {
  const g = fiberSlider.value();
  const d = diversitySlider.value();
  const capacity = 0.35 + 0.65 * (d - 1) / 4;          // more kinds of fermenters, more capacity
  const production = constrain((1 - exp(-g / 18)) * capacity / (1 - exp(-40 / 18)), 0, 1);
  const butyrateShare = 0.6 + 0.4 * (d - 1) / 4;        // butyrate makers are a subset of microbes
  const fuel = constrain(production * butyrateShare * 1.15, 0, 1);
  const seal = 0.45 + 0.5 * fuel;                       // other things also keep junctions sealed
  // mouse-only: germ-free mice (no microbes) vs mice with normal microbes.
  // These studies compared having microbes with having none; they did not vary fiber,
  // so the panel stays fixed and does not respond to the sliders.
  const microglia = MOUSE_NORMAL.microglia;
  const bbb = MOUSE_NORMAL.bbb;
  return { production, fuel, seal, microglia, bbb };
}

function stepParticles() {
  const g = fiberSlider.value();
  spawnClock += g / 40 * 0.9;
  while (spawnClock >= 1) {
    spawnClock -= 1;
    particles.push({ kind: 'fiber', x: 0, y: random(0.25, 0.75), v: random(0.0025, 0.004) });
  }
  const d = diversitySlider.value();
  const convertChance = 0.006 + 0.01 * (d - 1) / 4;
  for (const p of particles) {
    p.x += p.v;
    if (p.kind === 'fiber' && p.x > 0.18 && random() < convertChance) {
      // fermentation: one strand becomes a short-chain fatty acid
      const r = random();
      const butyrateShare = 0.18 + 0.12 * (d - 1) / 4;
      if (r < butyrateShare) p.kind = 'B';
      else if (r < butyrateShare + 0.22) p.kind = 'P';
      else p.kind = 'A'; // acetate is the most plentiful
    }
    // butyrate drifts down into the colon lining and is used as fuel
    if (p.kind === 'B') {
      p.y += 0.006;
      if (p.y > 0.98) p.dead = true;
    }
  }
  particles = particles.filter(p => !p.dead && p.x < 1.02);
  if (particles.length > 160) particles.splice(0, particles.length - 160);
}

// fill the colon with a snapshot of particles so the paused view is not empty
function prefill() {
  particles = [];
  spawnClock = 0;
  for (let i = 0; i < 400; i++) stepParticles();
}

function resetSimulation() {
  isRunning = false;
  startButton.html('Start');
  fiberSlider.value(16);
  diversitySlider.value(3);
  const t = targets();
  production = t.production; fuel = t.fuel; seal = t.seal; microglia = t.microglia; bbb = t.bbb;
  prefill();
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
  const title = 'Fiber to Butyrate';
  textSize(ts);
  while (textWidth(title) > canvasWidth - 2 * margin && ts > 16) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);

  textSize(15);
  fill('dimgray');
  text('Set fiber and microbe diversity, press Start, and follow the fiber into the colon wall.',
    margin, 38, canvasWidth - 2 * margin, 40);
}

function colonBox() {
  const top = canvasWidth < 560 ? 98 : 80;
  return { x: margin, y: top, w: canvasWidth - 2 * margin, h: 120 };
}

function drawColon() {
  const b = colonBox();
  // inside of the colon (lumen)
  stroke('sienna');
  strokeWeight(2);
  fill('lavenderblush');
  rect(b.x, b.y, b.w, b.h, 14);

  // bacteria: number of colors = diversity
  const d = diversitySlider.value();
  const palette = ['mediumpurple', 'teal', 'goldenrod', 'olivedrab', 'hotpink'];
  noStroke();
  randomSeed(7);
  const nBugs = 10 + d * 5;
  for (let i = 0; i < nBugs; i++) {
    const bx = b.x + 0.15 * b.w + random(0.83 * b.w);
    const by = b.y + 14 + random(b.h - 50);
    fill(palette[i % d]);
    ellipse(bx + 2 * sin(phase * 2 + i), by, 14, 7);
  }
  randomSeed(millis());

  // particles
  for (const p of particles) {
    const px = b.x + p.x * b.w;
    const py = b.y + 10 + p.y * (b.h - 44);
    if (px < b.x || px > b.x + b.w) continue;
    if (p.kind === 'fiber') {
      stroke('forestgreen');
      strokeWeight(3);
      noFill();
      bezier(px - 7, py, px - 3, py - 5, px + 3, py + 5, px + 7, py);
    } else {
      noStroke();
      fill(p.kind === 'A' ? 'steelblue' : p.kind === 'P' ? 'darkorange' : 'crimson');
      circle(px, py, 8);
    }
  }

  // colon-lining cells (colonocytes) along the bottom wall; brighter = more butyrate fuel
  const cellsY = b.y + b.h - 26;
  const nCells = max(6, floor(b.w / 46));
  const cw = b.w / nCells;
  const gap = map(seal, 0.45, 0.95, 7, 1, true); // looser seal, bigger gaps
  for (let i = 0; i < nCells; i++) {
    const cx = b.x + i * cw + gap / 2;
    stroke('sienna');
    strokeWeight(1);
    fill(lerpColor(color('wheat'), color('orange'), fuel));
    rect(cx, cellsY, cw - gap, 24, 4);
  }
  // tight junction marks between cells
  noStroke();
  fill('saddlebrown');
  for (let i = 1; i < nCells; i++) {
    rect(b.x + i * cw - 1.5, cellsY + 2, 3, map(seal, 0.45, 0.95, 4, 12, true));
  }

  // labels
  noStroke();
  textSize(14);
  fill('forestgreen');
  textAlign(LEFT, TOP);
  text('Fiber in', b.x + 6, b.y + 4);
  fill('black');
  textAlign(RIGHT, TOP);
  text('Colon (inside)', b.x + b.w - 6, b.y + 4);
  textAlign(LEFT, TOP);
  fill('saddlebrown');
  if (textWidth('Colon-lining cells (colonocytes) and tight junctions') > b.w) textSize(12);
  text('Colon-lining cells (colonocytes) and tight junctions', b.x, b.y + b.h + 4, b.w, 20);

  textSize(14);
  // legend
  const ly = b.y + b.h + 26;
  const items = [['Acetate', 'steelblue'], ['Propionate', 'darkorange'], ['Butyrate', 'crimson']];
  let lx = b.x;
  textSize(14);
  for (const [name, col] of items) {
    fill(col);
    circle(lx + 6, ly + 8, 10);
    fill('black');
    textAlign(LEFT, CENTER);
    text(name, lx + 15, ly + 8);
    lx += textWidth(name) + 34;
  }
}

function drawGermFreeMark(x, y, w, value) {
  stroke('black');
  strokeWeight(3);
  line(x + w * value, y + 17, x + w * value, y + 37);
  noStroke();
}

function drawMeter(x, y, w, label, value, col, note) {
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text(label, x, y, w, 20);
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y + 20, w, 14, 7);
  noStroke();
  fill(col);
  rect(x, y + 20, max(4, w * value), 14, 7);
  if (note) {
    fill('dimgray');
    textSize(14);
    text(note, x, y + 37, w, 20);
  }
}

function drawMeters() {
  const b = colonBox();
  const top = b.y + b.h + 50;
  const w = canvasWidth - 2 * margin;
  drawMeter(margin, top, w, 'Fermentation into SCFAs (relative)', production, 'mediumseagreen');
  drawMeter(margin, top + 42, w, 'Colonocyte fuel from butyrate (relative)', fuel, 'orange');
  drawMeter(margin, top + 84, w, 'Tight junction seal (relative)', seal, 'saddlebrown');

  // status line
  const g = fiberSlider.value();
  let msg;
  if (g === 0) msg = 'No fiber reaches the colon, so microbes have little to ferment and the lining gets little butyrate.';
  else if (production < 0.35) msg = 'Little fermentation: few SCFAs are made, so colon cells get less butyrate fuel.';
  else if (production < 0.7) msg = 'Moderate fermentation. Acetate is the most plentiful SCFA; butyrate mostly stays to fuel the lining.';
  else msg = 'Lots of fermentation. Butyrate is used by the lining; propionate mostly goes to the liver; acetate travels farthest.';
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text(msg, margin, top + 128, w, 54);
}

function drawMousePanel() {
  const b = colonBox();
  const top = b.y + b.h + 236;
  const h = drawHeight - top - 8;
  const w = canvasWidth - 2 * margin;
  if (!mouseCheckbox.checked()) {
    noStroke();
    fill('dimgray');
    textSize(14);
    textAlign(LEFT, TOP);
    text('Mouse-only panel hidden. These brain effects have not been shown in people.', margin, top + 8, w, 40);
    return;
  }
  // dashed border marks this as a different kind of evidence
  stroke('purple');
  strokeWeight(1.5);
  drawingContext.setLineDash([6, 4]);
  fill(248, 240, 255);
  rect(margin, top, w, h, 8);
  drawingContext.setLineDash([]);

  noStroke();
  fill('purple');
  textSize(14);
  textAlign(LEFT, TOP);
  const mouseHead = canvasWidth < 500 ? 'MOUSE STUDIES ONLY (not shown in humans)' : 'MOUSE STUDIES ONLY: germ-free mice, not shown in humans';
  if (textWidth(mouseHead) > w - 16) textSize(12);
  text(mouseHead, margin + 8, top + 6, w - 16, 20);
  textSize(14);

  const half = (w - 24) / 2;
  const narrow = canvasWidth < 500;
  if (narrow) {
    drawMeter(margin + 8, top + 26, w - 16, 'Microglia maturity (line = germ-free)', microglia, 'mediumpurple');
    drawGermFreeMark(margin + 8, top + 26, w - 16, MOUSE_GERMFREE.microglia);
    drawMeter(margin + 8, top + 64, w - 16, 'BBB tightness (line = germ-free)', bbb, 'slateblue');
    drawGermFreeMark(margin + 8, top + 64, w - 16, MOUSE_GERMFREE.bbb);
  } else {
    drawMeter(margin + 8, top + 30, half, 'Microglia maturity (line = germ-free)', microglia, 'mediumpurple');
    drawGermFreeMark(margin + 8, top + 30, half, MOUSE_GERMFREE.microglia);
    drawMeter(margin + 16 + half, top + 30, half, 'BBB tightness (line = germ-free)', bbb, 'slateblue');
    drawGermFreeMark(margin + 16 + half, top + 30, half, MOUSE_GERMFREE.bbb);
    noStroke();
    fill('dimgray');
    textSize(14);
    textAlign(LEFT, TOP);
    text('Bars: mice with normal microbes. Black lines: germ-free mice (no microbes). Adding microbes, or SCFAs, ' +
      'partly reversed the germ-free changes. Fixed panel: these studies did not test fiber amounts.', margin + 8, top + 72, w - 16, 40);
  }
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  const dy = canvasWidth < 500 ? 32 : 0;
  text('Fiber: ' + fiberSlider.value() + ' g/day', 10, drawHeight + 58 + dy);
  text('Diversity: ' + DIVERSITY_NAMES[diversitySlider.value() - 1], 10, drawHeight + 94 + dy);
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, TOP);
  const ref = 'US average about 16 g a day. 2020 to 2025 guidelines: about 25 g (girls 14 to 18), 31 g (boys 14 to 18).';
  text(ref, 10, drawHeight + 104 + dy, canvasWidth - 20, canvasWidth < 500 ? 56 : 36);
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
  controlHeight = canvasWidth < 500 ? 200 : 140; // phone: extra rows (desktop unchanged)
  canvasHeight = drawHeight + controlHeight;
  containerHeight = canvasHeight;
}
