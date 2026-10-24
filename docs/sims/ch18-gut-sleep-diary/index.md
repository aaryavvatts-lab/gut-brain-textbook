---
title: "Gut and Sleep Diary"
description: "Log a week of sleep, stress, and gut symptoms (or explore a sample week), see the correlation, and learn why a week of personal data can't prove cause."
image: /sims/ch18-gut-sleep-diary/ch18-gut-sleep-diary.png
og:image: /sims/ch18-gut-sleep-diary/ch18-gut-sleep-diary.png
status: implemented
---

# Gut and Sleep Diary

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Gut and Sleep Diary MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Many people with IBS or inflammatory bowel disease notice that their gut feels worse after a bad night. Keeping a diary, which scientists call **self-monitoring**, can help you spot patterns and give your care team useful information. But a diary can also fool you.

This MicroSim is a one-week diary for three things: **hours of sleep**, a **stress** rating (0 to 10), and a **gut symptom** rating (0 to 10). It opens with **sample data**, a made-up week for Sam, a fictional student with IBS from the textbook. The top chart shows sleep as blue bars and gut symptoms as an orange line. The scatter plot below compares sleep with gut symptoms for each day, and the panel reports the **correlation coefficient r**, a number from -1 to 1 that describes how closely two things move together.

The panel always warns you about the **small sample** (only up to 7 days), and it shows a **confounder alert** when stress rises and falls with both sleep and gut symptoms, because stress could be the real driver of both.

**Privacy:** everything you enter stays in this page's memory. Nothing is saved to your device or sent anywhere, and reloading the page erases it.

## How to Use

1. Look at the sample week. Which day had the least sleep, and what happened to the gut score that day?
2. Read the r value in the panel. Is the correlation positive or negative? What does that mean in words?
3. Check **Show stress line**. Notice that stress peaks on the same day sleep is lowest. Read the confounder alert.
4. Choose **Wed** in the Day menu and drag the **gut** slider from 7 down to 2. Watch how much r changes because of one day.
5. Press **Clear all** and enter a week of your own (real or imaginary). The sim needs at least 3 logged days with some variety before it can compute r.
6. Press **Load sample data** to return to Sam's week.

## Learning Objective

**Bloom level: Evaluate.** The learner will interpret the correlation between sleep and gut symptoms in a one-week diary and judge the limits of that personal data, including small sample size, confounders such as stress, and the possibility that the effect runs in the reverse direction.

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/gut-brain-textbook/sims/ch18-gut-sleep-diary/main.html" height="602px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (biology, health science, psychology, or statistics)

**Duration:** 25 to 30 minutes

**Activity:**

1. **Warm-up (3 minutes).** Ask: "If you sleep badly and then feel sick the next day, did the bad sleep cause it?" Collect a few answers.
2. **Explore (7 minutes).** In pairs, students run steps 1 to 3 of How to Use and write one sentence describing the sleep-gut pattern in Sam's sample week.
3. **Stress-test the pattern (7 minutes).** Students run step 4, then try to make r close to zero by changing as few days as possible. Record how many days they changed.
4. **Discuss (6 minutes).** Name three explanations for the pattern other than "short sleep causes gut symptoms" (for example, stress as a confounder, gut pain waking Sam up, or expectations shaping his ratings).
5. **Design (5 minutes).** Each pair writes a better four-week plan for testing whether sleep matters for Sam's gut, using the "What this model leaves out" box in Chapter 18.

**Assessment questions:**

1. In Sam's sample week, r for sleep vs gut symptoms is strongly negative. Explain what that means in plain words.
2. Why does the sim show a confounder alert, and what would you need to know to rule stress out?
3. Changing one day can change r a lot. What does that tell you about one week of data?
4. Give one reason a correlation in a personal diary might run in the opposite direction from what you expect.

## Related Chapter

[Chapter 18: Sleep, Exercise, and Therapy](../../chapters/18-sleep-exercise-therapy/index.md)
