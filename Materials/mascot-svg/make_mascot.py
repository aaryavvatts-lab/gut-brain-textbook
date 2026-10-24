"""Draw Vee the Vagus Nerve in 7 poses as 512x512 SVGs."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
TEAL, TEAL_D, TEAL_L, CORAL, INK = "#26a69a", "#00574f", "#4db6ac", "#ef6f62", "#1f2d2b"

def knob(x, y, r=11, c=CORAL):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}" stroke="{TEAL_D}" stroke-width="5"/>'

def arm(path, hand):
    return (f'<path d="{path}" fill="none" stroke="{TEAL_D}" stroke-width="30" stroke-linecap="round"/>'
            f'<path d="{path}" fill="none" stroke="{TEAL}" stroke-width="18" stroke-linecap="round"/>'
            + knob(*hand, r=15, c=TEAL_L))

BODY = "M256 230 C 330 285, 175 330, 250 395 C 285 425, 300 445, 335 462"
def body():
    pulses = "".join(knob(x, y, 8) for x, y in [(282, 290), (232, 345), (300, 440)])
    return (f'<path d="{BODY}" fill="none" stroke="{TEAL_D}" stroke-width="86" stroke-linecap="round"/>'
            f'<path d="{BODY}" fill="none" stroke="{TEAL}" stroke-width="70" stroke-linecap="round"/>'
            f'<path d="{BODY}" fill="none" stroke="{TEAL_L}" stroke-width="18" stroke-linecap="round" opacity=".55" transform="translate(-12,-6)"/>'
            + pulses)

def fronds():
    out = ""
    for (x1, y1, x2, y2, x3, y3) in [(220, 82, 196, 40, 172, 30), (256, 70, 256, 26, 236, 12), (292, 82, 318, 40, 342, 30)]:
        out += (f'<path d="M{x1} {y1} Q {x2} {y2} {x3} {y3}" fill="none" stroke="{TEAL_D}" stroke-width="10" stroke-linecap="round"/>'
                + knob(x3, y3, 10))
    return out

def head(eyes="open", mouth="smile", brows=None):
    s = (f'<circle cx="256" cy="165" r="98" fill="{TEAL_L}" stroke="{TEAL_D}" stroke-width="9"/>'
         f'<ellipse cx="228" cy="120" rx="34" ry="18" fill="#ffffff" opacity=".35"/>')
    # eyes
    if eyes == "up":
        pup = [(222, 150), (296, 150)]
    elif eyes == "happy":
        pup = None
    else:
        pup = [(224, 162), (292, 162)]
    for cx in (222, 290):
        if pup is None:
            s += f'<path d="M{cx-20} 168 Q {cx} 145 {cx+20} 168" fill="none" stroke="{INK}" stroke-width="9" stroke-linecap="round"/>'
        else:
            s += f'<ellipse cx="{cx}" cy="160" rx="22" ry="26" fill="#fff" stroke="{INK}" stroke-width="4"/>'
    if pup:
        for (px, py) in pup:
            s += f'<circle cx="{px}" cy="{py}" r="11" fill="{INK}"/><circle cx="{px+4}" cy="{py-5}" r="4" fill="#fff"/>'
    if brows == "worried":
        s += f'<path d="M198 132 L240 118" stroke="{INK}" stroke-width="8" stroke-linecap="round"/><path d="M314 132 L272 118" stroke="{INK}" stroke-width="8" stroke-linecap="round"/>'
    elif brows == "raised":
        s += f'<path d="M200 122 Q222 108 244 120" fill="none" stroke="{INK}" stroke-width="7" stroke-linecap="round"/><path d="M268 120 Q290 108 312 122" fill="none" stroke="{INK}" stroke-width="7" stroke-linecap="round"/>'
    s += f'<circle cx="196" cy="202" r="15" fill="#ff9e9e" opacity=".8"/><circle cx="316" cy="202" r="15" fill="#ff9e9e" opacity=".8"/>'
    if mouth == "smile":
        s += f'<path d="M226 206 Q256 234 286 206" fill="none" stroke="{INK}" stroke-width="8" stroke-linecap="round"/>'
    elif mouth == "big":
        s += f'<path d="M222 200 Q256 252 290 200 Z" fill="{INK}"/><path d="M238 222 Q256 238 274 222 Z" fill="{CORAL}"/>'
    elif mouth == "o":
        s += f'<ellipse cx="256" cy="214" rx="12" ry="15" fill="{INK}"/>'
    elif mouth == "flat":
        s += f'<path d="M232 214 Q256 206 280 214" fill="none" stroke="{INK}" stroke-width="8" stroke-linecap="round"/>'
    elif mouth == "hmm":
        s += f'<path d="M236 212 Q262 222 282 206" fill="none" stroke="{INK}" stroke-width="8" stroke-linecap="round"/>'
    return s

def svg(inner):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">{inner}</svg>'

LEFT_DOWN = arm("M222 285 Q 170 320 150 360", (150, 360))
RIGHT_DOWN = arm("M300 300 Q 350 330 372 368", (372, 368))

poses = {
 "neutral": body() + LEFT_DOWN + RIGHT_DOWN + fronds() + head(),
 "welcome": body() + LEFT_DOWN + arm("M300 290 Q 370 250 392 180", (392, 180)) + fronds() + head(mouth="big")
    + f'<path d="M420 150 Q 440 170 432 196" fill="none" stroke="{CORAL}" stroke-width="7" stroke-linecap="round"/><path d="M440 130 Q 468 165 452 205" fill="none" stroke="{CORAL}" stroke-width="7" stroke-linecap="round"/>',
 "thinking": body() + LEFT_DOWN + arm("M300 300 Q 345 285 318 248", (318, 248)) + fronds() + head(eyes="up", mouth="hmm", brows="raised")
    + f'<circle cx="390" cy="80" r="44" fill="#fff" stroke="{TEAL_D}" stroke-width="6"/><circle cx="352" cy="132" r="10" fill="#fff" stroke="{TEAL_D}" stroke-width="5"/>'
      f'<text x="390" y="100" font-family="Arial, sans-serif" font-size="58" font-weight="700" text-anchor="middle" fill="{CORAL}">?</text>',
 "tip": body() + LEFT_DOWN + arm("M300 290 Q 360 260 372 200", (372, 200)) + fronds() + head(mouth="smile", brows="raised")
    + f'<circle cx="408" cy="110" r="38" fill="#ffd54f" stroke="#8d6e00" stroke-width="6"/><rect x="392" y="146" width="32" height="20" rx="5" fill="#9e9e9e" stroke="#616161" stroke-width="4"/>'
      f'<path d="M408 60 L408 44 M446 74 L458 62 M370 74 L358 62 M462 110 L478 110 M354 110 L338 110" stroke="#f9a825" stroke-width="6" stroke-linecap="round"/>',
 "warning": body() + LEFT_DOWN + arm("M300 300 Q 350 300 372 270", (372, 270)) + fronds() + head(mouth="flat", brows="worried")
    + f'<path d="M400 190 L462 300 L338 300 Z" fill="#ffca28" stroke="#8d4a00" stroke-width="8" stroke-linejoin="round"/>'
      f'<text x="400" y="290" font-family="Arial, sans-serif" font-size="78" font-weight="700" text-anchor="middle" fill="#5d2c00">!</text>',
 "encouraging": body() + arm("M222 285 Q 160 260 140 200", (140, 200)) + arm("M300 290 Q 362 260 380 200", (380, 200)) + fronds() + head(eyes="happy", mouth="big")
    + f'<path d="M256 470 m -26 -24 a 18 18 0 0 1 26 -6 a 18 18 0 0 1 26 6 q 6 22 -26 42 q -32 -20 -26 -42 z" fill="{CORAL}" stroke="#a3332a" stroke-width="5" transform="translate(130,-40)"/>',
 "celebration": body() + arm("M222 285 Q 150 240 130 170", (130, 170)) + arm("M300 290 Q 372 240 392 170", (392, 170)) + fronds() + head(eyes="happy", mouth="big")
    + "".join(f'<rect x="{x}" y="{y}" width="16" height="9" rx="2" fill="{c}" transform="rotate({r} {x} {y})"/>' for x, y, c, r in
              [(70, 90, "#ffd54f", 20), (110, 40, "#ef6f62", -30), (420, 50, "#81d4fa", 40), (460, 120, "#ffd54f", -15), (60, 250, "#a5d6a7", 35),
               (450, 260, "#ef6f62", 10), (380, 20, "#a5d6a7", -40), (150, 110, "#81d4fa", 60), (470, 330, "#ffd54f", 25), (40, 340, "#ef6f62", -20)]),
}
for name, inner in poses.items():
    with open(os.path.join(HERE, f"{name}.svg"), "w") as f:
        f.write(svg(inner))
print("wrote", len(poses), "poses")
