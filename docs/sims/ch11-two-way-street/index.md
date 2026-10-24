---
title: "The Two-Way Street"
description: "Simulate 500 fictional people and see why gut-to-brain effects, brain-to-gut effects, or a shared cause can all produce the same gut-mood correlation."
image: /sims/ch11-two-way-street/ch11-two-way-street.png
og:image: /sims/ch11-two-way-street/ch11-two-way-street.png
status: implemented
---

# The Two-Way Street

<iframe src="main.html" height="622px" width="100%" scrolling="no"></iframe>

[Run The Two-Way Street MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

People with gut conditions such as IBD and IBS report more anxiety and depression symptoms than other people. But a link between two things doesn't tell you which one causes the other. Gut symptoms could worsen mood (gut to brain), mood could worsen gut symptoms (brain to gut), both could happen, or a third factor, such as poor sleep or a hard life event, could worsen both.

This MicroSim follows a simulated cohort of 500 fictional people. Each dot is one person, placed by their gut-symptom score (left to right) and mood-symptom score (bottom to top). Three sliders set the hidden rules: how strongly gut symptoms change later mood, how strongly mood changes later gut symptoms, and how strongly a shared third factor affects both.

The bars compare two ways of studying the cohort:

- **One snapshot:** the correlation between gut and mood symptoms measured at the same moment (like a cross-sectional survey).
- **Following people over time:** the correlation between earlier gut symptoms and later mood, and between earlier mood and later gut symptoms (like a cohort study).

All numbers are made up for teaching. The sim is not data from any real study.

## How to Use

1. Start with the default settings (gut to brain 0.30, brain to gut 0). Note the snapshot correlation and the two "earlier, later" bars.
2. Now set gut to brain to 0 and brain to gut to 0.30. Compare the snapshot bar with step 1. Can a single snapshot tell you which direction is at work?
3. Look at the two "earlier, later" bars. Which one is longer now? What does that tell you?
4. Set both directions to 0.15. What happens to the snapshot and to the two time bars?
5. Set both directions to 0 and the shared third factor to 0.30. Is there still a correlation? Can following people over time tell you the direction this time?
6. Press **Start** to watch the cohort change over time, and **New cohort** to repeat the experiment with a different group of fictional people.

## Learning Objective

**Bloom level: Analyze.** The learner will explain why a gut-to-brain effect, a brain-to-gut effect, and a shared confounding variable can each produce a similar correlation at one time point, and analyze how following people over time helps separate the direction of effects (reverse causation) but cannot by itself rule out confounding.

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/gut-brain-textbook/sims/ch11-two-way-street/main.html" height="622px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (biology, psychology, statistics, or health science)

**Duration:** 25 to 30 minutes

**Activity:**

1. **Warm-up (3 minutes).** Show the headline "About a third of people with IBD have anxiety symptoms." Ask: "Does the gut cause the anxiety, does anxiety cause the gut problems, or something else?" Students write a guess.
2. **Explore (10 minutes).** In pairs, students run How to Use steps 1 to 3 and record the three bar values for each setting in a table.
3. **Analyze (7 minutes).** Students run steps 4 and 5 and answer: Which study design (snapshot or following over time) could tell these settings apart? Which setting fools both designs?
4. **Connect (5 minutes).** Discuss the real 12-year Australian cohort study and the 2-year IBD cohort study from Chapter 11, which found evidence for both directions.
5. **Limits (3 minutes).** Read the "What this model leaves out" box in the chapter and name one way real people differ from the simulated cohort.

**Assessment questions:**

1. Why can't a single survey of gut and mood symptoms show which one causes the other?
2. What is reverse causation, and how does following people over time help detect it?
3. Why can a shared third factor fool even a study that follows people over time?
4. If a real study finds that gut problems predict later anxiety and anxiety predicts later gut problems, what does that suggest?

## Related Chapter

[Chapter 11: Anxiety, Depression, and the Gut](../../chapters/11-anxiety-depression-gut/index.md)
