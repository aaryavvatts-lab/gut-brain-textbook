---
title: "Cytokine Feedback Loop"
description: "Raise gut inflammation, cut sleep, or add stress and watch immune signals loop through the brain, sleep, mood, and back; then break one link."
image: /sims/ch04-cytokine-feedback-loop/ch04-cytokine-feedback-loop.png
og:image: /sims/ch04-cytokine-feedback-loop/ch04-cytokine-feedback-loop.png
status: implemented
---

# Cytokine Feedback Loop

<iframe src="main.html" height="612px" width="100%" scrolling="no"></iframe>

[Run the Cytokine Feedback Loop MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

When the gut is inflamed, immune cells release **cytokines**, chemical messengers such as interleukin-1 beta (IL-1β), interleukin-6 (IL-6), and tumor necrosis factor (TNF). These messages reach the brain through the vagus nerve, through small brain areas without a full blood-brain barrier, and across the barrier itself. The brain, including its immune cells (**microglia**), responds with **sickness behavior**: tiredness, poor sleep, low appetite, and low mood.

This MicroSim shows that pathway as a loop of six boxes. Red arrows carry signals forward: gut inflammation to cytokines, cytokines to the brain, and the brain to sleep problems and low mood. Purple arrows carry feedback: in human studies, poor sleep is linked to slightly higher inflammation markers, stress raises some cytokines, and in people with IBD high stress is linked to more symptom flares (an association, not proof of cause). So sleep problems and stress push signal back into the start of the loop, and stress pushes on both the cytokine box and the gut inflammation box. Boxes fill with color and arrows thicken as signals grow, and a meter in the middle shows the overall loop strength.

The link menu lets you break one part of the loop: treat the gut inflammation, protect sleep, or manage stress.

## How to Use

1. Leave the defaults (gut inflammation 2, sleep 8 hours, stress 3) and press **Start**. Notice that the loop stays fairly quiet.
2. Drag **Gut inflammation** to 8, as in a flare. Watch the cytokine box light up first, then the brain, then sleep problems and low mood. Record the loop strength.
3. Drop **Sleep** to 5 hours and raise **Life stress** to 8. The loop grows stronger even though you didn't change the gut slider. Why?
4. Use the link menu to choose **Treat gut inflammation**, then **Protect sleep**, then **Manage stress**. Wait for the meter to settle each time and record the loop strength.
5. Press **Reset** to return to the starting settings.

## Learning Objective

**Bloom level: Understand (with Analyze).** The learner will explain immune-to-brain signaling as a feedback loop linking gut inflammation, cytokines, the brain, sleep, mood, and stress, and analyze why breaking any one link weakens the whole loop.

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/gut-brain-textbook/sims/ch04-cytokine-feedback-loop/main.html" height="612px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (biology, anatomy and physiology, health science, or psychology)

**Duration:** 20 to 25 minutes

**Activity:**

1. **Warm-up (3 minutes).** Ask: "Why do you feel sad and tired when you have the flu, not just stuffy?" Collect a few ideas.
2. **Explore (7 minutes).** In pairs, students run How to Use steps 1 to 3 and record the loop strength at each setting.
3. **Break the loop (7 minutes).** Pairs test each option in the link menu with gut inflammation at 8 and rank them by effect. Then they repeat with gut inflammation at 0, sleep at 5 hours, and stress at 8, and compare the rankings.
4. **Discuss (5 minutes).** Why does treating inflammation help most in a flare, while protecting sleep or managing stress matter more when the gut is calm? Connect this to Riya's fatigue after a flare in Chapter 4.
5. **Limits (3 minutes).** Read the "What this model leaves out" box in the chapter and name one way the real body differs from the model.

**Assessment questions:**

1. Name the three cytokines in the model and describe one route they use to reach the brain.
2. What makes a loop "reinforcing"? Use one feedback arrow from the model as an example.
3. Why can someone still feel tired after gut inflammation is treated?
4. The model's weights are made up. What kind of human study would you need to measure how strongly sleep affects inflammation?

## Related Chapter

[Chapter 4: The Immune System as a Sense Organ](../../chapters/04-immune-sense-organ/index.md)
