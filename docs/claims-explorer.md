---
title: Claim Explorer
description: Search and filter every popular gut-brain claim graded in Gut Check, with its Hype Meter grade, reasoning, and sources. Download the open dataset.
image: img/cover.png
hide:
  - toc
---

# Claim Explorer

Every popular gut-brain claim that this book grades with the [Hype Meter](hype-meter.md) is collected here in one place. Search for a claim you've seen online, filter by grade or chapter, and open the chapter that explains the evidence.

The claims are also published as an **open dataset** that anyone can reuse for a class, a club, or a research project: [JSON](data/hype-meter-claims.json) · [CSV](data/hype-meter-claims.csv) (CC BY-NC-SA 4.0).

<div id="gc-explorer" markdown="0">
  <div class="gc-chart" id="gc-chart" aria-label="Number of claims at each Hype Meter grade"></div>
  <div class="gc-controls">
    <label>Search <input type="search" id="gc-q" placeholder="e.g. probiotics, serotonin, leaky gut"></label>
    <label>Grade
      <select id="gc-grade"><option value="">All grades</option><option>Strong</option><option>Moderate</option><option>Preliminary</option><option>Hype</option></select>
    </label>
    <label>Chapter <select id="gc-ch"><option value="">All chapters</option></select></label>
  </div>
  <p id="gc-count" class="gc-count"></p>
  <div id="gc-list"></div>
  <noscript>This explorer needs JavaScript. You can still download the <a href="data/hype-meter-claims.csv">CSV file</a>.</noscript>
</div>

<style>
#gc-explorer { margin-top: 1rem; }
.gc-chart { display: grid; gap: .35rem; margin: 0 0 1.2rem; }
.gc-bar-row { display: grid; grid-template-columns: 7rem 1fr 2.5rem; align-items: center; gap: .5rem; font-size: .8rem; cursor: pointer; }
.gc-bar { height: 1.3rem; border-radius: 4px; }
.gc-controls { display: flex; flex-wrap: wrap; gap: .8rem 1.2rem; margin-bottom: .6rem; font-size: .8rem; }
.gc-controls input, .gc-controls select { margin-left: .3rem; padding: .25rem .4rem; border: 1px solid #9e9e9e; border-radius: 4px; font-size: .8rem; max-width: 100%; }
.gc-controls input { width: 15rem; }
.gc-count { font-size: .75rem; color: #616161; }
.gc-card { border-left: .3rem solid #9e9e9e; background: var(--md-code-bg-color); padding: .6rem .8rem; margin: .6rem 0; border-radius: 4px; }
.gc-card h4 { margin: 0 0 .3rem !important; font-size: .85rem; }
.gc-card p { margin: .3rem 0; font-size: .78rem; }
.gc-pill { display: inline-block; color: #fff; font-weight: 700; font-size: .68rem; padding: .05rem .5rem; border-radius: 1rem; margin-right: .4rem; }
.gc-Strong { background: #2e7d32; border-color: #2e7d32; } .gc-Moderate { background: #1565c0; border-color: #1565c0; }
.gc-Preliminary { background: #b26a00; border-color: #b26a00; } .gc-Hype { background: #c62828; border-color: #c62828; }
.gc-card.gc-Strong, .gc-card.gc-Moderate, .gc-card.gc-Preliminary, .gc-card.gc-Hype { background: var(--md-code-bg-color); }
@media (max-width: 480px) { .gc-controls input { width: 100%; } .gc-bar-row { grid-template-columns: 5.5rem 1fr 2rem; } }
</style>

<script>
(function () {
  const ORDER = ["Strong", "Moderate", "Preliminary", "Hype"];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
  let data = [];
  function chart(rows) {
    const el = document.getElementById("gc-chart");
    const counts = ORDER.map(g => rows.filter(r => r.grade === g).length);
    const max = Math.max(1, ...counts);
    el.innerHTML = ORDER.map((g, i) =>
      `<div class="gc-bar-row" data-g="${g}" title="Show only ${g}"><span><span class="gc-pill gc-${g}">${g}</span></span>` +
      `<div class="gc-bar gc-${g}" style="width:${(counts[i] / max * 100).toFixed(1)}%"></div><span>${counts[i]}</span></div>`).join("");
    el.querySelectorAll(".gc-bar-row").forEach(r => r.onclick = () => { document.getElementById("gc-grade").value = r.dataset.g; render(); });
  }
  function render() {
    const q = document.getElementById("gc-q").value.trim().toLowerCase();
    const g = document.getElementById("gc-grade").value;
    const c = document.getElementById("gc-ch").value;
    const rows = data.filter(r => (!g || r.grade === g) && (!c || String(r.chapter) === c) &&
      (!q || (r.claim + " " + r.verdict).toLowerCase().includes(q)));
    chart(data.filter(r => (!c || String(r.chapter) === c) && (!q || (r.claim + " " + r.verdict).toLowerCase().includes(q))));
    document.getElementById("gc-count").textContent = `Showing ${rows.length} of ${data.length} claims`;
    document.getElementById("gc-list").innerHTML = rows.map(r =>
      `<div class="gc-card gc-${r.grade}"><h4><span class="gc-pill gc-${r.grade}">${r.grade}</span>"${esc(r.claim)}"</h4>` +
      `<p>${esc(r.verdict)}</p>` +
      (r.what_would_change_the_grade ? `<p><strong>What would change the grade:</strong> ${esc(r.what_would_change_the_grade)}</p>` : "") +
      `<p><a href="${esc(r.chapter_url)}">Chapter ${r.chapter}: ${esc(r.chapter_title)}</a>` +
      (r.source_links.length ? ` · Sources: ` + r.source_links.map((u, i) => `<a href="${esc(u)}">${i + 1}</a>`).join(", ") : "") + `</p></div>`).join("");
  }
  fetch("../data/hype-meter-claims.json").then(r => r.json()).then(j => {
    data = j.claims;
    const sel = document.getElementById("gc-ch");
    [...new Set(data.map(r => r.chapter))].sort((a, b) => a - b).forEach(n => {
      const t = data.find(r => r.chapter === n).chapter_title;
      sel.insertAdjacentHTML("beforeend", `<option value="${n}">${n}. ${esc(t)}</option>`);
    });
    ["gc-q", "gc-grade", "gc-ch"].forEach(id => document.getElementById(id).addEventListener("input", render));
    render();
  }).catch(() => { document.getElementById("gc-list").textContent = "Could not load the claims dataset."; });
})();
</script>

## How to use this in a class or club

- **Spot the pattern.** In this book's set, many of the claims chosen because they are popular online land at Hype, while claims about basic biology are usually Strong. Why might that be? (Remember that these claims were picked for teaching, not sampled at random.)
- **Bring a claim.** Find a gut-health post online, search for it here, and compare your own grade with the book's.
- **Do a project.** The CSV works in any spreadsheet. Count how many Hype claims involve a product for sale, or which chapters have the most Preliminary claims, and present what you find. See the student project in [Chapter 20](chapters/20-be-your-own-scientist/index.md).

Grades reflect the evidence as of October 2026 and can change as new studies come out. This page is for learning only and is not medical advice.
