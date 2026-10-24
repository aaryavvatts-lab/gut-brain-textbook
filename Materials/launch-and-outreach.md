# Launch and Outreach Plan: Gut Check

Live site: https://aaryavvatts-lab.github.io/gut-brain-textbook/
Repo: https://github.com/aaryavvatts-lab/gut-brain-textbook

You (Aaryav) do every step below yourself, from your own accounts. Nothing here has been sent.

## Part 1: Credentials (about 30 minutes)

### Zenodo DOI (a permanent, citable ID)
1. Go to https://zenodo.org and sign in with GitHub (the same way you did for *From Neuron to Bedside*).
2. Open your profile menu, then **GitHub**. Find `aaryavvatts-lab/gut-brain-textbook` and turn the switch **On**.
3. On GitHub, open the repo, then **Releases**, then **Draft a new release**. Tag: `v1.0.1`. Title: `Gut Check v1.0.1`. Publish it. (Zenodo only archives releases made *after* you switch the repo on.)
4. Wait a few minutes, then refresh the Zenodo GitHub page. Copy the DOI (looks like `10.5281/zenodo.XXXXXXXX`).
5. Tell Claude the DOI, or add it yourself to: `CITATION.cff` (`doi:` line), `docs/how-to-cite.md`, `docs/about.md` (one line, like book #1), and a DOI badge at the top of `README.md`.

### ORCID
You already have an ORCID iD (0009-0006-3333-0809). After the DOI exists, sign in at https://orcid.org, choose **Works**, then **Add**, then **Search & link** (DataCite), search for "Gut Check", and add it.

### Google Analytics (optional)
1. Create a GA4 property at https://analytics.google.com for `aaryavvatts-lab.github.io/gut-brain-textbook`.
2. Copy the Measurement ID (`G-XXXXXXXXXX`).
3. In `mkdocs.yml`, uncomment the `analytics:` block at the bottom and paste the ID. Add one line to the About page saying the site uses Google Analytics to count visits.
4. Run `mkdocs gh-deploy --strict` to publish.

### Things only you can decide
- **About page wording.** The About page says you chose the topic, set the structure and rules, and used Claude Code and Dan McCreary's skills to research, draft, build, and check the book. Reword it in your own voice if you want. Once you have personally read and reviewed every chapter, you can add a sentence saying so (it isn't there now, because it should only be added when it's true).
- **Your family member.** The About page says, "A close family member lives with ulcerative colitis, which is a big part of why this book exists." Confirm the wording with her before you share the book widely.

## Part 2: Outreach messages (you send these yourself)

### 1. Dan McCreary (gallery listing)
Where: LinkedIn message, or an issue on https://github.com/dmccreary/intelligent-textbooks

> Hi Dan, I used your intelligent-textbook skills again to build a second free textbook: *Gut Check: The Neuroscience of How Your Gut and Brain Talk*, for high school students and teens living with gut conditions. It has 20 chapters, 20 p5.js MicroSims, a 337-concept learning graph, and an evidence-grading "Hype Meter" on popular gut-brain claims. Would you consider adding it to the gallery next to *From Neuron to Bedside*? https://aaryavvatts-lab.github.io/gut-brain-textbook/ Thanks again for making the skills open.

### 2. Anant Bhaya (expert review)
Where: text or email. Casual and direct, like last time.

> Hey Anant Bhaya! I finished my second textbook, this one on how the gut and brain talk to each other (IBD, IBS, stress, mood). Could you read Chapter 9 on IBD and Chapter 11 on anxiety and depression and tell me if anything is wrong or misleading? Here's the book: https://aaryavvatts-lab.github.io/gut-brain-textbook/ If it holds up, could you write me a few sentences I could put on the site saying you reviewed it? Thank you!

(Post only the exact words he writes. Add him to the Accuracy page under reviewers, with his permission.)

### 3. A gastroenterologist or IBD nurse (second reviewer)
Ask your mom's GI team, or a pediatric GI clinic at a local hospital, through someone who knows them.

> Hello Dr. ___, I'm a high school student in Minnesota who wrote a free, carefully sourced textbook for teens on the gut-brain axis, including chapters on IBD and IBS. Every chapter was fact-checked, but it hasn't had a physician review yet. Would you be willing to look over one chapter (Chapter 9, Inflammatory Bowel Disease) for accuracy? I'll credit any corrections on the book's public corrections page. https://aaryavvatts-lab.github.io/gut-brain-textbook/chapters/09-inflammatory-bowel-disease/

### 4. Autistic and ADHD readers (Chapter 13)
Where: a neurodiversity club or self-advocacy group at your school or in your area.

> Hi, I wrote a free textbook chapter about autism, ADHD, and gut health, and I want to make sure it's accurate and respectful. Would anyone be willing to read it and tell me what to change? https://aaryavvatts-lab.github.io/gut-brain-textbook/chapters/13-autism-adhd-gut/

### 5. Crohn's & Colitis Foundation (youth and education programs)
Where: your local chapter (Minnesota) through https://www.crohnscolitisfoundation.org

> Hello, I'm a high school student who created a free online textbook that explains the gut-brain connection for teens, including how IBD relates to stress, sleep, and mood, with sidebars for families. It's not medical advice and points readers to their care teams. Would it be useful for your youth programs or teen resources? I'd love any feedback. https://aaryavvatts-lab.github.io/gut-brain-textbook/

### 6. NAMI Minnesota (Ending the Silence or youth programs)
> Hello, I wrote a free textbook for teens on how the gut and brain affect each other, including a chapter on anxiety, depression, and gut conditions with crisis resources and a chapter on stigma in families. I'd be grateful if you could tell me whether it would be helpful for teens and families you work with. https://aaryavvatts-lab.github.io/gut-brain-textbook/

### 7. Teachers (biology, health, psychology, AP Bio)
> Hi ___, I made a free interactive textbook on the gut-brain axis for high school students, with simulations, quizzes, a teacher guide, and printable PDFs. If you ever teach digestion, the nervous system, or health literacy, I'd love for you to try a chapter or the Hype Meter activity with a class. Teacher page: https://aaryavvatts-lab.github.io/gut-brain-textbook/teachers/

### 8. Your clubs (NeuroGIDAS and SASA)
- NeuroGIDAS: run one session from the Club Kit (Session 1 or the claim-checking challenge) and, with school permission, try the Pilot Study Kit's anonymous pre/post quiz.
- SASA: present Chapter 19 (culture, food, family, and stigma) and the Hype Meter at a meeting.

## Part 3: Track real impact (honest numbers only)
- Keep a simple log: who you contacted, when, and their reply (including no).
- After any club session, record the anonymous pre/post quiz averages using the Pilot Study Kit template.
- Add confirmed classroom uses and reviewers to the Accuracy and Roadmap pages.
- Never post numbers you don't have.
