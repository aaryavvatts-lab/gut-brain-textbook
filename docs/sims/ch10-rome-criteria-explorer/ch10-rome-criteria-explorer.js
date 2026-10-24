// Rome Criteria Explorer MicroSim
// Chapter 10 of Gut Check: The Neuroscience of How Your Gut and Brain Talk
// CANVAS_HEIGHT = 770 (drawHeight 540 + controlHeight 230); iframe height 772px
// Learning objective (Apply): apply the symptom-based Rome criteria for irritable
// bowel syndrome (IBS) to fictional symptom profiles, compare Rome IV (2016) with
// Rome V (2026) and the child/teen criteria, and recognize that alarm features
// call for medical evaluation no matter what the checklist says.
// EDUCATIONAL ONLY: this tool cannot diagnose IBS or any other condition.
// Criteria wording sources: Rome Foundation Rome IV and Rome V criteria pages.

// ---------- layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 540;
let controlHeight = 230;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 190;
let defaultTextSize = 16;

// ---------- controls ----------
let criteriaSelect, profileSelect, alarmSelect;
let cbDefecation, cbFrequency, cbForm, cbContinuous;
let painSlider, monthsSlider;

const CRIT_IV = 'Rome IV, adults (2016)';
const CRIT_V = 'Rome V, adults (2026, current)';
const CRIT_KID = 'Rome IV, children and teens 4 to 18';

const ALARM_NONE = 'None';
const ALARMS = [ALARM_NONE, 'Blood in stool', 'Unplanned weight loss', 'Anemia on a blood test',
  'Family history of colon cancer, IBD, or celiac disease'];

// Fictional profiles: [pain days per month, months since onset, defecation, frequency, form, continuous, alarm]
const PROFILES = {
  'Custom (set your own)': null,
  'Sam, 15 (fictional)': [10, 14, true, true, true, false, ALARM_NONE],
  'Dana, 24: mild, 3 days a month': [3, 12, true, false, true, false, ALARM_NONE],
  'Marcus, 30: pain all day, every day': [30, 12, true, true, false, true, ALARM_NONE],
  'Leah, 19: symptoms began 2 months ago': [8, 2, true, true, true, false, ALARM_NONE],
  'Omar, 52: blood in stool': [8, 10, true, true, true, false, 'Blood in stool']
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  criteriaSelect = createSelect();
  [CRIT_IV, CRIT_V, CRIT_KID].forEach(c => criteriaSelect.option(c));
  criteriaSelect.selected(CRIT_IV);
  criteriaSelect.position(90, drawHeight + 8);

  profileSelect = createSelect();
  Object.keys(PROFILES).forEach(p => profileSelect.option(p));
  profileSelect.selected('Sam, 15 (fictional)');
  profileSelect.position(90, drawHeight + 38);
  profileSelect.changed(applyProfile);

  alarmSelect = createSelect();
  ALARMS.forEach(a => alarmSelect.option(a));
  alarmSelect.position(90, drawHeight + 68);
  alarmSelect.style('max-width', '280px');

  cbDefecation = createCheckbox(' Pain linked to BMs', true);
  cbDefecation.position(10, drawHeight + 100);
  cbFrequency = createCheckbox(' Change in how often', true);
  cbFrequency.position(190, drawHeight + 100);
  cbForm = createCheckbox(' Change in how stool looks', true);
  cbForm.position(10, drawHeight + 126);
  cbContinuous = createCheckbox(' Pain all day, every day', false);
  cbContinuous.position(10, drawHeight + 152);

  painSlider = createSlider(0, 30, 8, 1);
  painSlider.position(sliderLeftMargin, drawHeight + 184);
  painSlider.size(canvasWidth - sliderLeftMargin - margin);

  monthsSlider = createSlider(0, 24, 9, 1);
  monthsSlider.position(sliderLeftMargin, drawHeight + 208);
  monthsSlider.size(canvasWidth - sliderLeftMargin - margin);

  applyProfile();
  layoutControls();

  describe('An educational checklist for the Rome criteria for irritable bowel syndrome. The learner picks ' +
    'Rome IV for adults, Rome V for adults, or the child and teen criteria, chooses a fictional symptom profile, ' +
    'and changes pain frequency, months since symptoms began, and three bowel-related features. Each criterion ' +
    'shows a check or a cross, and a result box says whether the symptom criteria are met. Alarm features trigger ' +
    'a message that medical evaluation is needed. A banner states that the tool cannot diagnose.');
}

function applyProfile() {
  const p = PROFILES[profileSelect.value()];
  if (!p) return;
  painSlider.value(p[0]);
  monthsSlider.value(p[1]);
  cbDefecation.checked(p[2]);
  cbFrequency.checked(p[3]);
  cbForm.checked(p[4]);
  cbContinuous.checked(p[5]);
  alarmSelect.selected(p[6]);
}

function layoutControls() {
  const narrow = canvasWidth < 500;
  const dy = narrow ? 26 : 0; // phone: checkboxes stack in one column, sliders move down
  if (narrow) {
    const sw = canvasWidth - 90 - 10;
    criteriaSelect.size(sw);
    profileSelect.size(sw);
    alarmSelect.size(sw);
    alarmSelect.style('max-width', sw + 'px');
    cbFrequency.position(10, drawHeight + 126);
    cbForm.position(10, drawHeight + 152);
    cbContinuous.position(10, drawHeight + 178);
  } else {
    cbForm.position(10, drawHeight + 126);
    cbContinuous.position(10, drawHeight + 152);
    // keep the second checkbox on its own column only when there is room
    cbFrequency.position(canvasWidth < 420 ? 200 : 210, drawHeight + 100);
  }
  painSlider.position(sliderLeftMargin, drawHeight + 184 + dy);
  monthsSlider.position(sliderLeftMargin, drawHeight + 208 + dy);
  painSlider.size(canvasWidth - sliderLeftMargin - margin);
  monthsSlider.size(canvasWidth - sliderLeftMargin - margin);
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
  const y = drawBanner(58);
  const res = evaluate();
  const y2 = drawChecklist(y + 8, res);
  drawResult(y2 + 6, res);
  drawControlLabels();
}

// ---------- the criteria ----------
function evaluate(override) {
  const crit = override || criteriaSelect.value();
  const pain = painSlider.value();
  const months = monthsSlider.value();
  const nFeat = [cbDefecation.checked(), cbFrequency.checked(), cbForm.checked()].filter(Boolean).length;
  const continuous = cbContinuous.checked();
  const rows = [];

  if (crit === CRIT_IV) {
    rows.push({ ok: pain >= 4, label: 'Pain at least 1 day a week on average (about 4+ days a month)', you: pain + ' days/month', miss: 'pain is not frequent enough' });
    rows.push({ ok: nFeat >= 2, label: 'Pain linked to 2 or more of the 3 bowel features', you: nFeat + ' of 3', miss: 'fewer than 2 of the 3 bowel features' });
    rows.push({ ok: months >= 6, label: 'Started at least 6 months ago (and met for the last 3 months)', you: months + ' months', miss: 'symptoms began less than 6 months ago' });
  } else if (crit === CRIT_V) {
    rows.push({ ok: pain >= 3, label: 'Pain or discomfort at least 3 days a month on average', you: pain + ' days/month', miss: 'pain is not frequent enough' });
    rows.push({ ok: !continuous, label: 'Pain is recurrent, not continuous', you: continuous ? 'continuous' : 'comes and goes', miss: 'the pain is continuous' });
    rows.push({ ok: nFeat >= 2, label: 'Linked to 2 or more of the 3 bowel features', you: nFeat + ' of 3', miss: 'fewer than 2 of the 3 bowel features' });
    rows.push({ ok: months >= 6, label: 'Started at least 6 months ago (and met for the last 3 months)', you: months + ' months', miss: 'symptoms began less than 6 months ago' });
  } else {
    rows.push({ ok: pain >= 4, label: 'Pain at least 4 days a month', you: pain + ' days/month', miss: 'pain is not frequent enough' });
    rows.push({ ok: nFeat >= 1, label: 'Linked to 1 or more of the 3 bowel features', you: nFeat + ' of 3', miss: 'no link to the bowel features' });
    rows.push({ ok: months >= 2, label: 'Present for at least 2 months', you: months + ' months', miss: 'symptoms began less than 2 months ago' });
  }
  const meets = rows.every(r => r.ok);
  const firstFail = rows.find(r => !r.ok);
  return { crit, rows, meets, firstFail, alarm: alarmSelect.value() };
}

// ---------- drawing ----------
function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  let ts = 24;
  const title = 'Rome Criteria Explorer';
  textSize(ts);
  while (textWidth(title) > canvasWidth - 2 * margin && ts > 16) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 8);
  textSize(14);
  fill('dimgray');
  text('Pick a version and a fictional profile, then change the symptoms.', margin, 36, canvasWidth - 2 * margin, 40);
}

function wrappedHeight(str, w, lineH) {
  // rough line count for wrapped text at the current text size
  const words = str.split(' ');
  let lines = 1, cur = '';
  for (const wd of words) {
    const test = cur ? cur + ' ' + wd : wd;
    if (textWidth(test) > w) { lines++; cur = wd; } else { cur = test; }
  }
  return lines * lineH;
}

function drawBanner(y) {
  const msg = 'For learning only. This tool cannot diagnose IBS or any other condition. Only a clinician can.';
  textSize(14);
  const w = canvasWidth - 2 * margin;
  const h = wrappedHeight(msg, w - 20, 18) + 10;
  const yy = y + (canvasWidth < 560 ? 18 : 0);
  stroke('firebrick');
  strokeWeight(2);
  fill(255, 240, 240);
  rect(margin, yy, w, h, 6);
  strokeWeight(1);
  noStroke();
  fill('firebrick');
  textAlign(LEFT, TOP);
  text(msg, margin + 10, yy + 5, w - 20, h);
  return yy + h;
}

function drawCheck(x, y, ok) {
  noStroke();
  fill(ok ? 'seagreen' : 'firebrick');
  circle(x, y, 18);
  stroke('white');
  strokeWeight(2.5);
  if (ok) {
    line(x - 5, y, x - 1, y + 4);
    line(x - 1, y + 4, x + 5, y - 4);
  } else {
    line(x - 4, y - 4, x + 4, y + 4);
    line(x + 4, y - 4, x - 4, y + 4);
  }
  strokeWeight(1);
}

function drawChecklist(y, res) {
  const w = canvasWidth - 2 * margin;
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, TOP);
  const head = res.crit + ': IBS symptom criteria';
  const hh = wrappedHeight(head, canvasWidth < 500 ? w - 14 : w, 19);
  text(head, margin, y, w, hh + 4);
  let yy = y + hh + 4;
  textSize(14);
  res.rows.forEach(r => {
    const youW = canvasWidth < 560 ? 0 : 130;
    const lw = w - 34 - youW;
    const label = canvasWidth < 560 ? r.label + ' (you: ' + r.you + ')' : r.label;
    const h = max(24, wrappedHeight(label, lw, 17) + 6);
    drawCheck(margin + 10, yy + 10, r.ok);
    noStroke();
    fill('black');
    textAlign(LEFT, TOP);
    text(label, margin + 26, yy + 2, lw, h);
    if (youW > 0) {
      fill('dimgray');
      textAlign(RIGHT, TOP);
      text(r.you, canvasWidth - margin, yy + 2);
    }
    yy += h + 4;
  });
  return yy;
}

function drawResult(y, res) {
  const w = canvasWidth - 2 * margin;
  textSize(14);
  let msg;
  if (res.meets) {
    msg = 'This profile meets the ' + res.crit.split(',')[0] + ' IBS symptom criteria. A clinician would still take a history, do an exam, and order a few targeted tests.';
  } else {
    msg = 'Does not meet the symptom criteria: ' + res.firstFail.miss + '.';
    if (res.crit === CRIT_V && res.firstFail.miss.indexOf('continuous') >= 0) {
      msg += ' Constant pain points toward a different disorder of gut-brain interaction.';
    }
  }
  const h1 = wrappedHeight(msg, canvasWidth < 500 ? w - 30 : w - 20, 18) + 10; // narrow: safety margin so the last line is not clipped
  stroke(res.meets ? 'seagreen' : 'gray');
  fill(res.meets ? color(225, 245, 230) : color(240, 240, 240));
  rect(margin, y, w, h1, 6);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  text(msg, margin + 10, y + 5, w - 20, h1);

  let y2 = y + h1 + 6;
  let alarmMsg, boxCol, txtCol;
  if (res.alarm !== ALARM_NONE) {
    alarmMsg = 'Alarm feature: ' + res.alarm.charAt(0).toLowerCase() + res.alarm.slice(1) + '. This needs medical evaluation. Meeting the checklist does not rule out other diseases.';
    boxCol = color(255, 235, 205);
    txtCol = 'saddlebrown';
  } else {
    alarmMsg = 'No alarm feature selected. Alarm features (like blood in stool) always need a doctor.';
    boxCol = color(245, 250, 255);
    txtCol = 'dimgray';
  }
  const h2 = wrappedHeight(alarmMsg, w - 20, 18) + 10;
  if (y2 + h2 > drawHeight - 4) y2 = drawHeight - 4 - h2;
  stroke(res.alarm !== ALARM_NONE ? 'darkorange' : 'lightgray');
  fill(boxCol);
  rect(margin, y2, w, h2, 6);
  noStroke();
  fill(txtCol);
  text(alarmMsg, margin + 10, y2 + 5, w - 20, h2);

  // version note, if there is room
  const note = 'Rome V (May 2026) is the current version. Most published research, including the 6.1% US and 4.1% worldwide IBS figures, used Rome IV.';
  const h3 = wrappedHeight(note, w, 18);
  const y3 = y2 + h2 + 10;
  if (y3 + h3 < drawHeight - 4) {
    fill('dimgray');
    text(note, margin, y3, w, h3 + 4);
  }

  // compare the same profile across all three versions, if there is room
  let y4 = y3 + h3 + 14;
  if (y4 + 26 + 3 * 26 < drawHeight - 6) {
    fill('black');
    textSize(15);
    text('Same profile, all three versions:', margin, y4);
    y4 += 24;
    textSize(14);
    [CRIT_IV, CRIT_V, CRIT_KID].forEach(c => {
      const r = evaluate(c);
      const s = c + (r.meets ? ': meets the symptom criteria' : ': does not meet (' + r.firstFail.miss + ')');
      const hs = max(22, wrappedHeight(s, w - 30, 17));
      if (y4 + hs > drawHeight - 4) return;
      drawCheck(margin + 10, y4 + 9, r.meets);
      noStroke();
      fill('black');
      text(s, margin + 26, y4 + 1, w - 30, hs + 4);
      y4 += hs + 4;
    });
  }
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Version:', 10, drawHeight + 19);
  text('Profile:', 10, drawHeight + 49);
  text('Alarm:', 10, drawHeight + 79);
  textSize(15);
  const dy = canvasWidth < 500 ? 26 : 0;
  text('Pain days/month: ' + painSlider.value(), 10, drawHeight + 193 + dy);
  text('Months since start: ' + monthsSlider.value(), 10, drawHeight + 217 + dy);
}

// ---------- responsive ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  layoutControls();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
  drawHeight = canvasWidth < 500 ? 580 : 540;
  controlHeight = canvasWidth < 500 ? 256 : 230; // phone: stacked checkboxes (desktop unchanged)
  canvasHeight = drawHeight + controlHeight;
  containerHeight = canvasHeight;
}
