---
title: "IBD Flare Timeline"
description: "Place treatment and life events on a 12-month timeline and see how gut inflammation, symptoms, energy, and mood respond in an illustrative model of Crohn's disease."
image: /sims/ch09-ibd-flare-timeline/ch09-ibd-flare-timeline.png
og:image: /sims/ch09-ibd-flare-timeline/ch09-ibd-flare-timeline.png
status: implemented
---

# IBD Flare Timeline

<iframe src="main.html" height="642px" width="100%" scrolling="no"></iframe>

[Run the IBD Flare Timeline MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Inflammatory bowel disease (IBD) has ups and downs. A **flare** is a time when the disease is active and causes symptoms; **remission** is a time when symptoms fade. This MicroSim follows one fictional teen with Crohn's disease for 12 months after diagnosis and draws four curves on the same chart:

- **Gut inflammation** (red): how active the immune attack in the gut wall is.
- **Symptoms** (orange): belly pain, diarrhea, and urgency.
- **Energy** (blue): how much energy the teen has for school, music, and friends.
- **Mood** (purple): higher means a better mood.

You can add five kinds of events at any month: **Start steroids** (S), **Start biologic** (B), **Missed biologic doses** (M), **Gut infection** (I), and **Stressful exam week** (X). Each event changes the curves in its own way. Steroids calm symptoms within days but are only a short-term bridge. A biologic builds up over weeks and keeps inflammation down. Missed doses let the medicine fade, and inflammation creeps back weeks later. An infection raises inflammation and symptoms for a few weeks. Exam stress raises symptoms and lowers mood, but the model does not let it change inflammation, because the evidence that stress drives gut inflammation in people is unclear.

The green band is a "healing zone," where inflammation is low enough for the gut lining to heal. This is an illustrative teaching model on a 0 to 100 scale. It is **not** a prediction for any real person.

## How to Use

1. Look at the starting plan: steroids just after diagnosis (S), then a biologic at month 1 (B). Predict which curve will drop first. Press **Start** to move the black playhead through the year and read the values in the panel.
2. Compare the orange symptom curve with the red inflammation curve in the first two months. Which one falls faster, and why might that matter?
3. Choose **Missed biologic doses** in the Event menu, set the Month slider to 6, and press **Add event**. Notice how long it takes for inflammation to climb and how energy and mood follow.
4. Add a **Stressful exam week** at month 10. Which curves change, and which one does not?
5. Press **Clear events** to see a year with no treatment at all. Then add only a biologic and compare.
6. Press **Reset** to return to the starting plan.

## Learning Objective

**Bloom level: Analyze.** The learner will relate gut inflammation, symptoms, energy, and mood over time in IBD, and analyze how treatment events (steroids, a biologic, missed doses) and other events (an infection, a stressful week) change each curve differently.

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/gut-brain-textbook/sims/ch09-ibd-flare-timeline/main.html" height="642px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (biology, health science, or anatomy and physiology)

**Duration:** 25 to 30 minutes

**Activity:**

1. **Warm-up (3 minutes).** Ask: "If someone with Crohn's disease feels better, does that mean their gut has healed?" Students write a prediction.
2. **Explore (8 minutes).** In pairs, students run the starting plan and record the month when symptoms first drop below 25 and the month when inflammation first enters the healing zone.
3. **Test an event (8 minutes).** Each pair adds one event (missed doses, infection, or exam stress) and sketches how each of the four curves changes. Pairs report back.
4. **Discuss (6 minutes).** Why does inflammation return weeks after doses are missed, not the same day? Why might someone feel fine while inflammation is still present? Connect to mucosal healing and to why doctors keep treatment going in remission.
5. **Limits (3 minutes).** Read the "What this model leaves out" box in Chapter 9 and name one way a real person's year would look different.

**Assessment questions:**

1. In the model, which falls faster after treatment starts, symptoms or inflammation? Give one reason a doctor would still check inflammation directly.
2. Why do steroids appear only as a short course on the timeline?
3. What happens to inflammation after missed biologic doses, and how long does it take to show?
4. The exam-stress event changes symptoms and mood but not inflammation. Why did the model's designer make that choice?

## Related Chapter

[Chapter 9: Inflammatory Bowel Disease: Ulcerative Colitis and Crohn's](../../chapters/09-inflammatory-bowel-disease/index.md)
