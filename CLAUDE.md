# Gut Check: Project Instructions

*Gut Check: The Neuroscience of How Your Gut and Brain Talk* is a free, interactive, high-school-level neuroscience textbook about the gut-brain axis: the two-way communication between the digestive system, the immune system, and the nervous system. It teaches how gut conditions such as Crohn's disease, ulcerative colitis, and IBS connect to stress, pain, anxiety, and depression, and it teaches readers to tell solid science from wellness hype. Tagline: *What is real, what is hype.*
Author: Aaryav Sharma. Built with Dan McCreary's intelligent-textbook framework. This is book #2; book #1 is *From Neuron to Bedside* (https://aaryavvatts-lab.github.io/neuroscience-textbook/).

Read `Materials/textbook-design-principles.md` before generating any chapter content.

## Audience and voice

- **Primary readers:** students in grades 9 to 12 with one year of high school biology.
- **Secondary readers:** teens living with a gut condition (Crohn's, ulcerative colitis, IBS, celiac), their families and friends, biology and health teachers, science-club members, and wellness-curious teens who see "heal your gut" posts online.
- **Reading level:** Flesch-Kincaid grade 9 to 11. Short sentences. Define every term the first time it appears, in plain words, before the technical name.
- **Tone:** curious, warm, honest, precise. Treat the reader as a smart future scientist or doctor. Some readers are sick or scared: never blame, never alarm, never promise cures.
- **Never** use jargon to sound smart. **No em dashes or en dashes in prose.** Use commas, periods, or parentheses.

## Accuracy rules (non-negotiable)

1. **Never invent statistics, studies, quotes, or citations.** Every number has a real, linked source that you opened. Start from the verified dossiers in `Materials/sources/verified-*.md`. Preferred sources: NIH (NIDDK, NIMH, NINDS, NCCIH), CDC, FDA, StatPearls, peer-reviewed reviews and meta-analyses, clinical guidelines (AGA, ACG, ECCO, Rome Foundation). If you can't verify a claim, soften it or remove it. Never leave `[CITATION NEEDED]` in a finished chapter.
2. **Say what kind of evidence it is.** Every research claim says whether it comes from mice, cells, or humans, and whether it shows correlation or cause. "In mice, ..." "In a study of 67 adults, ..." "People with X are more likely to ..., but this doesn't show that X causes ...".
3. **Grade claims with the Hype Meter** (template below). Grades: **Strong** (consistent human evidence, often trials or large replicated studies), **Moderate** (good animal evidence plus some human evidence, or a strong, replicated association whose cause is unclear), **Preliminary** (small, early, or mostly animal studies), **Hype** (a popular claim the evidence does not support).
4. **People in cases are fictional composites,** labeled as fictional. Riya and Sam are fictional. Real historical scientists may be named.
5. **Not medical advice.** Every At the Bedside case ends with the standard line (see template). Never tell readers to start, stop, or change a medicine, diet, or supplement. Say "talk to your doctor" instead. Never give doses.
6. **Drugs, devices, and approvals** are stated exactly, with the year and the condition they are approved for, as of October 2026. Never call an experimental treatment "approved." FDA approval for one condition is not approval for another.
7. **Mental health safety.** Chapters 7, 8, 11, 13, and 19 include this crisis box exactly once, near the mental-health content:
   ```markdown
   !!! living-with "If you are struggling right now"
       If you are thinking about suicide or are in crisis, call or text **988** to reach the 988 Suicide & Crisis Lifeline (in the US), or go to the nearest emergency room. Outside the US, you can find a helpline at [findahelpline.com](https://findahelpline.com/). You can also talk to a parent, school counselor, or doctor.
   ```
8. **Autism and ADHD (Chapter 13 and anywhere they appear).** Never say gut changes cause or cure autism or ADHD. Describe autism and ADHD as neurodevelopmental differences, not diseases to fix. Use identity-first language for autism ("autistic people") as the default, and avoid "suffers from," "symptoms of autism" used as deficits, and "recovery." Report GI problems as real health issues worth treating, separate from autism itself.
9. **Copyrighted sources** (popular books like *Gut* by Giulia Enders, paid textbooks, news articles) are topic maps only. Never copy their text, figures, or question wording.
10. **Open sources we can adapt with attribution:** OpenStax *Anatomy and Physiology 2e* and *Biology 2e* (CC BY 4.0), US government pages (public domain unless marked), Wikipedia (CC BY-SA, reference only). See `Materials/sources.md`.
11. Every MicroSim must run without console errors and include a "What this model leaves out" box in the chapter.
12. **Don't re-teach book #1.** For basic neuron, synapse, and brain anatomy ideas, give a short refresher (2 to 4 sentences) and link the matching chapter of *From Neuron to Bedside*, for example `[From Neuron to Bedside, Chapter 3](https://aaryavvatts-lab.github.io/neuroscience-textbook/chapters/03-synapses-and-neurotransmitters/)`. Book #1 chapter slugs: 01-neurons-and-glia, 02-action-potential, 03-synapses-and-neurotransmitters, 04-neuroanatomy, 05-vision, 06-hearing-touch-taste-smell-pain, 07-movement, 08-developing-teenage-brain, 09-learning-memory-plasticity, 10-sleep-and-brain-states, 11-emotion-and-stress, 12-language-attention-decisions, 13-aging-and-neurodegeneration, 14-injury-stroke-epilepsy, 15-psychiatric-disorders-and-addiction, 16-how-doctors-examine-the-brain.

## Every chapter MUST include (in this order)

1. Frontmatter, `# Chapter N: Title`, `## Summary`, `## Concepts Covered`, `## Prerequisites`, then the `mascot-welcome` box.
2. **Hook:** a 1 to 2 paragraph real-world story or question (often Riya or Sam).
3. **Intuition first:** an everyday comparison before any technical names or numbers.
4. **Core science:** numbered sections (N.1, N.2, ...) that use every concept the concept list assigns, bolding each concept's first definition.
5. **At least one Hype Meter card** (2 to 4 is typical) on popular claims linked to the chapter.
6. **One "How to read a gut-brain claim" box** that applies the six questions to one real study from the chapter.
7. **At least one "For families" or "If you're going through this" sidebar** (Chapters 7 to 19: at least one of each).
8. **The MicroSim** (`#### Diagram:` block, p5.js), followed by a "What this model leaves out" box.
9. **At the Bedside** case, using the template below.
10. **Common Misconceptions:** 3 to 5 myths with corrections.
11. **Your Gut Check:** the practice section, using the template below.
12. **Exercises:** 12 total, 2 per Bloom level (Remember, Understand, Apply, Analyze, Evaluate, Create).
13. **Key Takeaways:** 5 to 7 bullets, then the `mascot-celebration` box.

## Hype Meter card template

```markdown
!!! hype-preliminary "Hype Meter: "Probiotics treat depression""
    <div class="hype-scale"><span>Strong</span><span>Moderate</span><span>Preliminary</span><span>Hype</span></div>
    **Verdict: Preliminary.** <2 to 4 sentences: what was studied, in whom (mice or people, how many), what was found, and what is still unknown.>
    **What would change the grade:** <the kind of study that would move it up or down.>
```
Use `hype-strong`, `hype-moderate`, `hype-preliminary`, or `hype-hype` so the color matches the verdict. Don't backslash-escape the inner quotes in admonition titles; Markdown takes everything up to the last quote on the line. The claim in the title is a claim people actually make, in quotation marks.

## "How to read a gut-brain claim" box template

```markdown
!!! claim-box "How to read a gut-brain claim: <study in a few words>"
    | Question | This study |
    |---|---|
    | Mouse or human? | ... |
    | Correlation or cause? | ... |
    | How many? | ... |
    | How long? | ... |
    | Who paid for it? | ... (write "Not checked" only if the funding statement could not be opened) |
    | Is something being sold? | ... |
```

## Sidebar templates

```markdown
!!! families "For families"
    <2 to 5 sentences for parents, siblings, or friends: what this means at home, how to help, what not to say.>

!!! living-with "If you're going through this"
    <2 to 5 sentences spoken to a teen who has the condition: validating, practical, points to their care team.>

!!! model-limits "What this model leaves out"
    <3 to 5 bullets on what the sim simplifies or ignores.>
```

## At the Bedside template

```markdown
## At the Bedside: <Case title>

!!! note "Meet the patient (fictional)"
    <Age, setting, and what the patient or family notices, in plain language.>

**What the doctor checks:** <history, exam, tests>
**Connecting the signals:** <reasoning from the symptoms to the gut-brain mechanism in this chapter>
**Diagnosis:** <condition>
**Why it happens:** <link back to this chapter's science>
**The mind-body side:** <how mood, stress, sleep, or pain fit in, and how the care team addresses it>
**Treatment today:** <standard care, carefully worded, with no doses>
**What's new in research:** <one current advance, with a real citation and its evidence grade>

??? question "Your turn: reason through a variation"
    <A short twist on the case for the reader to reason through, with the answer.>

*This is a fictional teaching case. It is not medical advice. If you or someone you know has symptoms like these, talk to a doctor.*
```

## Your Gut Check template (the practice section)

```markdown
## Your Gut Check

Test yourself. Try each one before you open the answer.

??? question "1. Claim Check: "<a realistic social-media post, ad, or headline>""
    **Grade: <Strong | Moderate | Preliminary | Hype>.** <3 to 5 sentences explaining the grade using this chapter's evidence, and what a careful version of the claim would say.>

??? question "2. Predict: <scenario using Riya, Sam, or a new fictional person>"
    <Model answer: the prediction and the pathway, 3 to 5 sentences.>

??? question "3. Explain: <scenario>"
    <Model answer.>

??? question "4. Apply: <scenario>"
    <Model answer.>

**5. Read the data.** <One or two sentences of context, then a small Markdown table or list of real numbers from a cited study in this chapter. If the numbers are made up for practice, label them "Practice data (made up for this exercise)".>

??? question "5. What does this data show, and what can't it show?"
    <Model answer: what the numbers support, what they don't (cause, generalization, size), and one follow-up study that would help.>
```

## Learning mascot: Vee the Vagus Nerve

- **Who:** Vee is a cartoon vagus nerve fiber: a teal, rounded nerve with a round head, three coral-tipped nerve-ending "antennae," and coral dots along the body that stand for signals traveling up and down. The vagus nerve is the main nerve line between the gut and the brainstem, so Vee carries the book's messages.
- **Catchphrase:** "Let's check what the gut is really telling the brain!"
- **Voice:** curious, kind, a little nerdy, and honest about uncertainty. Vee likes saying "Let's check the evidence" and jokes about being very long (the vagus nerve wanders from the brainstem down into the abdomen).
- **Admonition types:** `mascot-welcome` (chapter opening, exactly 1), `mascot-thinking` (key idea, 1 to 3), `mascot-tip` (0 to 2), `mascot-warning` (common mistake, 0 to 2), `mascot-encourage` (hard part, 0 to 2), `mascot-celebration` (end, exactly 1).
- **Rules:** at most 6 Vee boxes per chapter, never back-to-back, 1 to 3 sentences each (welcome up to 4). Each one must teach or support something. Vee speaks in first person.
- **Image placement:** the image goes in the box body, never in the title:
  `![Vee waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }`
  Poses: `neutral, welcome, thinking, tip, warning, encouraging, celebration` (the type `mascot-encourage` uses `encouraging.png`).

## Running examples (fictional, details fixed)

- **Riya** is 16 and a junior at the fictional Lakeview High School. She was diagnosed with **Crohn's disease** at 14, after months of belly pain, diarrhea, weight loss, and tiredness. Her Crohn's affects the end of her small intestine and part of her colon. She had a course of steroids at diagnosis and now takes a biologic medicine by injection; she's mostly in remission but has occasional flares. She plays violin in the school orchestra, loves cooking with her grandmother, and her family is Indian American. She sees a pediatric gastroenterologist, Dr. Alvarez (fictional). She sometimes feels anxious before flares and hates explaining bathroom trips to teachers.
- **Sam** is 16, Riya's best friend, and runs cross-country. Sam (he/him) has **IBS with mixed bowel habits**, diagnosed at 15 after tests ruled out other causes. His symptoms get worse before big tests and races, and he has test anxiety. He's been learning gut-directed relaxation and is skeptical of the supplements his older cousin keeps posting about.
- Use Riya or Sam in the hook of most chapters and at least once more in the chapter. Other cases may use one-off fictional people of any age.

## Canonical values (must match everywhere)

(Filled from the verified dossiers in `Materials/sources/`. Writers must use these exact phrasings.)

### Nervous system and microbes (Chapters 1 to 5)
- **ENS neurons:** "The enteric nervous system contains hundreds of millions of neurons, about 400 to 600 million by common estimates, roughly as many as the spinal cord." (Fleming 2020; Schneider 2019; Rao and Gershon 2016.) The brain has about 86 billion neurons, so the ENS has far fewer.
- **Vagus afferent share:** "Most vagus nerve fibers carry signals from the body to the brain. Classic fiber counts in animals put the figure at about 80%." Never write "80 to 90%." (Prescott and Liberles 2022; Bonaz 2018.)
- **Gut serotonin:** "More than 90% of the body's serotonin is made in the gut, mostly by enterochromaffin cells (some estimates say about 95%). Serotonin made in the gut does not cross the blood-brain barrier. The brain makes its own serotonin from tryptophan, an amino acid that can cross." (Yano 2015; Gershon 2013; Bektaş 2020; Cai 2022.)
- **Bacteria vs human cells:** "A typical adult has roughly 38 trillion bacterial cells and 30 trillion human cells, about 1.3 to 1. The old '10 to 1' figure is wrong." (Sender, Fuchs, Milo 2016.)
- **Gut immune cells:** "The gut holds about 70% of the body's antibody-making plasma cells, but only about 3% of all immune cells. The popular claim that '70% of your immune system is in your gut' is not supported." (Sender et al. 2023, PNAS.) Hype Meter: Hype.

### Gut disorders (Chapters 6 to 10)
- **US IBD (all ages, claims data):** about 721 per 100,000 (about 0.7%), roughly 2.39 million Americans (Lewis et al. 2023, Gastroenterology, PMID 37481117). **Children and teens under 20:** about 122 per 100,000, roughly 100,000 young people (Kappelman et al. 2025, Gastroenterology, PMID 39577811). **Adult survey (newest):** in 2023 to 2024, 1.6% of US adults (about 4.1 million) said a doctor had told them they had Crohn's disease or ulcerative colitis (NCHS Health E-Stat 122, August 2026). Claims and survey numbers differ because they measure different things; say which one you use.
- **IBS criteria:** Most published research used **Rome IV** (2016): recurrent abdominal pain on average at least 1 day a week in the last 3 months, linked to two or more of: related to bowel movements, a change in how often stool happens, a change in how stool looks; with symptoms starting at least 6 months before diagnosis. **Rome V** (published May 2026) is now the current version: "recurrent, but not continuous, abdominal pain or discomfort" on average at least 3 days a month in the last 3 months, with the same three features and timing rule. Rome V also drops the word "functional" where it can. Teach Rome IV for the research numbers, and say clearly that Rome V is now current.
- **IBS prevalence:** 6.1% of US adults by Rome IV (Almario et al. 2023, 2020 online survey of 88,607 people); 4.1% worldwide by Rome IV in internet surveys of 26 countries (Sperber et al. 2021). Always say "by Rome IV criteria" next to these numbers.
- **IBD drug classes:** use only the approval years in the drug table of `Materials/sources/verified-ch06-10.md`. Unverified years (5-ASA, steroids, thiopurines, certolizumab, natalizumab) must not be given; call those "long-established" without a year. Obefazimod is **not approved** (experimental).
- **Short-chain fatty acids:** don't give a fixed acetate:propionate:butyrate ratio (not verified); say acetate is usually the most abundant.

### Mood and conditions (Chapters 11 to 15)
- **IBD and mood (adults):** pooled prevalence of anxiety symptoms 32.1% and depression symptoms 25.2%, from 77 studies of 30,118 patients; higher in active disease (anxiety 57.6% vs 38.1%; depression 38.9% vs 24.2%). These are symptom questionnaires, not diagnoses. (Barberio et al. 2021, Lancet Gastroenterology & Hepatology, PMID 33721557.)
- **IBS and mood:** anxiety symptoms 39.1%, depression symptoms 28.8% (Zamani et al. 2019, PMID 31157418).
- **Teens:** In 2025, 33.3% of US high school students (about one in three) reported persistent feelings of sadness or hopelessness, down from 39.7% in 2023 (CDC YRBS; Kiplagat et al., MMWR Suppl 75(1):35-43, October 15, 2026). Use the 2025 figure; mention 2023 only as a comparison.
- **Celiac disease:** about 1% of people worldwide (1.4% by blood tests, 0.7% confirmed by biopsy; Singh 2018). About 2 million people in the US (NIDDK).
- **Kang 2017 microbiota transfer study:** 18 autistic children aged 7 to 16, open-label, no placebo group. Never describe it as proof of a treatment.
- **SMILES trial (Jacka 2017):** 67 adults with major depression randomized for 12 weeks; remission 32.3% in the diet-support group vs 8.0% in the social-support group. Small, short, and participants knew their group.
- **988:** call or text 988, or chat at 988lifeline.org; free, confidential, 24/7; launched July 2022.
- **Fiber:** average US intake is about 16 grams a day. The 2020 to 2025 Dietary Guidelines suggested about 25 g (girls 14 to 18) and 31 g (boys 14 to 18). The current 2025 to 2030 Dietary Guidelines (January 2026) give no gram target; they emphasize high-fiber, minimally processed foods.

### Treatments and evidence (Chapters 16 to 20)
- **Probiotic (ISAPP 2014):** live microorganisms that, when given in adequate amounts, confer a health benefit on the host. **Prebiotic (ISAPP 2017):** a substrate that is selectively utilized by host microorganisms conferring a health benefit. **Psychobiotic:** a research term coined in 2013 (Dinan, Stanton, Cryan), not an approved product category.
- **Probiotics and depression (Rahmannia et al. 2024):** 12 trials, 707 people; improvement on one depression scale (BDI) but not on three others (HAMD, DASS, MADRS). Hype Meter: Preliminary.
- **FDA-approved microbiome products:** Rebyota (November 30, 2022, rectal) and Vowst (April 26, 2023, oral capsules), both to prevent C. difficile infection from coming back in adults 18 and older after antibiotic treatment for recurrent infection. Vowst trial: recurrence 12.4% vs 39.8% placebo at 8 weeks.
- **Vagus nerve stimulation (implanted):** FDA approved for drug-resistant partial-onset epilepsy (1997, add-on); for chronic or recurrent treatment-resistant depression in adults (2005, add-on, after 4 or more failed treatments); SetPoint System for moderate to severe rheumatoid arthritis in adults who didn't respond to biologic or targeted drugs (July 30, 2025). Not approved for Crohn's, IBS, or anxiety.
- **Noninvasive VNS (gammaCore):** FDA authorized for cluster headache (2017) and migraine (2018) in adults. These are clearances/authorizations, not "approvals."
- **FDA warning (October 2023):** probiotics given to preterm infants have caused serious infections, including a death; no probiotic is FDA approved as a drug for infants.
- **Teen sleep:** AASM recommends 8 to 10 hours per 24 hours for ages 13 to 18 (Paruthi 2016).
- **Animal-to-human translation:** about one in three highly cited animal studies were later tested successfully in human trials (Hackam 2006/2007). Phrase as "about one in three."


## Learning graph taxonomy codes

`FOUND | ENS | VAGUS | MICRO | IMMUNE | CHEM | STRESS | PAIN | GIDIS | NEURO | TREAT | EVID | LIFE`

| Code | Meaning |
|------|---------|
| FOUND | Foundational biology and anatomy |
| ENS | The enteric nervous system |
| VAGUS | The vagus nerve and gut-brain nerve pathways |
| MICRO | The microbiome and diet-microbe chemistry |
| IMMUNE | Gut immunity and immune signaling |
| CHEM | Neurotransmitters, hormones, and barriers |
| STRESS | Stress and the HPA axis |
| PAIN | Pain pathways and sensitivity |
| GIDIS | Gut disorders |
| NEURO | Brain and mental-health conditions |
| TREAT | Tests, treatments, and care |
| EVID | Evidence, research methods, and claim checking |
| LIFE | Living with illness: family, culture, school, stigma |

## MkDocs notes

- `site_name`: Gut Check: The Neuroscience of How Your Gut and Brain Talk
- `site_url`: https://aaryavvatts-lab.github.io/gut-brain-textbook/
- Side navigation only (no `navigation.tabs`). Only the lead editor edits `mkdocs.yml` (generated by `Materials/build_nav.py`).
- Keep `.claude/`, `logs/`, `site/`, `.venv/` out of git. License: CC BY-NC-SA 4.0.
