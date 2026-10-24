// Peristalsis Builder MicroSim
// Chapter 1 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 520 (drawHeight 400 + controlHeight 120); iframe height 522px
// Learning objective (Understand): explain the peristaltic reflex as a local
// enteric nervous system (ENS) circuit: stretch -> contraction behind the food,
// relaxation ahead of it. With no enteric neurons, the reflex fails and food stalls.
// The model is a teaching cartoon. Speeds and stretch values are illustrative
// (arbitrary units), not measured values.

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 210;
let defaultTextSize = 16;

// ---------- controls ----------
let startButton, resetButton, labelCheckbox, ensSelect, sensSlider;
let isRunning = false; // MicroSims always open paused

// ---------- model state ----------
const ENS_ALL = 'Working everywhere';
const ENS_END = 'Missing at the end (like Hirschsprung)';
const ENS_OFF = 'Switched off everywhere';
const AGANGLIONIC_START = 0.68; // fraction of tube where neurons are missing (ENS_END)
const BOLUS_HALF = 0.045;       // half-length of the food bolus, as a fraction of the tube
const BOLUS_STRETCH = 5;        // stretch the bolus puts on the wall (arbitrary units)

let p = 0.08;          // bolus center position, 0 (mouth side) to 1 (anus side)
let reflex = 0;        // strength of the current reflex, 0 to 1 (smoothed)
let backlog = 0;       // how much material has backed up behind a blockage, 0 to 1
let simTime = 0;       // seconds the current bolus has been in the tube
let delivered = 0;     // number of boluses that reached the end
let lastTripTime = null;
let exitPause = 0;     // short pause after a bolus leaves before the next enters
let ripplePhase = 0;   // pacemaker slow-wave ripple (ICC), always present
let status = 'ready';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: Start/Pause, Reset, Show labels
  startButton = createButton('Start');
  startButton.position(10, drawHeight + 8);
  startButton.mousePressed(toggleSimulation);

  resetButton = createButton('Reset');
  resetButton.position(75, drawHeight + 8);
  resetButton.mousePressed(resetSimulation);

  labelCheckbox = createCheckbox(' Show labels', true);
  labelCheckbox.position(145, drawHeight + 10);

  // Row 2: ENS setting
  ensSelect = createSelect();
  ensSelect.option(ENS_ALL);
  ensSelect.option(ENS_END);
  ensSelect.option(ENS_OFF);
  ensSelect.selected(ENS_ALL);
  ensSelect.position(60, drawHeight + 44);
  ensSelect.changed(resetBolus);

  // Row 3: stretch sensitivity
  sensSlider = createSlider(1, 10, 6, 1);
  sensSlider.position(sliderLeftMargin, drawHeight + 82);
  sensSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('A horizontal tube of gut with a brown ball of food inside. When enteric neurons are working, ' +
    'stretch from the food makes the muscle squeeze behind the food and relax ahead of it, pushing it ' +
    'toward the anus side. When neurons are missing, the food stalls and the tube swells behind it.');
}

function draw() {
  updateCanvasSize();

  // drawing area and control area
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (isRunning) stepModel(1 / 60);

  drawTitle();
  drawTube();
  drawStatusPanel();
  drawControlLabels();
}

// ---------- model ----------
function hasNeurons(x) {
  const mode = ensSelect.value();
  if (mode === ENS_OFF) return false;
  if (mode === ENS_END && x >= AGANGLIONIC_START) return false;
  return true;
}

function stepModel(dt) {
  ripplePhase += dt * 2.0;
  if (exitPause > 0) {
    exitPause -= dt;
    if (exitPause <= 0) resetBolus(false);
    return;
  }
  simTime += dt;
  const sens = sensSlider.value();
  const mode = ensSelect.value();
  const sensed = hasNeurons(p) ? BOLUS_STRETCH * sens / 6 : 0; // signal from stretch-sensing neurons
  const threshold = 3.5;                                    // reflex fires when signal >= threshold

  let target = 0;
  if (sensed >= threshold) target = constrain((sens - 3) / 7, 0.15, 1);
  reflex = lerp(reflex, target, 0.08);

  // The bolus moves only if the segment ahead can relax (needs enteric neurons ahead)
  const front = p + BOLUS_HALF;
  const aheadCanRelax = hasNeurons(min(front + 0.01, 1));
  let speed = 0.16 * reflex; // tube lengths per second (illustrative)

  if (reflex > 0.05 && !aheadCanRelax) {
    speed = 0;
    status = 'blocked';
    backlog = min(1, backlog + dt * 0.06);
  } else if (mode === ENS_OFF) {
    status = 'off';
    backlog = min(1, backlog + dt * 0.03);
  } else if (sensed < threshold) {
    status = 'below';
  } else {
    status = 'moving';
  }

  p += speed * dt;
  if (p - BOLUS_HALF > 1) {
    delivered++;
    lastTripTime = simTime;
    exitPause = 1.0;
    status = 'delivered';
  }
}

function resetBolus(clearAll) {
  p = 0.08;
  reflex = 0;
  backlog = 0;
  simTime = 0;
  exitPause = 0;
  status = isRunning ? 'moving' : 'ready';
  if (clearAll === true) {
    delivered = 0;
    lastTripTime = null;
  }
}

function resetSimulation() {
  resetBolus(true);
  ensSelect.selected(ENS_ALL);
  sensSlider.value(6);
  isRunning = false;
  startButton.html('Start');
  status = 'ready';
}

function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
  if (isRunning && status === 'ready') status = 'moving';
}

// ---------- drawing ----------
function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  let ts = 24;
  const title = 'Peristalsis Builder';
  textSize(ts);
  while (textWidth(title) > canvasWidth - 2 * margin && ts > 16) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);

  textSize(15);
  fill('dimgray');
  textAlign(CENTER, TOP);
  text('Pick an ENS setting, predict if the food will reach the end, then press Start.',
    margin, 38, canvasWidth - 2 * margin, 40);

  textSize(14);
  fill('gray');
  text('Gold dots = enteric neurons. Speeds are not to scale.',
    margin, canvasWidth < 560 ? 82 : 62, canvasWidth - 2 * margin, 40);
}

// wall offset (half-width of the tube) at position x (0..1)
function tubeHalfWidth(x, baseR) {
  let r = baseR;
  const mode = ensSelect.value();
  const inBolus = abs(x - p) < BOLUS_HALF && exitPause <= 0;

  // tonic contraction where neurons are missing (the segment stays squeezed)
  if (!hasNeurons(x)) r *= 0.62;

  // weak pacemaker ripple from interstitial cells of Cajal (always present, not propulsive)
  r *= 1 + 0.04 * sin(ripplePhase * 3 - x * 40);

  if (exitPause <= 0) {
    // contraction ring behind the bolus (ascending excitation)
    const dBehind = x - (p - BOLUS_HALF - 0.035);
    r *= 1 - 0.5 * reflex * exp(-(dBehind * dBehind) / (2 * 0.018 * 0.018));
    // relaxation ahead of the bolus (descending inhibition), only where neurons exist
    if (hasNeurons(x)) {
      const dAhead = x - (p + BOLUS_HALF + 0.05);
      r *= 1 + 0.28 * reflex * exp(-(dAhead * dAhead) / (2 * 0.035 * 0.035));
    }
    // the bolus stretches the wall; backed-up material widens the tube behind a blockage
    if (inBolus) r = max(r, baseR * 1.15);
    if (backlog > 0 && x < p + BOLUS_HALF && x > p - 0.35) {
      const k = 1 - (p + BOLUS_HALF - x) / 0.4;
      r *= 1 + 0.45 * backlog * constrain(k, 0, 1);
    }
  }
  return r;
}

function drawTube() {
  const left = margin + 10;
  const right = canvasWidth - margin - 10;
  const L = right - left;
  const cy = 205;
  const baseR = min(34, L * 0.08 + 10);
  const showLabels = labelCheckbox.checked();
  const N = 120;

  // shade the no-neuron zone
  if (ensSelect.value() === ENS_END) {
    noStroke();
    fill(255, 228, 225);
    const zx = left + AGANGLIONIC_START * L;
    rect(zx, cy - baseR * 2.0, right - zx, baseR * 3.6, 6);
  }

  // tube body
  stroke('sienna');
  strokeWeight(3);
  fill('mistyrose');
  beginShape();
  for (let i = 0; i <= N; i++) {
    const x = i / N;
    vertex(left + x * L, cy - tubeHalfWidth(x, baseR));
  }
  for (let i = N; i >= 0; i--) {
    const x = i / N;
    vertex(left + x * L, cy + tubeHalfWidth(x, baseR));
  }
  endShape(CLOSE);

  // colored muscle zones: contraction behind (tomato), relaxation ahead (lightgreen)
  if (reflex > 0.08 && exitPause <= 0) {
    noStroke();
    const cBehind = p - BOLUS_HALF - 0.035;
    fill(255, 99, 71, 200 * reflex);
    for (let s = -1; s <= 1; s += 2) {
      const yy = cy + s * tubeHalfWidth(cBehind, baseR);
      ellipse(left + cBehind * L, yy, 18, 10);
    }
    const cAhead = p + BOLUS_HALF + 0.05;
    if (hasNeurons(cAhead) && cAhead < 1) {
      fill(50, 205, 50, 200 * reflex);
      for (let s = -1; s <= 1; s += 2) {
        const yy = cy + s * tubeHalfWidth(cAhead, baseR);
        ellipse(left + cAhead * L, yy, 26, 8);
      }
    }
  }

  // enteric neurons (myenteric plexus) as dots along the wall; flash when firing
  const nDots = 26;
  for (let i = 0; i <= nDots; i++) {
    const x = i / nDots;
    if (!hasNeurons(x)) continue;
    const near = abs(x - p) < 0.12 && reflex > 0.08 && exitPause <= 0;
    noStroke();
    fill(near ? 'orange' : 'goldenrod');
    const d = near ? 9 : 6;
    circle(left + x * L, cy - tubeHalfWidth(x, baseR) - 7, d);
    circle(left + x * L, cy + tubeHalfWidth(x, baseR) + 7, d);
  }

  // food bolus
  if (exitPause <= 0) {
    noStroke();
    fill('saddlebrown');
    const bw = 2 * BOLUS_HALF * L;
    ellipse(left + p * L, cy, bw, baseR * 1.7);
  }

  // end labels
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, TOP);
  text('Mouth side', left, cy + baseR * 1.9);
  textAlign(RIGHT, TOP);
  text('Anus side →', right, cy + baseR * 1.9);

  if (showLabels) {
    textSize(15);
    if (ensSelect.value() === ENS_END) {
      fill('firebrick');
      textSize(14);
      textAlign(CENTER, TOP);
      const zx = left + AGANGLIONIC_START * L;
      text('No enteric neurons', zx + 4, cy - baseR * 2.0 + 4, right - zx - 8, 40);
      textSize(15);
    }
    if (reflex > 0.08 && exitPause <= 0) {
      const bx = left + (p - BOLUS_HALF - 0.035) * L;
      const ax = left + (p + BOLUS_HALF + 0.05) * L;
      fill('firebrick');
      textAlign(CENTER, BOTTOM);
      const squeezeY = cy - baseR * 1.5 - 14;
      text('squeeze', constrain(bx, left + 30, right - 30), squeezeY);
      if (hasNeurons(p + BOLUS_HALF + 0.05) && ax < right) {
        fill('darkgreen');
        textAlign(CENTER, TOP);
        text('relax', constrain(ax, left + 25, right - 25), cy + baseR * 1.4 + 6);
      }
    }
  }
}

function statusText() {
  switch (status) {
    case 'ready':
      return 'Paused. Press Start to watch the reflex.';
    case 'moving':
      return 'Reflex firing: stretch-sensing neurons make the muscle squeeze behind the food and relax ahead of it.';
    case 'below':
      return 'Stretch is below the trigger level, so the reflex does not fire. Try a higher sensitivity.';
    case 'blocked':
      return 'Stalled: the segment ahead has no enteric neurons, so it cannot relax. Material backs up and the tube swells.';
    case 'off':
      return 'No ENS: pacemaker ripples continue, but there is no reflex to push the food. It stalls.';
    case 'delivered':
      return 'Delivered! A new bolus will enter on the mouth side.';
  }
  return '';
}

function drawStatusPanel() {
  const px = margin;
  const py = 300;
  const pw = canvasWidth - 2 * margin;
  const ph = 94;
  stroke(200);
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(px, py, pw, ph, 10);

  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, TOP);
  text(statusText(), px + 10, py + 8, pw - 20, 58);

  fill('dimgray');
  const trip = lastTripTime === null ? '—' : nf(lastTripTime, 1, 1) + ' s';
  text('Delivered: ' + delivered + '    Last trip: ' + trip,
    px + 10, py + ph - 22, pw - 20, 22);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('ENS:', 10, drawHeight + 56);
  text('Stretch sensitivity: ' + sensSlider.value(), 10, drawHeight + 92);
}

// ---------- responsive ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  sensSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
