---
title: "Diet Pattern Explorer"
description: "Study 200 simulated people to see how hidden factors can create a link between diet and mood, and how a randomized trial removes that confounding."
image: /sims/ch15-diet-pattern-explorer/ch15-diet-pattern-explorer.png
og:image: /sims/ch15-diet-pattern-explorer/ch15-diet-pattern-explorer.png
status: implemented
---

# Diet Pattern Explorer

<iframe src="main.html" height="632px" width="100%" scrolling="no"></iframe>

[Run the Diet Pattern Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Headlines often say a food is "linked to" mood. This MicroSim shows why a link is not the same as a cause. It creates 200 **simulated** people, each with a diet quality score and a low-mood score (higher means more symptoms). All the numbers are made up.

You control two things real scientists never know for sure:

- **The true effect of diet on mood**, from none to strong.
- **Which hidden factors exist:** food access (money and nearby stores), sleep, and earlier low mood that changes what people eat (reverse causation).

In an **observational study**, people's diets come from their own lives, so hidden factors can push diet and mood together. In a **randomized trial**, a coin flip decides who gets diet coaching, which spreads the hidden factors evenly between the groups.

## How to Use

1. Start in **Observational study** with the true effect at **none** and all three hidden factors checked. Read the correlation r. Is there a link?
2. Uncheck the hidden factors one at a time. Watch the correlation shrink. Which factor creates the strongest fake link?
3. Check them all again and switch to **Randomized trial**. Compare the two groups' average low-mood scores.
4. Raise the **True effect of diet** slider. How does each design respond?
5. Press **New sample** several times in trial mode. Notice how much the difference wobbles by chance.

## Learning Objective

**Bloom level: Analyze.** The learner will distinguish association from causation in nutrition research by showing that hidden factors can create a diet-mood correlation even when diet has no true effect, and that random assignment removes that confounding.

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/gut-brain-textbook/sims/ch15-diet-pattern-explorer/main.html" height="632px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (biology, health, psychology, or statistics)

**Duration:** 20 to 30 minutes

**Activity:**

1. **Warm-up (3 minutes).** Show a headline such as "Ultra-processed food linked to depression." Ask students to list three possible explanations for the link.
2. **Explore (8 minutes).** In pairs, students follow steps 1 and 2 of How to Use and record the correlation with each hidden factor on by itself.
3. **Compare designs (7 minutes).** Students switch to the randomized trial with the true effect at none, then at medium, and record the group difference each time, pressing New sample three times for each setting.
4. **Discuss (6 minutes).** Why does the coin flip remove the fake link? Why does the trial's answer still wobble? Connect to the SMILES trial in Chapter 15, which had only 56 people with complete data.
5. **Limits (3 minutes).** Read the "What this model leaves out" box and name one way real diet trials are messier than the sim.

**Assessment questions:**

1. With the true effect at none, why does observational mode still show a correlation?
2. What does "Low mood changes eating" represent, and which direction does its arrow point?
3. Why does random assignment balance hidden factors even when researchers don't measure them?
4. Why might a small trial give a misleading answer even though it is randomized?

## Related Chapter

[Chapter 15: Food and Mood](../../chapters/15-food-and-mood/index.md)
