// Diet Pattern Explorer MicroSim
// Chapter 15 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 630 (drawHeight 480 + controlHeight 150); iframe height 632px
// Learning objective (Analyze): distinguish association from causation in
// nutrition research. Hidden factors (food access, sleep, earlier low mood) can
// create a diet-mood correlation even when diet has no true effect; random
// assignment in a trial removes that confounding.
// All people and scores are SIMULATED. Scores are arbitrary units (0 to 100).

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let sliderLeftMargin = 200;
let defaultTextSize = 16;

// ---------- controls ----------
let designSelect, newButton, accessBox, sleepBox, reverseBox, effectSlider;
const OBS = 'Observational study';
const RCT = 'Randomized trial';

// ---------- model ----------
const N = 200;
let seed = 7;
let people = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: design select + new sample
  designSelect = createSelect();
  designSelect.option(OBS);
  designSelect.option(RCT);
  designSelect.selected(OBS);
  designSelect.position(10, drawHeight + 8);
  designSelect.changed(simulate);

  newButton = createButton('New sample');
  newButton.position(200, drawHeight + 8);
  newButton.mousePressed(() => { seed++; simulate(); });

  // Rows 2-3: hidden factors
  accessBox = createCheckbox(' Food access (money)', true);
  accessBox.position(10, drawHeight + 42);
  accessBox.changed(simulate);
  sleepBox = createCheckbox(' Sleep', true);
  sleepBox.position(200, drawHeight + 42);
  sleepBox.changed(simulate);
  reverseBox = createCheckbox(' Low mood changes eating', true);
  reverseBox.position(10, drawHeight + 74);
  reverseBox.changed(simulate);

  // Row 4: true effect slider
  effectSlider = createSlider(0, 0.5, 0, 0.1);
  effectSlider.position(sliderLeftMargin, drawHeight + 118);
  effectSlider.size(canvasWidth - sliderLeftMargin - margin);
  effectSlider.input(simulate);

  simulate();

  describe('A simulated study of 200 people. In observational mode, a scatter plot shows diet quality score ' +
    'against low-mood score with a best-fit line and correlation. In randomized trial mode, people are split by ' +
    'coin flip into a diet coaching group and a comparison group, and their average low-mood scores are compared. ' +
    'Checkboxes switch hidden factors on and off, and a slider sets the true effect of diet on mood.');
}

// Box-Muller normal random number using p5's seeded random()
function gauss() {
  let u = 0, v = 0;
  while (u === 0) u = random();
  while (v === 0) v = random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(TWO_PI * v);
}

function simulate() {
  randomSeed(seed);
  const effect = effectSlider ? effectSlider.value() : 0;
  const trial = designSelect && designSelect.value() === RCT;
  people = [];
  for (let i = 0; i < N; i++) {
    const access = accessBox.checked() ? gauss() : 0;
    const sleepQ = sleepBox.checked() ? gauss() : 0;
    const earlier = reverseBox.checked() ? gauss() : 0;
    const group = random() < 0.5 ? 1 : 0; // coin flip (used only in the trial)
    let diet = 0.6 * access + 0.4 * sleepQ - 0.6 * earlier + 0.8 * gauss();
    if (trial && group === 1) diet += 1.5; // coaching raises diet quality for everyone in the group
    const mood = -effect * diet - 0.5 * access - 0.6 * sleepQ + 0.8 * earlier + 0.8 * gauss();
    people.push({
      diet: constrain(50 + 12 * diet, 0, 100),
      mood: constrain(50 + 12 * mood, 0, 100),
      group: group,
      jitter: random(-1, 1)
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

  drawTitle();
  if (designSelect.value() === OBS) drawScatter();
  else drawTrial();
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  const title = 'Diet Pattern Explorer';
  let ts = 22;
  textSize(ts);
  while (textWidth(title) > canvasWidth - 20 && ts > 14) {
    ts -= 1;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);
  textSize(canvasWidth < 500 ? 12 : 14); // phone: 12px so the subtitle fits in two lines
  fill('dimgray');
  text('200 simulated people, made-up scores. Set the true effect, switch hidden factors, compare study designs.',
    10, 36, canvasWidth - 20, canvasWidth < 500 ? 46 : 40);
}

// plot frame shared by both modes
function plotBox() {
  const left = margin + 44;
  const right = canvasWidth - margin - 6;
  const top = 84;
  const bottom = 362;
  return { left, right, top, bottom };
}

function drawAxes(b, xLabel) {
  stroke('gray');
  strokeWeight(1);
  fill('white');
  rect(b.left, b.top, b.right - b.left, b.bottom - b.top);
  noStroke();
  fill('black');
  textSize(14);
  textAlign(CENTER, TOP);
  text(xLabel, (b.left + b.right) / 2, b.bottom + 18);
  // y label (rotated)
  push();
  translate(margin + 6, (b.top + b.bottom) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, TOP);
  text('Low-mood score (higher = more symptoms)', 0, -4);
  pop();
  fill('dimgray');
  textAlign(RIGHT, CENTER);
  for (let v = 0; v <= 100; v += 50) {
    const y = map(v, 0, 100, b.bottom, b.top);
    text(v, b.left - 4, y);
  }
}

function drawScatter() {
  const b = plotBox();
  drawAxes(b, 'Diet quality score (0 to 100)');
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(CENTER, TOP);
  for (let v = 0; v <= 100; v += 50) {
    text(v, map(v, 0, 100, b.left, b.right), b.bottom + 2);
  }

  // points
  noStroke();
  fill(70, 130, 180, 150); // steelblue, translucent
  for (const p of people) {
    circle(map(p.diet, 0, 100, b.left, b.right), map(p.mood, 0, 100, b.bottom, b.top), 7);
  }

  // regression line and correlation
  const xs = people.map(p => p.diet);
  const ys = people.map(p => p.mood);
  const mx = mean(xs), my = mean(ys);
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < xs.length; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  const slope = sxx > 0 ? sxy / sxx : 0;
  const r = (sxx > 0 && syy > 0) ? sxy / Math.sqrt(sxx * syy) : 0;
  const xA = 5, xB = 95;
  stroke('crimson');
  strokeWeight(3);
  line(map(xA, 0, 100, b.left, b.right), map(constrain(my + slope * (xA - mx), 0, 100), 0, 100, b.bottom, b.top),
    map(xB, 0, 100, b.left, b.right), map(constrain(my + slope * (xB - mx), 0, 100), 0, 100, b.bottom, b.top));

  // message
  const eff = effectSlider.value();
  let msg = 'Correlation r = ' + nf(r, 1, 2) + '. ';
  const anyHidden = accessBox.checked() || sleepBox.checked() || reverseBox.checked();
  if (eff === 0 && Math.abs(r) >= 0.2) {
    msg += 'You set the true effect to NONE, yet diet and mood are linked. Hidden factors made this link.';
  } else if (eff === 0) {
    msg += 'True effect is none and the link is weak: with few hidden factors, there is little to fool you.';
  } else if (anyHidden) {
    msg += 'Part of this link is the real effect you set, and part comes from hidden factors. You cannot tell how much from this plot.';
  } else {
    msg += 'No hidden factors are on, so this link reflects the real effect you set.';
  }
  drawMessage(msg);
}

function drawTrial() {
  const b = plotBox();
  drawAxes(b, 'Group (assigned by coin flip)');
  const groups = [
    { g: 0, name: 'Comparison', col: color(128, 128, 128, 150), solid: 'dimgray' },
    { g: 1, name: 'Diet coaching', col: color(46, 139, 87, 150), solid: 'seagreen' }
  ];
  const means = [];
  for (let k = 0; k < 2; k++) {
    const gx = map(k === 0 ? 0.28 : 0.72, 0, 1, b.left, b.right);
    const w = (b.right - b.left) * 0.16;
    const members = people.filter(p => p.group === groups[k].g);
    noStroke();
    fill(groups[k].col);
    for (const p of members) {
      circle(gx + p.jitter * w, map(p.mood, 0, 100, b.bottom, b.top), 7);
    }
    const m = mean(members.map(p => p.mood));
    means.push(m);
    stroke(groups[k].solid);
    strokeWeight(4);
    line(gx - w * 1.3, map(m, 0, 100, b.bottom, b.top), gx + w * 1.3, map(m, 0, 100, b.bottom, b.top));
    noStroke();
    fill('black');
    textSize(14);
    textAlign(CENTER, TOP);
    text(groups[k].name + ' (n=' + members.length + ')', gx, b.bottom + 2);
  }
  const diff = means[1] - means[0];
  const eff = effectSlider.value();
  let msg = 'Average difference (coaching minus comparison) = ' + nf(diff, 1, 1) + ' points. ';
  if (eff === 0) {
    msg += 'True effect is none, and the coin flip balanced the hidden factors, so the gap is just chance.';
  } else {
    msg += 'The coin flip balanced the hidden factors, so this gap mostly reflects the real effect you set, plus chance.';
  }
  drawMessage(msg);
}

function drawMessage(msg) {
  const y = 404;
  noStroke();
  fill('white');
  stroke('silver');
  rect(margin - 4, y - 4, canvasWidth - 2 * margin + 8, 70, 8);
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text(msg, margin + 4, y + 2, canvasWidth - 2 * margin - 8, 64);
}

function mean(arr) {
  if (arr.length === 0) return 0;
  let s = 0;
  for (const a of arr) s += a;
  return s / arr.length;
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  const names = ['none', 'tiny', 'small', 'medium', 'large', 'strong'];
  const idx = Math.round(effectSlider.value() * 10);
  text('True effect of diet: ' + names[idx], 10, drawHeight + 128);
}

// ---------- responsive ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  effectSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
