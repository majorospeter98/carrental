---
name: Night
description: City after dark. The car comes out of a deep blue-black, and amber marks what you can act on.
colors:
  night: "#060d1f"
  deep: "#0b1630"
  raise: "#17254a"
  line: "#24365f"
  edge: "#5671b0"
  ink: "#eef3ff"
  soft: "#a3b4d8"
  amber: "#ffb02e"
  amber-lift: "#ffc460"
  amber-ink: "#ffb02e"
  on-amber: "#060d1f"
  cobalt: "#4d83ff"
  alert: "#ff8a7a"
  dusk: "#0b2878"
typography:
  display:
    fontFamily: "Barlow Condensed, Barlow, ui-sans-serif, sans-serif"
    fontSize: "6rem"
    fontWeight: 700
    lineHeight: 0.95
  headline:
    fontFamily: "Barlow Condensed, Barlow, ui-sans-serif, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 700
    lineHeight: 0.95
  title:
    fontFamily: "Barlow Condensed, Barlow, ui-sans-serif, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 0.95
  body:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  label:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
rounded:
  xs: "2px"
  sm: "4px"
spacing:
  gutter: "16px"
  gutter-wide: "48px"
  stack: "16px"
  section: "40px"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.night}"
    rounded: "{rounded.sm}"
    height: "48px"
    padding: "8px 24px"
  button-primary-hover:
    backgroundColor: "{colors.amber-lift}"
  button-quiet:
    backgroundColor: "{colors.night}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  button-off:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.soft}"
    rounded: "{rounded.sm}"
  input:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "48px"
    padding: "8px 12px"
  notice:
    backgroundColor: "{colors.raise}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "16px 20px"
---

# Design System: Night

## Overview

**Creative North Star: "Night"**

City after dark: the car comes out of a deep blue-black, and amber marks what you can act on. One car holds the stage at a time, photographed full width, with its name and the trip total over it. Everything else is quiet and flat.

**Key Characteristics:**

- Dark by default, with a light theme switched in the header. No glows or coloured shadows.
- Large condensed uppercase names and prices against calm body text.
- Hairline dividers instead of cards in lists.
- One authored motion: the stage photo fades up from dark.

## Colors

A blue-black ground, one warm action colour and a cool second accent. Tokens live in `resources/css/app.css`.

### Primary
- **Amber** (`amber`, hover `amber-lift`): primary action, price, selected days, focus ring, caret, text selection.

### Secondary
- **Cobalt** (`cobalt`): booking dates in the admin list and the border of notices. Use it for large text only on `raise` (4.29:1 there).

### Tertiary
- **Alert** (`alert`): errors, booked cars, and a selection that collides with a booking.

### Neutral
- **Night** (`night`): page ground.
- **Deep** and **Raise** (`deep`, `raise`): panels, inputs, then selected or raised items.
- **Line** (`line`): decorative dividers. Too faint to carry meaning on its own.
- **Edge** (`edge`): control borders and the booked-day outline and slash. At least 3:1 on `night`, `deep` and `raise`.
- **Ink** and **Soft** (`ink`, `soft`): text and secondary text.
- **Dusk** (`dusk`): the blue cast at the top of the stage gradient.
- **Amber ink** and **On amber** (`amber-ink`, `on-amber`): amber used as text, border or focus ring, and the text on an amber fill.

### Light theme
`:root[data-theme="light"]` gives the same tokens other values: night `#f4f6fb`, deep `#ffffff`, raise `#e3e9f6`, line `#cfd8ec`, edge `#61749f`, ink `#0b1630`, soft `#45567d`, amber-ink `#854d00`, cobalt `#1f55cc`, alert `#b3261e`. The amber fill stays. The photo stage (`.on-stage`) keeps the dark values. `tests/js/theme.test.ts` checks both palettes against WCAG AA.

### Named Rules
**The Amber Means Act Rule.** Amber marks what you can act on, what you picked and what it costs. Never decoration.

**The Shape As Well Rule.** A state is never told by colour alone: booked days are struck through, errors carry text.

## Typography

**Display Font:** Barlow Condensed (with Barlow, sans-serif), 600 and 700
**Body Font:** Barlow (with system sans-serif), 400 to 700

Both are self-hosted. Numerals are tabular.

### Hierarchy
- **Display** (700, 3.75rem to 6rem): car name on the stage, uppercase.
- **Headline** (700, 3rem to 4.5rem): page titles, uppercase.
- **Title** (700, 1.875rem): form headings, uppercase.
- **Body** (400, 1rem): everything else.
- **Label** (600, 0.875rem, `soft`): field labels and field errors.

Names typed by an admin can be long, so display text wraps anywhere instead of clipping. On the stage, a brand and model over 24 characters together drop to 2.25rem, 3rem from 1024px.

## Layout

The stage and search run full width; admin pages sit in a centred column (72rem), forms and messages in a narrow one (28rem). Side padding is `gutter`, `gutter-wide` from 640px.

On phones the date search comes first, then the stage. From 640px the stage comes first. The search form sits in the document where it is seen, so Tab follows the screen. The booking page puts photo and form side by side from 1024px. Header and admin navigation wrap when space runs out. Buttons, navigation links and the language switch are at least 44px tall.

## Elevation & Depth

Flat. Depth comes from the three ground tones (`night`, `deep`, `raise`) and the stage gradient fading the photo into the page. The only shadow is a soft dark text shadow behind the car name for legibility.

### Named Rules
**The No Glow Rule.** No glows and no coloured shadows.

## Shapes

Small corners: `sm` (4px) on controls and panels, `xs` (2px) on photos and day blocks. Full 1px borders.

## Components

### Buttons
`.btn` is solid amber. `.btn-quiet` is outlined in `edge` and turns amber on hover. `.btn-off` shows an unavailable action. A disabled button, while its request runs, is faded. Focus is a 3px amber outline, offset 2px.

### Inputs / Fields
`.input` on `deep` with an `edge` border. Errors turn the border `alert` and add text below, linked to the field. Required fields carry `required`, and the form says all fields are required.

### Navigation
Header: brand left, Admin link, HU/EN and the theme button (named for what a press does) right; the active language is amber and underlined. Admin navigation marks the current page with a `deep` fill and amber text.

### Notices and confirmation
`.notice` is a `raise` panel with a cobalt border. A request that gets no page back (offline, rate limit, server error) shows a notice with an `alert` border under the header, which stays at the top once scrolled (clear of the submit buttons). Closing it returns focus to where the visitor was. Destructive actions on the admin's data are confirmed inline in a notice, not in a modal.

### CarStage
Full-bleed photo with a gradient from `night` at the bottom to `dusk` at 55% at the top, so large text stays readable over a bright sky; name and action sit over it. The photo fades up from dark (0.9s, ease-out), off with reduced motion.

### DateStrip
One block per day. Free: `raise` fill with an `edge` outline. Selected: amber fill. Booked: `edge` outline with one diagonal slash. Selected and booked: `alert` fill with a `night` slash. No striped fills. The legend uses the same classes, and screen readers get the booked ranges as text.

### CarPhoto
The photo, or a line drawing when a car has none; on the stage the drawing sits above the name, not behind it. Shipped photos come as 320, 800, 1280 and 1920px WebP, plus a square cut for the stage below 640px. Where the car's name is written beside it, the picture is decorative.

## Do's and Don'ts

### Do:
- **Do** use the tokens; add one before writing a raw colour.
- **Do** give each page a title and a heading that can take focus.
- **Do** keep one car on stage at a time.

### Don't:
- **Don't** use `line` for anything the reader has to see to understand state.
- **Don't** add glows or coloured shadows without a new decision.
- **Don't** use `amber` for text or outlines: use `amber-ink`.
- **Don't** add a second authored motion.
