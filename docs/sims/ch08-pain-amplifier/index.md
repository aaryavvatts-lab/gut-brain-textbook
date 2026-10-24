---
title: "Pain Amplifier"
description: "Keep a gut stretch the same and change peripheral sensitivity, central gain, and the brain's descending control to see how the felt pain changes."
image: /sims/ch08-pain-amplifier/ch08-pain-amplifier.png
og:image: /sims/ch08-pain-amplifier/ch08-pain-amplifier.png
status: implemented
---

# Pain Amplifier

<iframe src="main.html" height="612px" width="100%" scrolling="no"></iframe>

[Run the Pain Amplifier MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Pain is not a simple readout of what is happening in the gut. A stretch of the gut wall is picked up by sensory nerve endings, passes through a **dorsal root ganglion**, enters the **dorsal horn** of the spinal cord, and travels up to the **thalamus** and on to brain areas such as the **insula** and **anterior cingulate cortex**. Along the way, the signal can be turned up or down.

This MicroSim lets you hold the gut stretch steady and change three "dials":

- **Peripheral sensitivity:** how strongly the nerve endings in the gut respond, for example when the gut is inflamed (peripheral sensitization).
- **Central gain:** how much the dorsal horn boosts the incoming signal (central sensitization).
- **Brain state:** descending signals from the brain that turn spinal pain signals down (calm) or up (stressed).

The meter on the right shows felt pain on a 0 to 10 scale. A navy marker shows what a "typical body" (all dials at their starting values) would feel from the same stretch. All numbers are made-up teaching values.

## How to Use

1. Press **Start** to watch signal dots travel from the gut to the brain. Leave the gut stretch at 6 and note the felt pain.
2. Drag **Gut stretch** down to 3. The signal still travels, but it stays below the pain threshold: the stretch is sensed, not felt as pain.
3. Set the stretch back to 6. Raise **Peripheral sensitivity** to 2x. Compare the felt pain with the navy "typical body" marker.
4. Reset. Now raise only **Central gain** to 2x. Does it matter whether the boost happens in the gut or in the spinal cord?
5. With central gain still raised, move **Brain state** to "very calm," then to "very stressed." Watch the descending line change color.
6. Find two different dial settings that give the same felt pain. What does that tell you about guessing a cause from a pain score?

## Learning Objective

**Bloom level: Understand and Analyze.** The learner will explain how peripheral sensitization, central sensitization, and descending modulation can change the pain felt from the same gut stimulus, and analyze why a pain score alone cannot reveal where the signal was amplified.

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/gut-brain-textbook/sims/ch08-pain-amplifier/main.html" height="612px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (biology, anatomy and physiology, psychology, or health science)

**Duration:** 20 to 25 minutes

**Activity:**

1. **Warm-up (3 minutes).** Ask: "If two people have the same amount of gas in their gut, should they feel the same amount of pain?" Students write a prediction and one reason.
2. **Explore (8 minutes).** In pairs, students follow How to Use steps 1 to 4 and record the felt pain for each setting in a table.
3. **Analyze (6 minutes).** Each pair finds two different combinations of dials that give the same felt pain (step 6) and explains what this means for a doctor who only hears a pain score.
4. **Discuss (5 minutes).** Connect the "very stressed" setting to Sam's pain before races and the peripheral sensitivity dial to Riya's pain during a Crohn's flare (Chapter 8).
5. **Limits (3 minutes).** Read the "What this model leaves out" box in the chapter and name one way real pain is more complicated than three dials.

**Assessment questions:**

1. Why can the same gut stretch produce different amounts of pain in two people?
2. What is the difference between peripheral sensitization and central sensitization?
3. How can the brain turn pain signals down, and what can weaken that control?
4. A friend says, "If your tests are normal, the pain must be imaginary." Use the sim to explain why that is wrong.

## Related Chapter

[Chapter 8: Pain, Sensitivity, and the Gut](../../chapters/08-pain-and-sensitivity/index.md)
