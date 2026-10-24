---
title: "HPA Axis Stress Dial"
description: "Dial up stress, watch CRH, ACTH, and cortisol rise, and see how negative feedback resets the system after acute stress but not chronic stress, along with gut effects."
image: /sims/ch07-hpa-stress-dial/ch07-hpa-stress-dial.png
og:image: /sims/ch07-hpa-stress-dial/ch07-hpa-stress-dial.png
status: implemented
---

# HPA Axis Stress Dial

<iframe src="main.html" height="652px" width="100%" scrolling="no"></iframe>

[Run the HPA Axis Stress Dial MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

When you face a stressor, your **hypothalamus** releases **CRH**, which tells the **pituitary gland** to release **ACTH**, which tells the **adrenal glands** to release **cortisol**. This chain is the **HPA axis**. Cortisol then acts back on the hypothalamus and pituitary to turn CRH and ACTH down. That **negative feedback** is the stress system's off switch.

This MicroSim shows the three glands as linked boxes that turn from green to red as their hormone rises, with a dashed blue arrow for negative feedback. A gut panel shows three effects of stress signaling: **colon movement** (CRH speeds up the colon), **gut sensitivity**, and **gut permeability** (both driven by mast cell activation and CRH in the model, not by cortisol directly). A graph plots CRH, ACTH, and cortisol over 96 illustrative hours, with the stressor shaded.

You can choose **one stressful event (acute)**, a 2-hour stressor like a big exam, or **stress every day (chronic)**, 12 stressful hours each day. You can also switch cortisol feedback off to see what the off switch does.

## How to Use

1. Leave the settings at their defaults (stress level 6, one stressful event, feedback on). Predict which hormone rises first. Press **Start**.
2. Watch the order in the graph: CRH, then ACTH, then cortisol. Watch the colon wiggle faster while the stressor is on, and notice how the levels fall back after it ends.
3. Uncheck **Cortisol feedback on** and press **Start** again when the run ends. Compare the peak and the recovery time.
4. Turn feedback back on and choose **Stress every day (chronic)**. Watch the low points between stressful days and the gut sensitivity meter.
5. Try stress levels of 3 and 9 with each pattern.
6. Press **Reset** to return to the starting settings.

## Learning Objective

**Bloom level: Understand.** The learner will explain how cortisol's negative feedback returns the HPA axis to baseline after acute stress but not during repeated (chronic) stress, and describe the gut changes that accompany stress signaling.

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/gut-brain-textbook/sims/ch07-hpa-stress-dial/main.html" height="652px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (biology, anatomy and physiology, psychology, or health science)

**Duration:** 25 to 30 minutes

**Activity:**

1. **Warm-up (3 minutes).** Ask: "Where in your body do you feel stress before a big test?" List answers and circle the ones in the gut.
2. **Explore the chain (7 minutes).** Students run How to Use steps 1 and 2 and sketch the order in which the three hormones rise and fall.
3. **Test the off switch (6 minutes).** Students compare runs with feedback on and off and write one sentence explaining the difference using the words "negative feedback."
4. **Acute versus chronic (6 minutes).** Students run the chronic pattern and describe what happens to the low points and to gut sensitivity across days.
5. **Connect and limit (5 minutes).** Discuss why Sam's stomach reacts before races, then read the "What this model leaves out" box in Chapter 7 and name one thing the model ignores (for example, cortisol's daily rhythm).

**Assessment questions:**

1. Name the three glands of the HPA axis and the hormone each one releases.
2. Why does cortisol fall back to rest after a single stressful event when feedback is on?
3. What changes in the graph when the stress pattern is chronic, and why?
4. Which gut effect in the model responds fastest to stress, and which builds up slowly?

## Related Chapter

[Chapter 7: Stress and the Gut](../../chapters/07-stress-and-the-gut/index.md)
