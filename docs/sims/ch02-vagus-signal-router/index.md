---
title: "Vagus Signal Router"
description: "Trigger a meal, fat arriving, gut inflammation, or a stressful thought and watch signals travel up and down the vagus nerve and the spinal route."
image: /sims/ch02-vagus-signal-router/ch02-vagus-signal-router.png
og:image: /sims/ch02-vagus-signal-router/ch02-vagus-signal-router.png
status: implemented
---

# Vagus Signal Router

<iframe class="tall-ch02-vagus-signal-router" src="main.html" height="662px" width="100%" scrolling="no"></iframe>

[Run the Vagus Signal Router MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

The **vagus nerve** is a two-way highway between the gut and the brainstem. **Afferent** fibers carry news up to the brain (stretch, nutrients, hormones, inflammation), and **efferent** fibers carry commands down to the gut. Classic fiber counts in animals suggest that about 80% of vagus fibers are afferent, so most of the traffic runs uphill.

This MicroSim shows a stylized body with the brain, the brainstem (with the **nucleus tractus solitarius**, NTS, where sensory signals arrive, and the **dorsal motor nucleus**, DMV, where motor signals leave), the **nodose ganglion**, the vagus nerve, and the gut. A second, separate path shows the **spinal nerves**, which carry many gut sensations, including much of gut pain, and the sympathetic (fight-or-flight) signals that slow digestion.

- **Teal pulses** are afferent signals traveling up.
- **Coral pulses** are efferent vagal signals traveling down; **orange pulses** on the spinal path are sympathetic signals.
- The **fiber bundle** in the panel shows 8 of 10 fibers as sensory.
- The **Cut the vagus (vagotomy)** checkbox blocks the vagus in both directions so you can see what still gets through.

## How to Use

1. Press **Meal stretches stomach**. Watch teal pulses rise to the NTS, then coral pulses leave the DMV and travel back down. This is the vago-vagal reflex that relaxes the upper stomach.
2. Press **Fat arrives (CCK)**. The gold sensor cell releases CCK, and afferent pulses carry a satiety signal up.
3. Press **Gut inflammation** and notice that both the vagus and the spinal route light up.
4. Press **Stressful thought**. This one starts in the brain: vagal output dips and sympathetic signals travel down the spinal route.
5. Compare the **Signals up** and **Signals down** counters after several events.
6. Check **Cut the vagus (vagotomy)** and repeat each event. Predict which signals still reach the brain before you press.
7. Press **Reset** to clear the counters.

## Learning Objective

**Bloom level: Analyze.** The learner will compare afferent (gut-to-brain) and efferent (brain-to-gut) vagus signaling across four everyday events, and contrast the vagal route with the spinal route.

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/gut-brain-textbook/sims/ch02-vagus-signal-router/main.html" height="662px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (biology, anatomy and physiology, or health science)

**Duration:** 20 to 25 minutes

**Activity:**

1. **Warm-up (3 minutes).** Ask: "When you feel full, which way is the signal traveling, from gut to brain or brain to gut?" Students write a prediction.
2. **Explore (8 minutes).** In pairs, students trigger each event three times and record the Signals up and Signals down counters in a table.
3. **Compare (5 minutes).** Students compare their up-to-down ratio with the 8-of-10 fiber bundle and explain why most vagus traffic is sensory.
4. **Predict and test (5 minutes).** Before checking "Cut the vagus," each pair predicts which events will still reach the brain. Then they test it and connect the result to the vagotomy case in Chapter 2.
5. **Limits (3 minutes).** Read the "What this model leaves out" box in the chapter and name one way the sim is simpler than a real nerve.

**Assessment questions:**

1. What is the difference between an afferent and an efferent signal? Give one example of each from the sim.
2. Why does the meal event send signals down only after signals arrive at the NTS?
3. After the vagus is cut, which events can still reach the brain, and by what route?
4. Why can't the sim's counters tell you the true percentage of sensory fibers in a human vagus nerve?

## Related Chapter

[Chapter 2: The Vagus Highway](../../chapters/02-vagus-highway/index.md)
