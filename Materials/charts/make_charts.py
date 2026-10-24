"""Build the book's data charts from verified numbers (see CLAUDE.md canonical values).
Run: python3 Materials/charts/make_charts.py  ->  docs/img/charts/*.png"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

TEAL, TEAL_L, CORAL, GRAY, INK = "#00796b", "#4db6ac", "#e2685c", "#9e9e9e", "#1f2d2b"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 13, "axes.spines.top": False,
                     "axes.spines.right": False, "axes.edgecolor": "#555", "axes.titleweight": "bold",
                     "axes.titlesize": 15, "figure.dpi": 150})
OUT = "docs/img/charts/"

def save(fig, name, source):
    # The source is printed in the caption under each image in the chapter (accessible text).
    fig.savefig(OUT + name, bbox_inches="tight", facecolor="white", pad_inches=0.25)
    plt.close(fig)

def label_bars(ax, bars, fmt="{:.1f}%"):
    for b in bars:
        ax.text(b.get_x() + b.get_width() / 2, b.get_height(), fmt.format(b.get_height()),
                ha="center", va="bottom", fontsize=12, fontweight="bold", color=INK)

# 1. Chapter 1: neurons, log scale
fig, ax = plt.subplots(figsize=(7.5, 4.2))
vals = [500e6, 86e9]
bars = ax.bar(["Enteric nervous system\n(gut wall)", "Brain"], vals, color=[TEAL, CORAL], width=0.55)
ax.errorbar([0], [500e6], yerr=[[100e6], [100e6]], fmt="none", ecolor=INK, capsize=8, lw=1.5)
ax.set_yscale("log"); ax.set_ylim(1e7, 4e11)
ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"{v/1e9:g} billion" if v >= 1e9 else f"{v/1e6:g} million"))
ax.text(0, 750e6, "about 400 to 600 million", ha="center", va="bottom", fontsize=12, fontweight="bold")
ax.text(1, 95e9, "about 86 billion", ha="center", va="bottom", fontsize=12, fontweight="bold")
ax.set_title("The gut has hundreds of millions of neurons.\nThe brain has over a hundred times more.")
ax.set_ylabel("Number of neurons (log scale)")
save(fig, "ch01-neuron-counts.png", "Fleming et al. 2020; Schneider et al. 2019; Azevedo et al. 2009. Log scale: each step is 10x.")

# 2. Chapter 2: vagus fibers
fig, ax = plt.subplots(figsize=(6.2, 4.2))
ax.pie([80, 20], colors=[TEAL, CORAL], startangle=90, counterclock=False, wedgeprops=dict(width=0.42, edgecolor="white"),
       labels=["About 80%\ncarry signals UP\n(body to brain)", "About 20%\ncarry signals DOWN\n(brain to body)"],
       textprops=dict(fontsize=12))
ax.set_title("Most vagus nerve fibers are sensory")
save(fig, "ch02-vagus-fibers.png", "Classic animal fiber counts, as summarized by Prescott & Liberles 2022 and Bonaz et al. 2018. Approximate.")

# 3. Chapter 3: bacteria vs human cells
fig, ax = plt.subplots(figsize=(7.5, 4.2))
bars = ax.barh(["Human cells", "Bacterial cells"], [30, 38], color=[CORAL, TEAL], height=0.55)
for b, v in zip(bars, [30, 38]):
    ax.text(v + 0.6, b.get_y() + b.get_height() / 2, f"about {v} trillion", va="center", fontsize=12, fontweight="bold")
ax.set_xlim(0, 50); ax.set_xlabel("Trillions of cells in a typical adult")
ax.set_title("About 1.3 bacterial cells for every human cell\n(not the old \"10 to 1\")")
save(fig, "ch03-bacteria-human-cells.png", "Sender, Fuchs & Milo 2016, PLOS Biology (reference adult: 20 to 30 years old, 70 kg).")

# 4. Chapter 10: IBS prevalence depends on the criteria
fig, ax = plt.subplots(figsize=(8.2, 4.6))
labels = ["Rome III\n(26 countries,\ninternet survey)", "Rome IV\n(26 countries,\ninternet survey)", "Rome IV\n(household\ninterviews)", "Rome IV\n(US adults,\n2020 survey)"]
vals = [10.1, 4.1, 1.5, 6.1]
bars = ax.bar(labels, vals, color=[GRAY, TEAL, TEAL_L, CORAL], width=0.6)
label_bars(ax, bars); ax.set_ylim(0, 12.5); ax.set_ylabel("Adults meeting IBS criteria (%)")
ax.set_title("How common IBS looks depends on the rules and the survey method")
save(fig, "ch10-ibs-prevalence.png", "Sperber et al. 2021, Gastroenterology (Rome Foundation Global Study); Almario et al. 2023, Gastroenterology (US).")

# 5. Chapter 11: IBD mood symptoms, active vs inactive
fig, ax = plt.subplots(figsize=(7.8, 4.6))
import numpy as np
x = np.arange(2); w = 0.36
b1 = ax.bar(x - w / 2, [57.6, 38.9], w, label="Active disease (flare)", color=CORAL)
b2 = ax.bar(x + w / 2, [38.1, 24.2], w, label="Inactive disease", color=TEAL)
label_bars(ax, b1); label_bars(ax, b2)
ax.set_xticks(x); ax.set_xticklabels(["Anxiety symptoms", "Depression symptoms"])
ax.set_ylim(0, 70); ax.set_ylabel("Adults with IBD (%)"); ax.legend(frameon=False, loc="upper right")
ax.set_title("Mood symptoms in IBD are more common during flares")
save(fig, "ch11-ibd-mood.png", "Barberio et al. 2021, Lancet Gastroenterol Hepatol (meta-analysis, 77 studies, 30,118 patients). Symptom questionnaires, not diagnoses.")

# 6. Chapter 15: SMILES remission
fig, ax = plt.subplots(figsize=(6.6, 4.4))
bars = ax.bar(["Diet support\n(Mediterranean-style)", "Social support\n(comparison)"], [32.3, 8.0], color=[TEAL, GRAY], width=0.55)
label_bars(ax, bars); ax.set_ylim(0, 40); ax.set_ylabel("Reached remission after 12 weeks (%)")
ax.set_title("SMILES trial: a promising but small result")
save(fig, "ch15-smiles.png", "Jacka et al. 2017, BMC Medicine. 67 adults randomized; percentages among those who finished; participants knew their group.")

# 7. Chapter 17: Vowst trial
fig, ax = plt.subplots(figsize=(6.6, 4.4))
bars = ax.bar(["Vowst\n(89 people)", "Placebo\n(93 people)"], [12.4, 39.8], color=[TEAL, GRAY], width=0.55)
label_bars(ax, bars); ax.set_ylim(0, 48); ax.set_ylabel("C. difficile came back within 8 weeks (%)")
ax.set_title("A microbiome medicine that passed a real trial")
save(fig, "ch17-vowst-trial.png", "US FDA, April 26, 2023 approval announcement (ECOSPOR III trial). Adults with recurrent C. difficile, after antibiotics.")
print("charts written")
