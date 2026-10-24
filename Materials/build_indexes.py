"""Generate docs/chapters/index.md and docs/sims/index.md from chapter and sim frontmatter."""
import json, re
ch = json.load(open("Materials/chapters.json"))
def fm(path, key):
    t = open(path).read().split("---")[1]
    m = re.search(rf'^{key}:\s*"?(.*?)"?\s*$', t, re.M)
    return m.group(1).replace('\\"', '"') if m else ""
out = ["---", "title: List of Chapters", "description: All 20 chapters of Gut Check, grouped into five parts, with a one-line summary of each.", "image: img/cover.png", "---", "", "# List of Chapters", "",
       "Each chapter has a MicroSim, a fictional At the Bedside case, Hype Meter grades, Your Gut Check practice, 12 exercises, a 10-question quiz, and references. Chapters list their prerequisites at the top.", ""]
part = None
for c in ch:
    if c["part"] != part:
        part = c["part"]; out += [f"## {part}", ""]
    d = fm(f"docs/chapters/{c['slug']}/index.md", "description")
    out.append(f"- **Chapter {c['num']}: [{c['title']}]({c['slug']}/index.md)**: {d} ([Quiz]({c['slug']}/quiz.md) · [References]({c['slug']}/references.md))")
    out.append("")
open("docs/chapters/index.md", "w").write("\n".join(out))
s = ["---", "title: List of MicroSims", "description: All 20 interactive simulations in Gut Check, plus the learning graph viewer.", "image: img/cover.png", "---", "", "# List of MicroSims", "",
     "Every chapter has one interactive simulation built with p5.js. Each sim has its own page with instructions, a lesson plan, and code to embed it in a class website. Every sim is a simplified teaching model; its chapter lists what the model leaves out.", "",
     '<div class="grid cards" markdown>', ""]
for c in ch:
    d = fm(f"docs/sims/{c['sim']}/index.md", "description")
    s += [f"-   **[{c['simtitle']}]({c['sim']}/index.md)**", "", "    ---", "",
          f"    [![{c['simtitle']} screenshot]({c['sim']}/{c['sim']}.png)]({c['sim']}/index.md)", "",
          f"    {d}", "", f"    *Chapter {c['num']}: [{c['short']}](../chapters/{c['slug']}/index.md)*", ""]
s += ["-   **[Learning Graph Viewer](graph-viewer/index.md)**", "", "    ---", "", "    Explore all 337 concepts in the book and how they connect.", "", "</div>", ""]
open("docs/sims/index.md", "w").write("\n".join(s))
print("ok")
