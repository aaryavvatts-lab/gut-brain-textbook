// Microbiome Balance MicroSim
// Chapter 3 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 680 (drawHeight 560 + controlHeight 120); iframe height 682px
// Learning objective (Apply): predict how an antibiotic course and a change in
// diet shift the diversity and composition of a gut bacterial community, and
// explain why recovery is often partial and differs between people.
// Teaching cartoon: 24 made-up "species" in 5 groups. Rates, days, and the
// diversity values are illustrative, not measurements. Patterns follow human
// studies (Dethlefsen and Relman 2011; Palleja et al. 2018) described in the
// chapter. The diet behavior is a simplified illustration, not drawn from a
// specific study.
// Layout note (2026-10-23, science edit): narrow layout (under 600 px) now
// shrinks the subtitle, legend, and panel text to fit and uses a two-column
// legend, so nothing clips at phone widths (checked at 320 and 380 px).
// Reviewer note (2026-10-23): rates were softened so a single course gives a
// partial opportunist bloom (about half the community at its peak, briefly)
// and loses 0 to 3 of 24 species, closer to human studies where most of the
// community recovers within weeks to months and only some taxa stay missing.

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 560;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

// ---------- controls ----------
let startButton, resetButton, personButton, abxButton, dietSelect;
let isRunning = false; // starts paused

const DIET_FIBER = 'Fiber-rich, varied plants';
const DIET_LOW = 'Low-fiber, high-sugar';

// ---------- model ----------
// groups: name, color, count of species, antibiotic kill rate (per day),
// fiber-dependent (true/false), opportunist (kept in check by the others)
const GROUPS = [
  { name: 'Fiber fermenters (Bacteroides-type)', short: 'Fiber fermenters', color: 'steelblue', n: 6, kill: 1.05, fiber: true, opp: false },
  { name: 'Butyrate producers', short: 'Butyrate makers', color: 'seagreen', n: 7, kill: 1.1, fiber: true, opp: false },
  { name: 'Bifidobacteria', short: 'Bifidobacteria', color: 'goldenrod', n: 3, kill: 1.15, fiber: true, opp: false },
  { name: 'Other commensals', short: 'Other commensals', color: 'mediumpurple', n: 5, kill: 1.0, fiber: false, opp: false },
  { name: 'Opportunists (can cause disease)', short: 'Opportunists', color: 'tomato', n: 3, kill: 0.15, fiber: false, opp: true }
];
const LOST = 2e-4;          // below this, a species is gone from the gut
const ALPHA = 0.05;         // competition from the rest of the community (niche overlap)
const ABX_DAYS = 5;         // length of an antibiotic course (illustrative)
const DAYS_PER_SECOND = 6;  // simulation speed
const HISTORY_DAYS = 240;
const OPP_BETA = 0.08;     // how strongly the community holds opportunists down
let T_REF = 1;
let O_REF = 0;

let species = [];           // {g, a, k}
let day = 0;
let abxLeft = 0;            // days of antibiotic left
let abxPeriods = [];        // [startDay, endDay]
let history = [];           // {day, H}
let dots = [];              // fixed random dot positions and ranks
let startRichness = 24;
let lastMessage = '';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  startButton = createButton('Start');
  startButton.mousePressed(toggleSimulation);
  resetButton = createButton('Reset');
  resetButton.mousePressed(() => resetSimulation(false));
  personButton = createButton('New person');
  personButton.mousePressed(() => resetSimulation(true));
  abxButton = createButton('Give antibiotic course');
  abxButton.mousePressed(giveAntibiotics);
  dietSelect = createSelect();
  dietSelect.option(DIET_FIBER);
  dietSelect.option(DIET_LOW);
  dietSelect.selected(DIET_FIBER);
  dietSelect.changed(() => {
    lastMessage = dietSelect.value() === DIET_LOW
      ? 'Diet changed to low-fiber: fiber-eating groups have less food and shrink over weeks.'
      : 'Diet changed to fiber-rich: fiber-eating groups that are still present can regrow.';
  });
  positionControls();

  for (let i = 0; i < 360; i++) dots.push({ x: random(), y: random(), r: random() });
  dots.sort((p, q) => p.r - q.r);
  randomSeed(7);
  initCommunity();
  randomSeed();

  describe('A field of colored dots stands for gut bacteria in five groups. A stacked bar shows the share of ' +
    'each group, and a line chart tracks a diversity index over days. Buttons give an antibiotic course or ' +
    'change the diet; antibiotics knock diversity down, opportunist bacteria briefly bloom, and recovery is ' +
    'partial because some rare species are lost.');
}

function positionControls() {
  const y1 = drawHeight + 8;
  startButton.position(10, y1);
  resetButton.position(72, y1);
  personButton.position(138, y1);
  abxButton.position(240, y1);
  if (canvasWidth >= 600) {
    abxButton.position(240, y1);
    dietSelect.position(60, drawHeight + 48);
  } else {
    abxButton.position(10, drawHeight + 44);
    dietSelect.position(60, drawHeight + 82);
  }
}

function initCommunity() {
  species = [];
  for (let g = 0; g < GROUPS.length; g++) {
    for (let j = 0; j < GROUPS[g].n; j++) {
      // a few abundant species and many rare ones, as in real communities
      const base = GROUPS[g].opp ? random(0.004, 0.012) : (j === 0 ? random(0.10, 0.2) : random(0.004, 0.05));
      // each species differs a little in how hard the antibiotic hits it
      const sus = GROUPS[g].opp ? 1 : random(0.8, 1.3);
      species.push({ g: g, a: base, base: base, k: 0, dom: j === 0, sus: sus });
    }
  }
  // choose each species' niche so the starting community is in balance
  let T0 = 0, N0 = 0;
  for (const sp of species) { T0 += sp.base; if (!GROUPS[sp.g].opp) N0 += sp.base; }
  for (const sp of species) {
    if (GROUPS[sp.g].opp) sp.k = sp.base + OPP_BETA * N0;   // held down by the rest of the community
    else sp.k = sp.base * (1 - ALPHA);                        // niche-specific part
  }
  T_REF = N0;
  O_REF = T0 - N0;
  startRichness = richness();
  history = [{ day: 0, H: shannon() }];
}

function stepModel(dt, settling) {
  let total = 0, nonOpp = 0;
  for (const sp of species) { total += sp.a; if (!GROUPS[sp.g].opp) nonOpp += sp.a; }
  const lowFiber = dietSelect && dietSelect.value() === DIET_LOW;

  for (const sp of species) {
    if (sp.a <= 0) continue;
    const G = GROUPS[sp.g];
    const r = G.opp ? 0.5 : 0.6; // growth rate per day (illustrative)
    let crowd;
    if (G.opp) {
      // colonization resistance: opportunists are held down by the rest of the community
      crowd = (sp.a + OPP_BETA * nonOpp) / sp.k;
    } else {
      // niche part (cut by a low-fiber diet for fiber eaters) plus shared competition
      // low fiber: rare fiber specialists lose most of their food; a dominant generalist copes better,
      // and sugar-using commensals gain ground (illustrative factors)
      let f = 1;
      if (lowFiber) f = G.fiber ? (sp.dom ? 0.8 : 0.12) : 1.25;
      const niche = sp.k * f;
      const kEff = niche + ALPHA * T_REF + 0.02 * O_REF;
      // opportunists compete only weakly for the commensals' food
      crowd = (sp.a + ALPHA * (nonOpp - sp.a) + 0.02 * (total - nonOpp)) / kEff;
    }
    let da = r * sp.a * (1 - crowd);
    if (!settling && abxLeft > 0) da -= G.kill * sp.sus * sp.a;
    sp.a = max(0, sp.a + da * dt);
    if (sp.a < LOST) sp.a = 0;
  }
}

function giveAntibiotics() {
  if (abxLeft > 0) return;
  abxLeft = ABX_DAYS;
  abxPeriods.push([day, day + ABX_DAYS]);
  lastMessage = 'Antibiotic course started (5 days). Watch diversity and the opportunists.';
  if (!isRunning) toggleSimulation();
}

function advance(daysToRun) {
  const sub = 0.05;
  let n = round(daysToRun / sub);
  for (let i = 0; i < n; i++) {
    stepModel(sub, false);
    if (abxLeft > 0) {
      abxLeft -= sub;
      if (abxLeft <= 0) {
        abxLeft = 0;
        lastMessage = 'Course finished. Survivors regrow, but species that hit zero cannot come back on their own.';
      }
    }
    day += sub;
    if (!history.length || day - history[history.length - 1].day >= 0.5) history.push({ day: day, H: shannon() });
  }
  while (history.length && history[0].day < day - HISTORY_DAYS) history.shift();
}

function shannon() {
  let total = 0;
  for (const sp of species) total += sp.a;
  if (total <= 0) return 0;
  let H = 0;
  for (const sp of species) {
    if (sp.a > 0) {
      const p = sp.a / total;
      H -= p * Math.log(p);
    }
  }
  return H;
}

function richness() {
  let n = 0;
  for (const sp of species) if (sp.a > 0) n++;
  return n;
}

function groupShares() {
  let total = 0;
  const s = GROUPS.map(() => 0);
  for (const sp of species) { s[sp.g] += sp.a; total += sp.a; }
  return s.map(v => (total > 0 ? v / total : 0));
}

function resetSimulation(newPerson) {
  isRunning = false;
  startButton.html('Start');
  dietSelect.selected(DIET_FIBER);
  day = 0;
  abxLeft = 0;
  abxPeriods = [];
  if (newPerson) {
    initCommunity();
    lastMessage = 'New person: a different starting community. Try the same antibiotic course and compare.';
  } else {
    randomSeed(7);
    initCommunity();
    randomSeed();
    lastMessage = '';
  }
}

function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (isRunning) advance(DAYS_PER_SECOND / 60);

  drawTitle();
  const wide = canvasWidth >= 600;
  let field, bar, chart, panel;
  if (wide) {
    const lw = canvasWidth * 0.46;
    field = { x: margin, y: 74, w: lw - margin, h: 250 };
    panel = { x: margin, y: 334, w: lw - margin, h: drawHeight - 334 - 10 };
    bar = { x: lw + 14, y: 74, w: canvasWidth - lw - 14 - margin, h: 150 };
    chart = { x: lw + 14, y: 236, w: canvasWidth - lw - 14 - margin, h: drawHeight - 236 - 10 };
  } else {
    const W = canvasWidth - 2 * margin;
    field = { x: margin, y: 84, w: W, h: 90 };
    bar = { x: margin, y: 182, w: W, h: 110 };
    chart = { x: margin, y: 298, w: W, h: 104 };
    panel = { x: margin, y: 408, w: W, h: drawHeight - 408 - 8 };
  }
  drawField(field);
  drawBar(bar);
  drawChart(chart);
  drawPanel(panel);
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  let ts = 24;
  const title = 'Microbiome Balance';
  textSize(ts);
  while (textWidth(title) > canvasWidth - 2 * margin && ts > 16) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 6);
  fill('dimgray');
  textSize(canvasWidth < 420 ? 13 : 15);
  const msg = 'Predict what an antibiotic course or a diet change will do to diversity, then press Start.';
  text(msg, margin, 36, canvasWidth - 2 * margin, 50);
}

function drawField(b) {
  stroke(210);
  fill('white');
  rect(b.x, b.y, b.w, b.h, 8);
  const shares = groupShares();
  // assign dot colors by cumulative group share (dots are pre-sorted at random)
  let cum = [];
  let c = 0;
  for (const s of shares) { c += s; cum.push(c); }
  noStroke();
  const pad = 8;
  const nd = dots.length;
  for (let i = 0; i < nd; i++) {
    const q = (i + 0.5) / nd;
    let g = 0;
    while (g < cum.length - 1 && q > cum[g]) g++;
    fill(GROUPS[g].color);
    const d = dots[i];
    circle(b.x + pad + d.x * (b.w - 2 * pad), b.y + pad + d.y * (b.h - 2 * pad), 6);
  }
}

function drawBar(b) {
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, TOP);
  text('Community makeup (share of bacteria)', b.x, b.y);
  const shares = groupShares();
  const by = b.y + 22;
  const bh = 22;
  let x = b.x;
  for (let g = 0; g < GROUPS.length; g++) {
    const w = shares[g] * b.w;
    fill(GROUPS[g].color);
    rect(x, by, w, bh);
    x += w;
  }
  // legend
  const labels = GROUPS.map((gr, g) => gr.short + ' ' + nf(shares[g] * 100, 1, 0) + '%');
  let lx = b.x, ly = by + bh + 8;
  if (canvasWidth >= 600) {
    // wide layout: flow left to right, wrapping as needed
    textSize(14);
    for (let g = 0; g < GROUPS.length; g++) {
      const lw = textWidth(labels[g]) + 26;
      if (lx + lw > b.x + b.w) { lx = b.x; ly += 19; }
      fill(GROUPS[g].color);
      rect(lx, ly + 3, 12, 12);
      fill('black');
      text(labels[g], lx + 16, ly);
      lx += lw;
    }
  } else {
    // narrow: fixed two-column grid, text shrinks until the widest label fits
    const colW = b.w / 2;
    let ts = 14;
    textSize(ts);
    const widest = () => Math.max(...labels.map(l => textWidth(l)));
    while (widest() + 20 > colW && ts > 10) { ts--; textSize(ts); }
    for (let g = 0; g < GROUPS.length; g++) {
      const cx = b.x + (g % 2) * colW;
      const cy = ly + Math.floor(g / 2) * 18;
      fill(GROUPS[g].color);
      rect(cx, cy + 3, 12, 12);
      fill('black');
      text(labels[g], cx + 16, cy + 1);
    }
  }
}

function drawChart(b) {
  stroke(210);
  fill('white');
  rect(b.x, b.y, b.w, b.h, 8);
  const left = b.x + 34, right = b.x + b.w - 10, top = b.y + 24, bottom = b.y + b.h - 22;
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text('Diversity index (higher = more varied mix)', b.x + 8, b.y + 4);
  const Hmax = 3.2;
  const t0 = max(0, day - HISTORY_DAYS);
  const t1 = max(HISTORY_DAYS, day);
  // antibiotic periods
  for (const p of abxPeriods) {
    const xa = map(max(p[0], t0), t0, t1, left, right);
    const xb = map(min(p[1], t1), t0, t1, left, right);
    if (xb > xa) { fill(255, 99, 71, 60); rect(xa, top, xb - xa, bottom - top); }
  }
  stroke('gray');
  strokeWeight(1);
  line(left, bottom, right, bottom);
  line(left, top, left, bottom);
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(RIGHT, CENTER);
  text('3', left - 4, map(3, 0, Hmax, bottom, top));
  text('0', left - 4, bottom);
  textAlign(CENTER, TOP);
  text('day ' + floor(t0), left + 18, bottom + 3);
  text('day ' + floor(t1), right - 22, bottom + 3);
  // starting level reference
  stroke('lightgray');
  const y0 = map(history.length ? history[0].H : 0, 0, Hmax, bottom, top);
  // line
  noFill();
  stroke('darkslateblue');
  strokeWeight(2);
  beginShape();
  for (const h of history) vertex(map(h.day, t0, t1, left, right), map(h.H, 0, Hmax, bottom, top));
  endShape();
  strokeWeight(1);
}

function drawPanel(b) {
  stroke(200);
  fill(255, 255, 255, 235);
  rect(b.x, b.y, b.w, b.h, 8);
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, TOP);
  const H = shannon();
  const rich = richness();
  let line1 = 'Day ' + floor(day) + (abxLeft > 0 ? '  (antibiotics)' : '');
  text(line1, b.x + 10, b.y + 8);
  text('Diversity index: ' + nf(H, 1, 2) + '   Species present: ' + rich + ' of 24', b.x + 10, b.y + 28, b.w - 20, 40);
  const lines = textWidth('Diversity index: 0.00   Species present: 24 of 24') > b.w - 20 ? 2 : 1;
  fill('dimgray');
  const small = b.w < 340;
  textSize(small ? 13 : 14);
  let msg = lastMessage;
  if (!msg) msg = isRunning ? 'Running. Try an antibiotic course or switch the diet.' : 'Paused. Press Start, or give an antibiotic course.';
  if (rich < startRichness && abxLeft === 0 && lastMessage.indexOf('finished') >= 0) {
    msg = 'Course finished. Survivors regrow, but ' + (startRichness - rich) + ' species hit zero and cannot come back on their own.';
  }
  text(msg, b.x + 10, b.y + 30 + lines * 19, b.w - 20, b.h - 34 - lines * 19 - 22);
  fill('gray');
  const foot = 'Species and rates are made up for teaching.';
  let fs = small ? 13 : 14;
  textSize(fs);
  while (textWidth(foot) > b.w - 20 && fs > 10) { fs--; textSize(fs); }
  text(foot, b.x + 10, b.y + b.h - 22, b.w - 20, 20);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  const y = canvasWidth >= 600 ? drawHeight + 60 : drawHeight + 94;
  text('Diet:', 10, y);
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
}
