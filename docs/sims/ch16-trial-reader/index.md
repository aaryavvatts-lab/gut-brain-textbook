---
title: "Probiotic Trial Reader"
description: "Run pretend probiotic trials and see how trial size, the number of outcomes measured, and a placebo group change how big and how trustworthy the results look."
image: /sims/ch16-trial-reader/ch16-trial-reader.png
og:image: /sims/ch16-trial-reader/ch16-trial-reader.png
status: implemented
---

# Probiotic Trial Reader

<iframe class="tall-ch16-trial-reader" src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the Probiotic Trial Reader MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Supplement ads love to quote "a clinical study." But one study can be misleading, especially a small one. This MicroSim imagines a made-up probiotic with a **small true effect** (an effect size of 0.2, shown by the dashed green line). Each time you run a trial, the sim adds random chance, the way real trials do, and plots the result the trial would report as one dot.

You control three parts of the trial design:

- **People per group:** small trials scatter widely; big trials land close to the truth.
- **Outcomes measured:** each trial reports its *best-looking* outcome, the way an ad might. Measuring more outcomes makes chance "wins" more likely, which is why good trials name one **primary outcome** in advance.
- **Placebo group:** without a comparison group, the improvement people show just from taking something (the placebo response) gets counted as if the probiotic caused it.

Orange dots are results that would look "impressive" (statistically significant) in a headline.

## How to Use

1. Look at the 20 example trials (30 people per group, 1 outcome, placebo group on). Notice how widely the dots scatter around the true effect.
2. Press **Run 20** a few more times. Watch the share of "impressive" results and the average reported effect.
3. Press **Clear**, set **People per group** to 300, and run 20 trials. Predict first: will the dots spread out or bunch up?
4. Press **Clear**, set people per group back to 30, and set **Outcomes measured** to 10. Run 20 trials and compare the average reported effect with the true effect.
5. Press **Clear**, uncheck **Placebo group**, and run 20 trials. What happens to the reported effect?
6. Decide which settings look most like a typical supplement study, and which look like a trial you would trust.

## Learning Objective

**Bloom level: Evaluate.** The learner will judge how trial size, the number of outcomes measured, and the presence of a placebo group change how much confidence a reported probiotic result deserves.

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/gut-brain-textbook/sims/ch16-trial-reader/main.html" height="562px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (biology, health science, statistics, or psychology)

**Duration:** 20 to 30 minutes

**Activity:**

1. **Warm-up (3 minutes).** Show a real supplement ad that says "clinically proven." Ask: "What would you want to know about that study?"
2. **Explore size (8 minutes).** In pairs, students run 20 trials at 20, 60, and 300 people per group and record the share of "impressive" results and the average reported effect.
3. **Explore outcomes and placebo (8 minutes).** Students repeat at 30 people per group with 1, 5, and 10 outcomes, then with the placebo group off.
4. **Discuss (6 minutes).** Why does reporting the best of many outcomes inflate results? Connect this to the Rahmannia 2024 review in Chapter 16, where one of four depression scales showed a benefit.
5. **Limits (3 minutes).** Read the "What this model leaves out" box in the chapter and name one way real trials differ from the sim.

**Assessment questions:**

1. Why do small trials sometimes report large effects even when the true effect is small?
2. How does naming a primary outcome in advance protect against chance findings?
3. What does a placebo group add to a trial, and what goes wrong without one?
4. A supplement ad cites one trial of 20 people that measured 8 outcomes. How confident should you be in its "best" result, and why?

## Related Chapter

[Chapter 16: Probiotics, Prebiotics, and "Psychobiotics"](../../chapters/16-probiotics-psychobiotics/index.md)
