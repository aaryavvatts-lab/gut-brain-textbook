# Textbook Design Principles: Gut Check

This is the quality contract. Every chapter must meet it before it ships.

## The core argument

Teens hear about the gut-brain axis constantly, mostly from wellness posts that promise to "heal your gut, fix your mind." The free, careful resources that exist are not built for them:

- **Patient guides** from groups like Crohn's & Colitis UK and Crohn's & Colitis Canada are helpful and accurate, but they are short, aimed at adults with a diagnosis, and don't teach the neuroscience.
- **Research books** such as *The Gut-Brain Axis* (Hyland and Stanton, Elsevier, 2nd edition 2023) are written for graduate students and researchers, and they are paid.
- **Popular books** such as Giulia Enders' *Gut* are readable but paid, not interactive, and not built to grade evidence.
- **General textbooks** (OpenStax, CK-12, Khan Academy) cover digestion and the nervous system separately. Searches in October 2026 found no chapter on how the two talk to each other.
- What's missing everywhere: an everyday-comparison-first explanation, practice with feedback, interactive models, an honest grade on every popular claim, and attention to the people who live with these conditions.

I could not find a free, textbook-length, high-school-level, interactive, neuroscience-first book on the gut-brain axis. The book says "I could not find one," never "the first."

## Dimension 1: Intuition before terminology
**Problem:** Terms like "myenteric plexus" and "visceral hypersensitivity" lose readers on page one.
**Solution:** Every new idea starts with an everyday comparison (a smoke alarm set too sensitive, a mail sorting room, a highway with lanes in both directions), and the technical term comes second.

## Dimension 2: A MicroSim in every chapter
**Problem:** Feedback loops (stress, inflammation, pain amplification) are hard to picture in text.
**Solution:** One interactive p5.js sim per chapter, each with one learning objective and a "What this model leaves out" box so a simple model never looks like the whole truth.

| Ch | Sim | Learning objective |
|---|---|---|
| 1 | Peristalsis Builder | Explain how the enteric reflex moves food without the brain |
| 2 | Vagus Signal Router | Compare upward (afferent) and downward (efferent) vagus traffic |
| 3 | Microbiome Balance | Predict how fiber, antibiotics, and diet change diversity |
| 4 | Cytokine Feedback Loop | Explain how gut inflammation can affect sleep and mood |
| 5 | Serotonin: Where Does It Go? | Distinguish gut serotonin from brain serotonin |
| 6 | Fiber to Butyrate | Trace fiber to short-chain fatty acids and their effects |
| 7 | HPA Axis Stress Dial | Explain cortisol feedback and its effects on the gut |
| 8 | Pain Amplifier | Explain how sensitization changes the same signal into more pain |
| 9 | IBD Flare Timeline | Relate inflammation, symptoms, mood, and treatment over time |
| 10 | Rome IV Criteria Explorer | Apply symptom-based criteria (education only, not diagnosis) |
| 11 | The Two-Way Street | Show how gut-to-brain and brain-to-gut effects both create correlation |
| 12 | Villi Explorer | Explain how celiac disease flattens villi and reduces absorption |
| 13 | Confounder Detective | Identify how diet can explain a microbiome difference |
| 14 | Gut-First or Brain-First? | Compare the two proposed routes of Parkinson's spread |
| 15 | Diet Pattern Explorer | Distinguish association from causation in diet studies |
| 16 | Probiotic Trial Reader | Judge how trial size and design change confidence |
| 17 | Treatment Evidence Map | Sort gut-brain treatments by approval and evidence |
| 18 | Gut and Sleep Diary | Practice self-observation without jumping to conclusions (data stays on the device) |
| 19 | Conversation Practice | Practice supportive ways to talk about gut and mental health |
| 20 | Hype Meter Sorter | Grade claims using the Hype Meter method |

## Dimension 3: The Hype Meter (signature feature)
**Problem:** The gut-brain field is one of the most oversold in wellness, and many claims come from mice or small studies.
**Solution:** Every chapter grades real popular claims as Strong, Moderate, Preliminary, or Hype, and every research claim says whether it comes from mice or people and whether it shows correlation or cause. A "How to read a gut-brain claim" box applies six questions to a real study in each chapter.

## Dimension 4: Patient and family voice
**Problem:** Science books treat diseases as diagrams; patient guides skip the science.
**Solution:** Every chapter has an At the Bedside case that includes the mind-body side, plus "For families" and "If you're going through this" sidebars. Riya (Crohn's) and Sam (IBS with test anxiety) recur across the book.

## Dimension 5: Practice and feedback
**Problem:** Reading isn't learning.
**Solution:** Each chapter has Your Gut Check (one claim to grade, three scenarios, one data table), 12 exercises across Bloom's taxonomy, 3 to 5 misconceptions, and a 10-question quiz with explanations.

## Dimension 6: A learning graph so nothing is used before it's taught
337 concepts in a prerequisite graph. A concept may depend only on concepts from the same or an earlier chapter.

## Dimension 7: Current, carefully sourced facts
Every statistic, approval, and named study is checked against a source someone opened, with its year in the prose, current as of October 2026. Corrections are logged publicly on the Accuracy page.

## Dimension 8: Safe for the readers who need it most
Not medical advice, ever. No doses, no "stop your medicine," no supplement recommendations. Crisis resources in the mental-health chapters. Identity-respecting language about autism and ADHD. Culturally aware sections on food, family, and stigma, including South Asian families, written so every reader benefits.

## Dimension 9: Free and open forever
CC BY-NC-SA 4.0, hosted on GitHub Pages, with printable PDFs, a teacher guide, and a club kit.

## The design contract (every chapter)

- [ ] Summary, Concepts Covered (exact labels), Prerequisites, welcome box
- [ ] Hook, then an everyday comparison before technical terms
- [ ] Every assigned concept used and bolded at first definition
- [ ] 1 to 4 Hype Meter cards, colored to match the verdict
- [ ] One "How to read a gut-brain claim" box on a real study
- [ ] Family and/or living-with sidebars (both in Chapters 7 to 19)
- [ ] MicroSim with spec block and a "What this model leaves out" box
- [ ] At the Bedside case ending with the not-medical-advice line
- [ ] 3 to 5 misconceptions, Your Gut Check (5 items), 12 Bloom exercises, 5 to 7 takeaways
- [ ] 10-question quiz, 8 to 12 references, every URL opened
- [ ] Every statistic cited; mouse vs human and correlation vs cause stated
- [ ] Vee: at most 6 boxes, never back-to-back, never decorative
- [ ] No em or en dashes; reading level grade 9 to 11
- [ ] Crisis box in Chapters 7, 8, 11, 13, 19

## The test question

Would a 15-year-old with one year of biology understand this, and would a teen with Crohn's disease feel respected and better informed after reading it? If either answer is no, rewrite it.
