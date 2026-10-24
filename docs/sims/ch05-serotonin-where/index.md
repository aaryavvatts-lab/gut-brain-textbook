---
title: "Serotonin: Where Does It Go?"
description: "Release serotonin from gut cells and feed in tryptophan from food to see which one gets past the blood-brain barrier, and what an SSRI changes."
image: /sims/ch05-serotonin-where/ch05-serotonin-where.png
og:image: /sims/ch05-serotonin-where/ch05-serotonin-where.png
status: implemented
---

# Serotonin: Where Does It Go?

<iframe src="main.html" height="572px" width="100%" scrolling="no"></iframe>

[Run the Serotonin: Where Does It Go? MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

More than 90% of the body's **serotonin** is made in the gut, mostly by **enterochromaffin (EC) cells** in the gut lining. But serotonin made in the gut does not cross the **blood-brain barrier**. The brain makes its own serotonin from **tryptophan**, an amino acid from food that can cross.

This MicroSim is a cut-away map of the body, from the gut at the bottom to the brain at the top:

- **Orange EC cells** in the gut lining release purple serotonin dots. Each dot acts on the gold nerve under the lining (sending a pulse up the vagus nerve to the brainstem), is pumped back into a lining cell by the **serotonin transporter** (SERT), or enters the blood, where **platelets** store it.
- Serotonin that reaches the **blood-brain barrier** bounces off.
- **Green tryptophan dots** from a protein meal enter the blood. Most turn gray, because most tryptophan is used by other pathways (mainly the kynurenine pathway). A few pass through transporter gates in the barrier and become serotonin inside brain neurons.
- The **SSRI** checkbox blocks SERT, the way medicines like fluoxetine do. Watch what happens to gut serotonin, platelets, and brain serotonin.

## How to Use

1. Press **Release gut serotonin**. Follow the purple dots and watch the counters. Does the "gut serotonin in brain" counter ever rise above zero?
2. Press it a few more times. Notice the gold pulses traveling up the vagus nerve: that's a nerve signal, not serotonin.
3. Press **Eat protein (tryptophan)**. Most green dots turn gray. Count how many reach the brain and become serotonin there.
4. Check **SSRI (blocks SERT)** and release gut serotonin again. Compare the nerve-signal and platelet counters with step 1.
5. Press **Reset** to clear the counters. Uncheck **Show labels** to quiz yourself on the parts.

## Learning Objective

**Bloom level: Understand.** The learner will distinguish gut (peripheral) serotonin from brain (central) serotonin by tracing where gut serotonin goes and explaining how the brain makes its own serotonin from tryptophan.

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/gut-brain-textbook/sims/ch05-serotonin-where/main.html" height="572px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (biology, anatomy and physiology, health science, or psychology)

**Duration:** 20 minutes

**Activity:**

1. **Warm-up (3 minutes).** Show students the claim "90% of your serotonin is made in your gut, so heal your gut and you'll be happy." Ask them to vote: true, false, or partly true.
2. **Explore (6 minutes).** In pairs, students run How to Use steps 1 to 3 and record every counter after three releases and two meals.
3. **SSRI test (5 minutes).** Pairs reset, check the SSRI box, repeat the three releases, and compare the counters. Which counters changed, and which never changed?
4. **Discuss (4 minutes).** Why can an SSRI cause nausea? Why does the "gut serotonin in brain" counter stay at zero? Revisit the warm-up vote.
5. **Limits (2 minutes).** Read the "What this model leaves out" box in the chapter and name one simplification.

**Assessment questions:**

1. Name the three things that can happen to serotonin released by an EC cell.
2. Why can't serotonin made in the gut raise serotonin in the brain?
3. How does the brain get the raw material to make its own serotonin?
4. Use the sim to explain why an SSRI, prescribed for the brain, can cause stomach side effects.

## Related Chapter

[Chapter 5: Chemical Messengers and the Serotonin Myth](../../chapters/05-serotonin-myth/index.md)
