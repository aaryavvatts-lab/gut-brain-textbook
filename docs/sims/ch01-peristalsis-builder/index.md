---
title: "Peristalsis Builder"
description: "Switch the enteric nervous system on, off, or missing at the end of the gut and watch the peristaltic reflex push food along, or fail."
image: /sims/ch01-peristalsis-builder/ch01-peristalsis-builder.png
og:image: /sims/ch01-peristalsis-builder/ch01-peristalsis-builder.png
status: implemented
---

# Peristalsis Builder

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run the Peristalsis Builder MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Food does not slide through your intestines by gravity. It is pushed by **peristalsis**, a wave of muscle squeezing that travels along the gut. The wave is run by the **enteric nervous system** (ENS), the network of neurons inside the gut wall. When food stretches the wall, stretch-sensing enteric neurons trigger a local reflex: the muscle **squeezes behind** the food and **relaxes ahead** of it. This is the **peristaltic reflex**, and it works even when the gut is cut off from the brain.

This MicroSim shows a section of gut as a tube with a brown ball of food (a bolus) inside. Gold dots stand for enteric neurons. You can switch the ENS to three settings:

- **Working everywhere:** the reflex fires and the food travels to the end.
- **Missing at the end (like Hirschsprung disease):** the last part of the tube has no enteric neurons. It stays squeezed and cannot relax, so food stalls at its edge and material backs up behind it.
- **Switched off everywhere:** pacemaker ripples from interstitial cells of Cajal continue, but with no reflex, the food does not move.

## How to Use

1. Leave the ENS on **Working everywhere**. Predict: will the food reach the anus side? Press **Start**.
2. Watch the red "squeeze" zone behind the food and the green "relax" zone ahead of it. Notice that the gold neuron dots near the food light up.
3. Drag **Stretch sensitivity** down to 4 or lower. The stretch signal falls below the trigger level and the food stops. Drag it back up and compare the **Last trip** time at 6 and at 10.
4. Choose **Missing at the end (like Hirschsprung)**. Predict where the food will stop, then watch. Notice that the tube swells behind the blockage.
5. Choose **Switched off everywhere** and watch what the ripples alone can do.
6. Press **Reset** to return to the starting settings.

## Learning Objective

**Bloom level: Understand.** The learner will explain how the peristaltic reflex moves food as a local circuit of the enteric nervous system (stretch, then contraction behind and relaxation ahead), and predict why food stalls where enteric neurons are missing.

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/gut-brain-textbook/sims/ch01-peristalsis-builder/main.html" height="522px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (biology, anatomy and physiology, or health science)

**Duration:** 20 to 25 minutes

**Activity:**

1. **Warm-up (3 minutes).** Ask: "If your gut were disconnected from your brain, would food still move?" Have students write a yes or no and one reason.
2. **Explore (8 minutes).** In pairs, students run steps 1 to 3 of How to Use and record the Last trip time at sensitivity 4, 6, 8, and 10 (press Reset before each run, and record "no trip" if the food never arrives).
3. **Predict and test (6 minutes).** Before switching to the Hirschsprung setting, each pair sketches where they think the food will stop. Then they test it.
4. **Discuss (5 minutes).** Why does the tube swell behind the no-neuron segment? Connect this to the swollen belly of a newborn with Hirschsprung disease in Chapter 1.
5. **Limits (3 minutes).** Read the "What this model leaves out" box in the chapter and name one thing the sim gets wrong about a real gut.

**Assessment questions:**

1. What triggers the peristaltic reflex, and what two muscle responses does it produce?
2. Why is relaxation ahead of the food just as important as contraction behind it?
3. In the Hirschsprung setting, the brain and spinal cord are still connected to the gut. Why does the food still stall?
4. The interstitial cells of Cajal keep making slow waves when the ENS is switched off. Why is that not enough to move food?

## Related Chapter

[Chapter 1: The Brain in Your Belly (and Why That Phrase Is Misleading)](../../chapters/01-brain-in-your-belly/index.md)
