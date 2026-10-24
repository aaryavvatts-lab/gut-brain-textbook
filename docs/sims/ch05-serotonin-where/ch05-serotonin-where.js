// Serotonin: Where Does It Go? MicroSim
// Chapter 5 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 570 (drawHeight 460 + controlHeight 110); iframe height 572px
// Learning objective (Understand): distinguish gut (peripheral) serotonin from
// brain (central) serotonin. Gut serotonin made by enterochromaffin (EC) cells acts
// on nearby nerves, is taken back up by lining cells (SERT), or enters the blood,
// where platelets store it. It cannot cross the blood-brain barrier. The brain makes
// its own serotonin from tryptophan, which can cross. Most tryptophan is used by
// other pathways (mainly the kynurenine pathway).
// Particle counts, speeds, and fate percentages are illustrative, not measured.

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let defaultTextSize = 16;

// vertical bands
const BRAIN_TOP = 84, BRAIN_BOT = 170;
const BBB_TOP = 172, BBB_BOT = 190;
const BLOOD_TOP = 196, BLOOD_BOT = 282;
const NERVE_Y = 290;
const LINING_TOP = 298, LINING_BOT = 336;
const LUMEN_TOP = 338, LUMEN_BOT = 376;
const PANEL_Y = 381;

// ---------- controls ----------
let startButton, resetButton, ssriCheckbox, releaseButton, eatButton, labelCheckbox;
let isRunning = false;

// ---------- model ----------
let particles = [];
let pulses = [];
let platelets = [];
let counts = { nerve: 0, reuptake: 0, platelet: 0, bounced: 0, crossedGut: 0, kyn: 0, brainMade: 0 };
let bbbFlash = 0;
let brainFlash = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  startButton = createButton('Start');
  startButton.position(10, drawHeight + 10);
  startButton.mousePressed(toggleSimulation);

  resetButton = createButton('Reset');
  resetButton.position(72, drawHeight + 10);
  resetButton.mousePressed(resetSimulation);

  ssriCheckbox = createCheckbox(' SSRI (blocks SERT)', false);
  ssriCheckbox.position(140, drawHeight + 12);

  releaseButton = createButton('Release gut serotonin');
  releaseButton.position(10, drawHeight + 46);
  releaseButton.mousePressed(releaseSerotonin);

  eatButton = createButton('Eat protein (tryptophan)');
  eatButton.position(180, drawHeight + 46);
  eatButton.mousePressed(eatTryptophan);

  labelCheckbox = createCheckbox(' Show labels', true);
  labelCheckbox.position(10, drawHeight + 80);

  makePlatelets();

  describe('A cut-away body map. At the bottom, enterochromaffin cells in the gut lining release ' +
    'purple serotonin dots that act on a nerve, are taken back into lining cells, or enter the blood, ' +
    'where platelets store them. Serotonin dots that reach the blood-brain barrier bounce off. ' +
    'Green tryptophan dots from food cross the barrier through transporter gates and become ' +
    'serotonin inside brain neurons. Counters show where every dot went.');
}

function makePlatelets() {
  platelets = [];
  for (let i = 0; i < 9; i++) {
    platelets.push({
      x: random(margin + 40, canvasWidth - margin - 20),
      y: random(BLOOD_TOP + 18, BLOOD_BOT - 14),
      vx: random([-1, 1]) * random(0.3, 0.6),
      load: 0
    });
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

  if (isRunning) stepModel();

  drawTitle();
  drawBody();
  drawParticles();
  drawPanel();
}

// ---------- geometry helpers ----------
function ecPositions() {
  const xs = [];
  const n = 3;
  for (let i = 0; i < n; i++) xs.push(margin + 60 + (i + 0.5) * (canvasWidth - 2 * margin - 70) / n);
  return xs;
}
function gatePositions() {
  return [canvasWidth * 0.56, canvasWidth * 0.72, canvasWidth * 0.88];
}
function neuronPositions() {
  return [
    { x: canvasWidth * 0.48, y: 132 },
    { x: canvasWidth * 0.68, y: 124 },
    { x: canvasWidth * 0.86, y: 136 }
  ];
}
const NERVE_X = 34; // vagus line runs up the left side

// ---------- actions ----------
function releaseSerotonin() {
  if (!isRunning) toggleSimulation();
  const ssri = ssriCheckbox.checked();
  for (const ex of ecPositions()) {
    for (let k = 0; k < 7; k++) {
      const r = random();
      let fate;
      if (ssri) fate = r < 0.55 ? 'nerve' : 'blood';
      else fate = r < 0.35 ? 'nerve' : (r < 0.7 ? 'reuptake' : 'blood');
      const p = { kind: '5ht', x: ex + random(-6, 6), y: LINING_TOP + 18, fate: fate, state: 'leave', age: 0, alpha: 255 };
      if (fate === 'nerve') { p.tx = ex + random(-20, 20); p.ty = NERVE_Y; }
      if (fate === 'reuptake') { p.tx = ex + random([-1, 1]) * random(22, 40); p.ty = LINING_TOP + 20; }
      if (fate === 'blood') { p.tx = ex + random(-30, 30); p.ty = random(BLOOD_TOP + 20, BLOOD_BOT - 15); }
      particles.push(p);
    }
  }
}

function eatTryptophan() {
  if (!isRunning) toggleSimulation();
  for (let k = 0; k < 15; k++) {
    const x = random(margin + 60, canvasWidth - margin - 10);
    const p = { kind: 'trp', x: x, y: LUMEN_TOP + random(10, 36), state: 'absorb', age: 0, alpha: 255 };
    p.tx = x + random(-20, 20);
    p.ty = random(BLOOD_TOP + 20, BLOOD_BOT - 15);
    p.fate = random() < 0.75 ? 'kyn' : 'brain'; // most tryptophan is used by other pathways
    particles.push(p);
  }
}

function resetSimulation() {
  particles = [];
  pulses = [];
  counts = { nerve: 0, reuptake: 0, platelet: 0, bounced: 0, crossedGut: 0, kyn: 0, brainMade: 0 };
  ssriCheckbox.checked(false);
  isRunning = false;
  startButton.html('Start');
  makePlatelets();
}

function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

// ---------- model ----------
function moveToward(p, speed) {
  const dx = p.tx - p.x, dy = p.ty - p.y;
  const d = sqrt(dx * dx + dy * dy);
  if (d < speed) { p.x = p.tx; p.y = p.ty; return true; }
  p.x += speed * dx / d;
  p.y += speed * dy / d;
  return false;
}

function stepModel() {
  const ssri = ssriCheckbox.checked();
  bbbFlash = max(0, bbbFlash - 1);
  brainFlash = max(0, brainFlash - 1);

  for (const pl of platelets) {
    pl.x += pl.vx;
    if (pl.x < margin + 40 || pl.x > canvasWidth - margin - 10) pl.vx *= -1;
    pl.x = constrain(pl.x, margin + 40, canvasWidth - margin - 10);
  }

  for (const p of particles) {
    p.age++;
    if (p.kind === '5ht') stepSerotonin(p, ssri);
    else if (p.kind === 'trp') stepTryptophan(p);
    else if (p.kind === 'brain5ht') {
      p.x += random(-0.6, 0.6);
      p.y += random(-0.6, 0.6);
      p.alpha -= ssri ? 0.3 : 0.8; // an SSRI keeps brain serotonin around longer
    }
  }
  particles = particles.filter(p => p.alpha > 0);

  for (const s of pulses) s.t += 0.012;
  for (const s of pulses) if (s.t >= 1 && !s.done) { s.done = true; brainFlash = 30; }
  pulses = pulses.filter(s => s.t < 1.15);
}

function stepSerotonin(p, ssri) {
  if (p.state === 'leave') {
    if (moveToward(p, 1.4)) {
      if (p.fate === 'nerve') {
        counts.nerve++;
        pulses.push({ x0: p.x, t: 0, done: false });
        p.alpha = 0;
      } else if (p.fate === 'reuptake') {
        counts.reuptake++;
        p.state = 'fade';
      } else {
        p.state = 'blood';
        p.vx = random(-0.8, 0.8);
        p.vy = random(-0.8, -0.2);
      }
    }
  } else if (p.state === 'fade') {
    p.alpha -= 6;
  } else if (p.state === 'blood') {
    // platelets take up serotonin through SERT (blocked by an SSRI)
    if (!ssri) {
      for (const pl of platelets) {
        if (dist(p.x, p.y, pl.x, pl.y) < 14) {
          pl.load = min(pl.load + 1, 6);
          counts.platelet++;
          p.alpha = 0;
          return;
        }
      }
    }
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < margin + 40 || p.x > canvasWidth - margin - 6) p.vx *= -1;
    if (p.y > BLOOD_BOT - 6) p.vy = -abs(p.vy);
    if (p.y < BLOOD_TOP + 4) {
      // reached the blood-brain barrier: gut serotonin cannot cross
      p.vy = abs(p.vy) + 0.2;
      counts.bounced++;
      bbbFlash = 20;
    }
    if (p.age > 900) p.alpha -= 2; // slowly broken down in the body
  }
}

function stepTryptophan(p) {
  if (p.state === 'absorb') {
    if (moveToward(p, 1.3)) {
      if (p.fate === 'kyn') { p.state = 'kyn'; counts.kyn++; }
      else {
        const gates = gatePositions();
        p.gx = random(gates);
        p.tx = p.gx;
        p.ty = BBB_BOT + 2;
        p.state = 'toGate';
      }
    }
  } else if (p.state === 'kyn') {
    p.alpha -= 2.2; // turned into kynurenine and other products
    p.y += random(-0.4, 0.4);
  } else if (p.state === 'toGate') {
    if (moveToward(p, 1.2)) {
      p.state = 'cross';
      p.tx = p.gx;
      p.ty = BBB_TOP - 6;
    }
  } else if (p.state === 'cross') {
    if (moveToward(p, 0.8)) {
      const ns = neuronPositions();
      const n = random(ns);
      p.state = 'toNeuron';
      p.tx = n.x + random(-8, 8);
      p.ty = n.y + random(-6, 6);
    }
  } else if (p.state === 'toNeuron') {
    if (moveToward(p, 1.0)) {
      // TPH2 in brain neurons turns tryptophan into serotonin
      p.kind = 'brain5ht';
      p.alpha = 255;
      counts.brainMade++;
    }
  }
}

// ---------- drawing ----------
function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  let ts = 24;
  const title = 'Serotonin: Where Does It Go?';
  textSize(ts);
  while (textWidth(title) > canvasWidth - 2 * margin && ts > 16) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);
  textSize(15);
  fill('dimgray');
  text('Release gut serotonin, then feed in tryptophan. Which one reaches the brain?',
    margin, 36, canvasWidth - 2 * margin, 44);
}

function drawBody() {
  const showLabels = labelCheckbox.checked();
  const L = margin, R = canvasWidth - margin;

  // brain
  stroke('mediumpurple');
  strokeWeight(2);
  fill(brainFlash > 0 ? color(235, 225, 255) : color(245, 240, 255));
  rect(L + 30, BRAIN_TOP, R - L - 30, BRAIN_BOT - BRAIN_TOP, 14);
  for (const n of neuronPositions()) {
    stroke('rebeccapurple');
    strokeWeight(2);
    line(n.x, n.y, n.x - 16, n.y + 22);
    line(n.x, n.y, n.x + 18, n.y + 18);
    noStroke();
    fill('plum');
    circle(n.x, n.y, 16);
  }

  // blood-brain barrier: tight wall of cells with transporter gates
  noStroke();
  fill(bbbFlash > 0 ? 'firebrick' : 'sienna');
  rect(L + 30, BBB_TOP, R - L - 30, BBB_BOT - BBB_TOP);
  stroke('peru');
  strokeWeight(1);
  for (let x = L + 30; x < R; x += 18) line(x, BBB_TOP, x, BBB_BOT);
  for (const gx of gatePositions()) {
    noStroke();
    fill('honeydew');
    rect(gx - 5, BBB_TOP, 10, BBB_BOT - BBB_TOP);
    stroke('seagreen');
    strokeWeight(2);
    line(gx - 5, BBB_TOP, gx - 5, BBB_BOT);
    line(gx + 5, BBB_TOP, gx + 5, BBB_BOT);
  }

  // blood vessel
  noStroke();
  fill(255, 228, 225);
  rect(L + 30, BLOOD_TOP, R - L - 30, BLOOD_BOT - BLOOD_TOP, 8);
  for (const pl of platelets) {
    stroke('palevioletred');
    strokeWeight(1);
    fill(lerpColor(color('mistyrose'), color('mediumorchid'), pl.load / 6));
    ellipse(pl.x, pl.y, 18, 10);
  }

  // nerve (vagus afferent) along the left side and under the lining
  stroke('goldenrod');
  strokeWeight(4);
  noFill();
  line(NERVE_X, NERVE_Y, R, NERVE_Y);
  line(NERVE_X, NERVE_Y, NERVE_X, BRAIN_TOP + 30);
  line(NERVE_X, BRAIN_TOP + 30, L + 40, BRAIN_TOP + 30);
  for (const s of pulses) {
    const pt = pulsePoint(s);
    noStroke();
    fill('gold');
    circle(pt.x, pt.y, 10);
  }

  // gut lining with EC cells
  const ecs = ecPositions();
  const cellW = 22;
  for (let x = L + 30; x < R - 2; x += cellW) {
    stroke('rosybrown');
    strokeWeight(1);
    fill('linen');
    rect(x, LINING_TOP, cellW, LINING_BOT - LINING_TOP, 3);
  }
  for (const ex of ecs) {
    stroke('darkorange');
    strokeWeight(2);
    fill('orange');
    rect(ex - cellW / 2, LINING_TOP, cellW, LINING_BOT - LINING_TOP, 3);
  }

  // gut lumen
  noStroke();
  fill(250, 240, 215);
  rect(L + 30, LUMEN_TOP, R - L - 30, LUMEN_BOT - LUMEN_TOP, 6);

  if (showLabels) {
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);
    fill('rebeccapurple');
    if (textWidth('Brain: neurons make serotonin with TPH2') > R - L - 46) textSize(12);
    text('Brain: neurons make serotonin with TPH2', L + 38, BRAIN_TOP + 4, R - L - 46, 20);
    textSize(14);
    fill('white');
    textAlign(LEFT, CENTER);
    text('Blood-brain barrier', L + 38, (BBB_TOP + BBB_BOT) / 2);
    textAlign(LEFT, TOP);
    fill('darkred');
    text('Blood: platelets store serotonin', L + 38, BLOOD_TOP + 3, R - L - 46, 20);
    fill('darkorange');
    text('Orange = EC cells (TPH1)', L + 38, LUMEN_TOP + 3);
    fill('saddlebrown');
    textAlign(RIGHT, TOP);
    text('Inside the gut', R - 6, LUMEN_TOP + 20);
    push();
    translate(NERVE_X - 12, (NERVE_Y + BRAIN_TOP + 30) / 2);
    rotate(-HALF_PI);
    textAlign(CENTER, CENTER);
    fill('darkgoldenrod');
    text('Vagus nerve', 0, 0);
    pop();
  }
}

function pulsePoint(s) {
  // path: along the nerve under the lining to the left, up the side, into the brainstem
  const a = s.x0 - NERVE_X;
  const b = NERVE_Y - (BRAIN_TOP + 30);
  const c = 16;
  const total = a + b + c;
  let d = constrain(s.t, 0, 1) * total;
  if (d < a) return { x: s.x0 - d, y: NERVE_Y };
  d -= a;
  if (d < b) return { x: NERVE_X, y: NERVE_Y - d };
  d -= b;
  return { x: NERVE_X + d, y: BRAIN_TOP + 30 };
}

function drawParticles() {
  noStroke();
  for (const p of particles) {
    let c;
    if (p.kind === '5ht' || p.kind === 'brain5ht') c = color(128, 0, 128, p.alpha);
    else if (p.state === 'kyn') c = color(130, 130, 130, p.alpha);
    else c = color(34, 139, 34, p.alpha);
    fill(c);
    circle(p.x, p.y, p.kind === 'trp' ? 8 : 7);
  }
}

function drawPanel() {
  const px = margin, py = PANEL_Y, pw = canvasWidth - 2 * margin, ph = 76;
  stroke(200);
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(px, py, pw, ph, 8);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  fill('purple');
  const narrow = canvasWidth < 560;
  const line1 = narrow ?
    'Gut serotonin: nerve ' + counts.nerve + ', reuptake ' + counts.reuptake +
    ', platelets ' + counts.platelet + ', bounced ' + counts.bounced :
    'Gut serotonin: nerve signals ' + counts.nerve + ', reuptake ' + counts.reuptake +
    ', platelets ' + counts.platelet + ', bounced off barrier ' + counts.bounced;
  text(line1, px + 8, py + 4, pw - 16, 40);
  fill('darkgreen');
  const line2 = narrow ?
    'Gut serotonin in brain: 0. Brain serotonin made from tryptophan: ' + counts.brainMade :
    'Gut serotonin in brain: 0.  Brain serotonin made from tryptophan: ' + counts.brainMade +
    '  (other pathways: ' + counts.kyn + ')';
  text(line2, px + 8, py + (narrow ? 40 : 26), pw - 16, 40);
  if (!narrow) {
    fill('dimgray');
    text('Purple = serotonin. Green = tryptophan. Gray = tryptophan used by other pathways.',
      px + 8, py + 50, pw - 16, 20);
  }
}

// ---------- responsive ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  makePlatelets();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
