"""Extract every Hype Meter card in the chapters into an open dataset.
Writes docs/data/hype-meter-claims.json and docs/data/hype-meter-claims.csv.
Run from ROOT: python3 Materials/build_claims.py"""
import json, re, csv, os
ch = json.load(open("Materials/chapters.json"))
GR = {"hype-strong": "Strong", "hype-moderate": "Moderate", "hype-preliminary": "Preliminary", "hype-hype": "Hype"}
rows = []
for c in ch:
    text = open(f"docs/chapters/{c['slug']}/index.md").read()
    lines = text.split("\n")
    for i, l in enumerate(lines):
        m = re.match(r'^!!! (hype-[a-z]+) "Hype Meter: (.*)"\s*$', l)
        if not m:
            continue
        body = []
        for l2 in lines[i + 1:]:
            if l2.startswith("    ") or not l2.strip():
                if l2.strip():
                    body.append(l2.strip())
                elif body:
                    break
            else:
                break
        body = [b for b in body if not b.startswith("<div class=\"hype-scale\"")]
        full = " ".join(body)
        verdict = re.sub(r"\*\*What would change the grade:\*\*.*", "", full).strip()
        change = re.search(r"\*\*What would change the grade:\*\*\s*(.*)", full)
        links = re.findall(r"\]\((https?://[^)]+)\)", full)
        plain = lambda t: re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", t).replace("**", "").replace("*", "").strip()
        claim = m.group(2).strip().strip('"')
        rows.append({"id": f"ch{c['num']:02d}-{len([r for r in rows if r['chapter'] == c['num']]) + 1}",
                     "chapter": c["num"], "chapter_title": c["title"],
                     "chapter_url": f"https://aaryavvatts-lab.github.io/gut-brain-textbook/chapters/{c['slug']}/",
                     "claim": claim, "grade": GR[m.group(1)],
                     "verdict": plain(verdict.replace("Verdict:", "", 1)),
                     "what_would_change_the_grade": plain(change.group(1)) if change else "",
                     "source_links": links})
os.makedirs("docs/data", exist_ok=True)
meta = {"title": "Gut Check Hype Meter claims dataset", "version": "1.0", "date": "2026-10-24",
        "author": "Aaryav Sharma", "license": "CC BY-NC-SA 4.0",
        "description": "Every popular gut-brain claim graded in the textbook Gut Check, with its evidence grade (Strong, Moderate, Preliminary, Hype), the reasoning, what would change the grade, and the sources linked in the card.",
        "grading_rubric": "https://aaryavvatts-lab.github.io/gut-brain-textbook/hype-meter/",
        "count": len(rows)}
json.dump({"metadata": meta, "claims": rows}, open("docs/data/hype-meter-claims.json", "w"), indent=2, ensure_ascii=False)
with open("docs/data/hype-meter-claims.csv", "w", newline="") as f:
    w = csv.writer(f); w.writerow(["id", "chapter", "claim", "grade", "verdict", "what_would_change_the_grade", "source_links", "chapter_url"])
    for r in rows:
        w.writerow([r["id"], r["chapter"], r["claim"], r["grade"], r["verdict"], r["what_would_change_the_grade"], " ".join(r["source_links"]), r["chapter_url"]])
from collections import Counter
print(len(rows), "claims", dict(Counter(r["grade"] for r in rows)))
