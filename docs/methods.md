---
title: How This Book Was Made
description: The full method behind Gut Check: who decided what, how AI was used, how every claim was checked, and how the Hype Meter grades evidence.
image: img/cover.png
---

# How This Book Was Made

This page explains exactly how *Gut Check* was built and checked, so that any reader, teacher, or reviewer can judge it. Being open about the method is part of being trustworthy.

## Who decided what

**The author (Aaryav Sharma)** chose the topic, after a family member's experience with ulcerative colitis, and approved the plan for the book: its audience, its 20-chapter structure, the Hype Meter, the fictional cases with Riya and Sam, the mascot, and the safety rules (no medical advice, crisis resources, respectful language about autism and ADHD).

**AI tools did most of the research, drafting, and checking work.** The book was built with Claude Code (an AI system from Anthropic) and Dan McCreary's open-source [intelligent-textbook skills](https://github.com/dmccreary/ibook-skills). Separate AI agents researched sources, drafted chapters and simulations, and then checked each other's work in independent rounds, following written rules the author approved.

**No outside expert has reviewed the book yet.** Reviews by physicians, researchers, and community members will be posted on the [Impact and Reviews](impact.md) page as they happen.

## The checking layers

| Layer | What happened |
|---|---|
| **1. Sources first** | Before writing, about 300 sources were opened and logged, each with the exact claim it supports and its strength of evidence. Popular "facts" that failed (such as "70% of your immune system is in your gut") were flagged before any chapter used them. |
| **2. Writing with a fact log** | Each chapter's writer logged every number, date, name, approval, and study against a page they had opened, and removed anything they couldn't confirm. |
| **3. Independent fact-check** | A different reviewer re-checked every chapter's facts, quiz answers, links, and simulation. |
| **4. Expert subject edit** | Editors working as specialists in gastroenterology, gut-brain neuroscience, and adolescent psychiatry looked for claims that were outdated, oversimplified until false, or graded too generously. |
| **5. Plain-language edit with a fact guard** | A copy edit made the writing clearer, and a script compared every file before and after to prove that no number, name, link, or citation changed. |
| **6. Final specialist pass** | A last full read by a senior ulcerative colitis and neuroscience specialist and a literary editor. |
| **7. Machine checks** | Scripts checked every chapter's structure, the learning graph, the glossary, the FAQ links, and the built website. Every PubMed and PMC link was confirmed through the National Library of Medicine's official tools. |

The most important corrections are listed on the [Accuracy and Corrections](accuracy.md) page.

## How the Hype Meter works

Every popular claim is graded **Strong**, **Moderate**, **Preliminary**, or **Hype** using a fixed rubric ([full explanation](hype-meter.md)):

- **Strong:** consistent evidence in people, usually from large or repeated studies or randomized trials.
- **Moderate:** good animal evidence plus some human evidence, or a repeated link in people whose cause is unclear.
- **Preliminary:** small, early, short, or mostly animal studies.
- **Hype:** a popular claim the evidence does not support, or one that stretches a real finding too far.

Claims were chosen because people actually make them: in wellness posts, product ads, headlines, and common myths. The grade is for the claim **as stated**: "the gut has hundreds of millions of neurons" is Strong, while "your gut is a second brain that thinks and feels" is Hype, even though both start from the same fact. When reviewers disagreed, the lower grade won. All graded claims are collected in the [Claim Explorer](claims-explorer.md), which you can download as an open dataset.

## Facts current as of

October 2026. Statistics, drug and device approvals, guidelines (including the Rome V criteria published in May 2026), and survey results were checked against primary sources at that time. Gut-brain science changes quickly, so the book will be rechecked at least once a year.

## Reuse

Everything in the book, including the claims dataset and the learning graph, is licensed [CC BY-NC-SA 4.0](license.md). The full source, including the verified source files and the chapter rules, is on [GitHub](https://github.com/aaryavvatts-lab/gut-brain-textbook).
