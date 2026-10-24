---
title: "Confounder Detective"
description: "Find the hidden variable: color simulated data by diet, age, and antibiotics and watch a microbiome difference between groups shrink when diet is accounted for."
image: /sims/ch13-confounder-detective/ch13-confounder-detective.png
og:image: /sims/ch13-confounder-detective/ch13-confounder-detective.png
status: implemented
---

# Confounder Detective

<iframe src="main.html" height="582px" width="100%" scrolling="no"></iframe>

[Run the Confounder Detective MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Many small studies have reported that autistic children have different gut microbiomes from non-autistic children. Does that mean autism and the microbiome are directly linked? Not necessarily. A **confounder** is a third factor that affects both things being compared. In 2021, a large study (Yap and colleagues, *Cell*) found that differences in **diet**, often linked to **selective eating**, explained most of the microbiome differences; direct links with autism were negligible.

This MicroSim lets you investigate the same logic with **simulated data**. Two groups of 40 children (an autistic group and a comparison group) have different average microbiome diversity scores. Each child also has three hidden variables: diet variety (how many kinds of food they eat), age, and recent antibiotics. You can:

- **Color the dots** by each hidden variable to look for patterns.
- **Account for** variables with a statistical adjustment and watch what happens to the gap.
- Draw a **new sample** to see how much the results change by chance.

The model was built so that group membership has no direct effect on the score. Your job is to discover which variable creates the gap.

## How to Use

1. Look at the two black average lines. Note the gap shown in the results panel.
2. Set **Color dots by** to **Age**, then **Recent antibiotics**. Do the colors explain which dots are low?
3. Set **Color dots by** to **Diet variety**. Where are the orange (few kinds of food) dots?
4. Check **Age** under Account for, then uncheck it and check **Antibiotics**. How much does the gap change?
5. Check **Diet variety**. What happens to the gap?
6. Press **New sample** several times with diet accounted for. Describe the leftover gap.

## Learning Objective

**Bloom level: Analyze.** The learner will identify how a confounding variable (diet variety) can create an apparent microbiome difference between an autistic group and a comparison group, and distinguish a confounder from variables that are balanced between groups.

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/gut-brain-textbook/sims/ch13-confounder-detective/main.html" height="582px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (biology, health science, statistics, or psychology)

**Duration:** 25 minutes

**Activity:**

1. **Warm-up (3 minutes).** Ask: "Ice cream sales and sunburns rise together. Does ice cream cause sunburn?" Discuss the hidden third factor.
2. **Detect (8 minutes).** In pairs, students follow steps 1 to 3 and write down which variable seems to line up with the low scores.
3. **Test (6 minutes).** Students follow steps 4 and 5 and record the gap for each choice in a table.
4. **Chance (3 minutes).** Students follow step 6 and explain why the leftover gap isn't exactly zero.
5. **Connect (5 minutes).** Read Section 13.5 of Chapter 13 and discuss why a confounder doesn't mean the original difference was "fake," only that it has a different explanation. Read the "What this model leaves out" box.

**Assessment questions:**

1. What makes diet variety a confounder in this model, while age is not?
2. Why does the gap shrink when diet variety is accounted for?
3. Why does the leftover gap change slightly with each new sample?
4. Why can't statistical adjustment fix a confounder that researchers never measured?

## Related Chapter

[Chapter 13: Autism, ADHD, and the Gut](../../chapters/13-autism-adhd-gut/index.md)
