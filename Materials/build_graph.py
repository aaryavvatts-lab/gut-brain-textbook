"""Build docs/learning-graph/learning-graph.csv from concept-list.md + graph_deps.txt."""
import re, csv
concepts = {}
for line in open("Materials/concept-list.md"):
    m = re.match(r"^(\d+)\. (.+) \[([A-Z]+)\]$", line.strip())
    if m:
        concepts[m.group(2)] = (int(m.group(1)), m.group(3))
deps = {}
for line in open("Materials/graph_deps.txt"):
    if line.startswith("#") or ":" not in line:
        continue
    lab, rest = line.rstrip("\n").split(":", 1) if not line.startswith("C. difficile") else ("C. difficile Infection", line.split("Infection:", 1)[1])
    lab = lab.strip()
    deps[lab] = [d.strip() for d in rest.split(";") if d.strip()]
missing = set(concepts) - set(deps); extra = set(deps) - set(concepts)
bad = [(l, d) for l, ds in deps.items() for d in ds if d not in concepts]
assert not missing and not extra and not bad, (missing, extra, bad)
with open("docs/learning-graph/learning-graph.csv", "w", newline="") as f:
    w = csv.writer(f); w.writerow(["ConceptID", "ConceptLabel", "Dependencies", "TaxonomyID"])
    for lab, (i, code) in sorted(concepts.items(), key=lambda x: x[1][0]):
        w.writerow([i, lab, "|".join(str(concepts[d][0]) for d in deps[lab]), code])
print("rows:", len(concepts), "edges:", sum(len(v) for v in deps.values()))
