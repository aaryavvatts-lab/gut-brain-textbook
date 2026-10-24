"""Generate mkdocs.yml (from the textbookmaker template) and stub any missing nav page.
Run from ROOT: python3 Materials/build_nav.py"""
import json, os, re
T = os.path.expanduser("~/.claude/skills/textbookmaker/assets/site/mkdocs.yml.template")
ch = json.load(open("Materials/chapters.json"))
s = open(T).read()
vals = {
 "BOOK_TITLE": "Gut Check: The Neuroscience of How Your Gut and Brain Talk",
 "ONE_SENTENCE_PITCH": "A free, interactive neuroscience textbook for teens, patients, and families on how the gut and brain communicate, and how to tell real science from hype.",
 "AUTHOR_NAME": "Aaryav Sharma", "GITHUB_USER": "aaryavvatts-lab", "REPO_NAME": "gut-brain-textbook",
 "YEAR": "2026", "EXTRA_COPYRIGHT_NOTE": " This book teaches; it does not diagnose or give medical advice.",
 "MATERIAL_PRIMARY": "teal", "MATERIAL_ACCENT": "deep orange",
}
for k, v in vals.items():
    s = s.replace("{{" + k + "}}", v)
s = s.replace("# Replace every {{PLACEHOLDER}}. ", "# ")
assert "{{" not in s, re.findall(r"{{\w+}}", s)

def q(t): return '"' + t.replace('"', '\\"') + '"'
lines = ["nav:", "  - Home: index.md", "  - About This Book: about.md", "  - How to Use This Book: how-to-use.md",
         "  - The Hype Meter: hype-meter.md", "  - For Families: for-families.md", "  - For Teachers: teachers.md",
         "  - Downloads (PDF): downloads.md", "  - Course Description: course-description.md",
         "  - Chapters:", "      - List of Chapters: chapters/index.md"]
part = None
for c in ch:
    if c["part"] != part:
        part = c["part"]; lines.append(f"      - {q(part)}:")
    lines += [f"          - {q(str(c['num']) + '. ' + c['short'])}:",
              f"              - Content: chapters/{c['slug']}/index.md",
              f"              - Quiz: chapters/{c['slug']}/quiz.md",
              f"              - References: chapters/{c['slug']}/references.md"]
lines += ["  - MicroSims:", "      - List of MicroSims: sims/index.md"]
for c in ch:
    lines.append(f"      - {q(c['simtitle'])}: sims/{c['sim']}/index.md")
lines += ["      - Learning Graph Viewer: sims/graph-viewer/index.md",
          "  - Appendices:",
          "      - A. Mock Exam: appendices/mock-exam.md",
          "      - B. Glossary: glossary.md",
          "      - C. Teacher Guide: appendices/teacher-guide.md",
          "      - D. Club Kit: club-kit.md",
          "      - E. Pilot Study Kit: appendices/pilot-study-kit.md",
          "      - F. Questions to Ask Your Doctor: appendices/questions-for-your-doctor.md",
          "      - G. Corrections and Review Log: accuracy.md",
          "  - Learning Graph:", "      - Introduction: learning-graph/index.md",
          "      - Quality Metrics: learning-graph/quality-metrics.md", "      - Taxonomy Distribution: learning-graph/taxonomy-distribution.md", "      - Book Metrics: learning-graph/book-metrics.md", "      - Chapter Metrics: learning-graph/chapter-metrics.md",
          "  - FAQ: faq.md", "  - Roadmap: roadmap.md", "  - How to Cite: how-to-cite.md",
          "  - License: license.md", "  - Contact: contact.md"]
s = re.sub(r"^nav:\n(?:(?:  |#).*\n|\s*\n)*?(?=^theme:)", "\n".join(lines) + "\n\n", s, flags=re.M)
open("mkdocs.yml", "w").write(s)

pages = re.findall(r":\s+([\w\-/\.]+\.md)", "\n".join(lines))
made = 0
for p in pages:
    path = os.path.join("docs", p)
    if not os.path.exists(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        title = os.path.splitext(os.path.basename(p))[0].replace("-", " ").title()
        open(path, "w").write(f"# {title}\n\nThis page is being written.\n")
        made += 1
print("nav pages:", len(pages), "stubs created:", made)
