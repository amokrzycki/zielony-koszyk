---
name: Zielony Koszyk
description: A warm, fresh Polish online grocery — produce-stall green on warm neutrals, soft-lifted panels, tactile pill controls.
colors:
  primary: "#00ce7c"        # Market Green
  primary-deep: "#007d4e"   # Deep Leaf
  forest-ink: "#0b1410"     # Forest Ink
  warm-linen: "#e1dada"     # Warm Linen
  paper: "#ffffff"
  warm-slate: "#5d5252"
  cellar-black: "#121212"
  cellar-panel: "#1e1e1e"
  market-ash: "#a0a0a0"
typography:
  display:
    fontFamily: "Lato, sans-serif"
    fontSize: "clamp(2.4rem, 6vw, 4.25rem)"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Lato, sans-serif"
    fontSize: "clamp(1.9rem, 3.6vw, 2.9rem)"
    fontWeight: 900
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Lato, sans-serif"
    fontSize: "clamp(1.6rem, 3vw, 2.1rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Lato, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  small:
    fontFamily: "Lato, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.45
  caption:
    fontFamily: "Lato, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.3
  label:
    fontFamily: "Lato, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  sm: "4px"
  input: "12px"
  row: "14px"
  media: "18px"
  panel: "24px"
  panel-lg: "28px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.pill}"
    padding: "11px 20px"
  nav-pill:
    backgroundColor: "transparent"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.panel}"
    padding: "24px"
  input-field:
    backgroundColor: "transparent"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.input}"
    padding: "16px 14px"
---

# Design System: Zielony Koszyk

## Overview

**Creative North Star: "The Green Grocer's Table"**

Zielony Koszyk is a neighborhood produce stall rendered as software: warm, generous, and human. The screen should feel like a table someone set for you — produce up front and real, surfaces warm off-white rather than clinical, controls rounded like the goods themselves. Green appears the way fresh stock does in a real shop: as a signal, not a coat of paint.

The mood is **warm and fresh**; the components are **tactile and confident**. Buttons are fat pills that lift under the cursor and commit on click. Panels sit flat with a hairline border and one soft shadow, then rise a couple of pixels when they are interactive. Nothing is glossy, nothing glows, nothing is cold. Density is comfortable rather than dense: this is a store someone browses, not a control room.

The world was chosen against a cold, high-tech grocery aesthetic. Warmth is structural here: the neutral background is a warm linen, not a gray, and Forest Ink stands in for pure black wherever the brand speaks. Typography carries the energy that the palette rations — headings are heavy Lato with tight tracking, body text is calm and readable.

**Key Characteristics:**
- Warm linen neutrals, never cold gray or stark monochrome.
- Market Green used as a signal (action, active, fresh), not a background wash.
- Soft-cornered throughout: pills for actions, 24 px panels, 12 px fields. No sharp corners.
- One soft lift on raised surfaces; flat at rest.
- Heavy display type with tight tracking over calm, readable body copy.
- Motion eases out fast (`cubic-bezier(0.16, 1, 0.3, 1)`) and stays under 400 ms.

## Colors

A single bright produce green against warm paper neutrals, with a forest-dark ink for anything the brand says out loud.

### Primary
- **Market Green** (#00ce7c): the freshness signal. Primary action backgrounds, active nav and filter states, focus outlines, small accent text, and low-alpha tints (0.06–0.18). It is the only accent in the system.
- **Deep Leaf** (#007d4e): the light-mode-safe green. Brand green is only ~2:1 on white, so small green text on light surfaces drops to Deep Leaf (~5.2:1). In dark mode, small accent text uses Market Green itself.

### Neutral
- **Warm Linen** (#e1dada): the light-mode page background. Warm, not gray — this is the single strongest "not a tech product" tell.
- **Paper** (#ffffff): light-mode raised surfaces (panels, cards, inputs).
- **Warm Slate** (#5d5252): light-mode secondary text. Darkened to clear 4.5:1 on Warm Linen.
- **Forest Ink** (#0b1410): the brand's black. Footer background, the auth brand panel, and the label color on Market Green. Never pure #000 for brand chrome.
- **Cellar Black** (#121212): dark-mode page background.
- **Cellar Panel** (#1e1e1e): dark-mode raised surfaces.
- **Market Ash** (#a0a0a0): dark-mode secondary text. Dividers use a 1px hairline at 10–12% opacity.

**The Rationed Green Rule.** Market Green covers at most about a tenth of any screen. Its rarity is what makes an action, an active state, or a fresh label read instantly. Backgrounds and large fills stay neutral.

**The Warm Neutral Rule.** Light surfaces are Warm Linen and Paper; dark surfaces are Cellar Black and Cellar Panel. No cool gray, no blue-tinted white, no pure #000/#fff chrome.

**The Ink-on-Green Rule.** Anything sitting on Market Green is Forest Ink. White on green fails contrast and is never used.

## Typography

**Display Font:** Lato (with a sans-serif fallback), self-loaded from Google Fonts, weights 300–900.
**Body Font:** Lato — the same family carries every role.

**Character:** A humanist sans with a high x-height and rounded, open forms — friendly and legible at small sizes, and confident when pushed to 800–900 weight for display. A single family keeps the store warm and unfussy; hierarchy comes from weight, size, and tracking rather than a second face.

### Hierarchy
- **Display** (900, `clamp(2.4rem, 6vw, 4.25rem)`, line-height 1.03–1.1, tracking -0.035em): hero and page-opening headlines. `text-wrap: balance`.
- **Headline** (900, `clamp(1.9rem, 3.6vw, 2.9rem)`, line-height 1.08, tracking -0.03em): major section headings and closing banners.
- **Title** (800, 1.35–1.7rem / MUI `h4`, line-height 1.2, tracking -0.02em): panel and page titles.
- **Body** (400, 1rem, line-height 1.5, max 65–75ch): standard copy; lead paragraphs run 1.05–1.15rem at line-height 1.65.
- **Small** (400, 0.95rem, line-height 1.45): secondary copy — list and tile descriptions, footers, benefit lines.
- **Caption** (700, 0.875rem, line-height 1.3): compact UI text — nav labels, avatars, status and identity chips.
- **Label** (800, 0.8rem, tracking 0.08em, uppercase): footer and section labels. MUI `overline`-like.

**The Heavy Headline Rule.** Headings are 800–900 weight with negative tracking. Never set a display or headline at a light weight — the palette is quiet, so the type carries the energy.

## Layout

An 8 px base unit drives MUI spacing (`sx` 1 = 8 px). Page shells are centered columns with a responsive horizontal gutter: catalogue and marketing surfaces cap at **1560 px**; auth, account, and checkout surfaces cap at **1080 px**. Gutters step `{ xs: 2–3, sm: 3–6, lg: 4–10 }` (16–80 px). Vertical rhythm is generous: sections run `py` 8–14 (64–112 px+) with `borderTop` hairlines separating bands rather than cards stacking.

Multi-column grids are declared per breakpoint and collapse to a single column on phones — e.g. `gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }`. Content widths are held with `mx: "auto"` and `maxWidth` rather than full-bleed. Body measure stays under ~75ch.

Motion is part of layout rhythm: state transitions use `cubic-bezier(0.16, 1, 0.3, 1)` over 200–400 ms; image and card transforms can stretch to 700 ms for the slow photo zoom. Entrances do not animate — motion is reserved for interaction and state feedback.

## Elevation & Depth

Depth is **soft and restrained**. Surfaces are flat at rest with a 1px hairline border; raised surfaces carry a single soft shadow with a real vertical offset and a large blur. Interaction adds a deeper shadow and a 2 px lift. There are no inner shadows, no glowing halos, and no hard offset (zero-blur) shadows — a zero-offset colored halo is decoration, not depth.

### Shadow Vocabulary
- **Header** (`0 1px 2px rgba(15,23,20,0.05), 0 14px 30px -24px rgba(15,23,20,0.5)`): the sticky top bar's separation from content.
- **Panel** (light `0 18px 44px rgba(15,40,28,0.12)`; dark `0 18px 44px rgba(0,0,0,0.55)`): the resting shadow under every raised panel and card.
- **Card hover** (light `0 22px 50px rgba(15,40,28,0.16)`; dark `0 22px 50px rgba(0,0,0,0.6)`): deeper shadow paired with `translateY(-2px)` on an interactive card.
- **Media** (light `0 24px 60px rgba(15,40,28,0.16)`; dark `0 24px 60px rgba(0,0,0,0.5)`): large photography blocks.

**The Soft Lift Rule.** Flat at rest; one soft, offset, blurred shadow on raised surfaces; deeper shadow plus a 2 px lift on hover. Never a hard or zero-blur shadow.

## Shapes

The form language is rounded and consistent: **pills for anything you press**, soft rectangles for anything you read.
- **Pills** (999px) — buttons, nav links, chips, status pills, filter toggles.
- **Panels** (24px; 28px for feature panels and hero media blocks) — cards, account shell, list panels, the auth frame.
- **Media tiles** (18px) — product photo wells; **tint boxes** (16px) for quiet green-washed callouts.
- **Drawer rows** (14px) and **fields** (12px).
- **Circles** (50%) — icon medallions and avatars.
- **Borders** are always 1px hairlines in the divider color; never 2px+, never a colored left/right accent bar.

## Components

### Buttons
- **Shape:** full pill (999px), `px: 24px`, `py: 12px`, weight 700, `textTransform: none`.
- **Primary:** Market Green background with Forest Ink label, no resting shadow. Used for the one decisive action in a group.
- **Hover / Focus:** hover keeps the green and lifts `translateY(-2px)` over 300 ms `EASE`; `:focus-visible` draws a 2 px Market Green outline at 3 px offset. Disabled falls back to MUI `action.disabledBackground` / `action.disabled`.
- **Ghost:** transparent pill with a 1px divider border and `text.primary` label; hover turns label and border to the accent. This is the secondary choice beside a primary CTA.

### Chips
- **Style:** MUI `Chip`, MUI `default`/`success` color tokens; the MFA status chip uses `success` when active and `default` when off.
- **State:** filter chips mirror the nav-pill treatment — transparent at rest, green text plus a green tint on hover/active.
- **Order-status pill:** order states collapse to three semantic buckets, not a per-status rainbow. Forward states (new, in progress, to be shipped, shipping) wear Deep Leaf text on a green tint with a green border; finished states (delivered, done) grey out to secondary text on `action.hover`; states waiting on the customer (payment, confirmation) use primary text on `action.hover` with a Warm Slate hairline. One pill style, reused in tables, cards, and the order header.

### Cards / Containers
- **Corner Style:** 24px (`panelSx`); 28px for feature panels.
- **Background:** Paper in light, Cellar Panel in dark.
- **Border:** 1px divider hairline.
- **Shadow Strategy:** the Panel shadow at rest (see Elevation).
- **Internal Padding:** 16–32px (`p: 2`–`p: 4`), scaled up on desktop.
- **Interaction:** interactive cards (product rows) lift `translateY(-2px)`, shift the border to Market Green, deepen to the Card-hover shadow, and slowly scale the photo to 1.05.

### Inputs / Fields
- **Style:** MUI `OutlinedInput` with a 12px radius, 1px divider border, transparent-to-paper fill.
- **Focus:** MUI focus ring in Market Green; label shrinks to `lineHeight: 1` so Polish diacritics ("ę", "ą") clear the top border.
- **Error / Disabled:** MUI `error` color with helper text below; disabled uses MUI's disabled tokens.

### Navigation
- **Style:** sticky `AppBar`, Paper background, `backgroundImage: none`, 1px bottom divider, Header shadow. Desktop height 72px, mobile 64px.
- **Links:** nav pills — 0.9375rem, weight 700, transparent at rest; hover turns text Market Green with a green tint background; active (`.active` / `aria-current`) text is Market Green on a stronger tint. `:focus-visible` draws a 2 px green outline at 2 px offset.
- **Mobile:** a right-side drawer of full-width rows (14px radius, weight 600, `navRowSx`), with the brand logo at the top and grouped sections split by dividers.

### Signature: Account toolbar
The account shell (`AccountView`) is a 24px panel capped at 1080px with a faint radial Market Green wash bleeding in from the top-right corner. A single toolbar row holds breadcrumbs on the left and an identity pill on the right — a round Forest-Ink-initial avatar plus "Witaj, {imię}!" on a green tint — separated from the page body by a 1px divider. It personalizes the account area without a second card.

### Signature: Brand auth panel
The login surface pairs a Forest Ink panel (radial Market Green at the top-right, logo, heavy display headline, green check medallions) with a light forms panel, joined inside one 24px frame. It is the fullest expression of the world: dark brand block on one side, warm calm work surface on the other.

### Signature: Admin rail
The admin console (`MainView`, everything behind `/admin/*`) is a 24px panel split into a fixed Forest Ink left rail and a calm Paper work area — the inverse of a storefront card. The rail carries a radial Market Green wash at the top-left (0.16 alpha, fading by 45%), the brand lockup, grouped nav rows (14px radius, 700 weight, compressed hints) and an account block at the foot. Nav rows are tuned for the dark ground: white at 72% at rest, white on a 0.08 white wash on hover, and the active row at `accentText` on a 0.16 green tint with `:focus-visible` in green. Below `md` the rail collapses to the same rows inside a drawer, with a top bar and menu button in the work area. This is where the brand commits on a task surface.

### Signature: Admin page-frame primitives
The console's per-page chrome is a small set of reusable primitives rather than bespoke layouts: `AdminPageHeader` (green icon medallion, heavy title with tight tracking, one factual subtitle, page actions right), `AdminModal` (24px paper panel, hairline, Panel shadow, one faint radial green corner wash, heavy title, labelled close), `AdminEmpty`, `AdminError`, and the `AdminLoading` skeleton panel. The DataGrid surface adds three conventions on the same system: brand-tinted uppercase column headers (`0.06` tone), hover rows that pick up the green tint, and monospace-ish ID cells kept in the single Lato family — machine values set quiet and tabular so the eye skips them, with money cells right-aligned and `tabular-nums`. The `adminStyles.ts` helpers (`adminGridSx`, `adminPanelSx`, `adminSubheadingSx`, `moneyCellSx`, `monoCellSx`, `orderStatusChipSx`) are the admin's extension of `listingStyles.ts`, not a second system.

## Do's and Don'ts

### Do:
- **Do** ration Market Green — action, active state, and freshness signals only, roughly ≤10% of a screen. The Rationed Green Rule.
- **Do** keep light backgrounds Warm Linen and Paper and dark backgrounds Cellar Black and Cellar Panel. The Warm Neutral Rule.
- **Do** put Forest Ink on Market Green; never white. The Ink-on-Green Rule.
- **Do** keep pills at 999px, panels at 24px (28px feature), fields at 12px, and every border a 1px hairline.
- **Do** use `cubic-bezier(0.16, 1, 0.3, 1)` for state transitions, 200–400 ms.
- **Do** ship hover, `:focus-visible`, disabled, loading, and error states for every control.
- **Do** set headings at 800–900 weight with negative tracking and keep body measure under ~75ch.
- **Do** reuse the shared styles (`panelSx`, `ctaButtonSx`, `ghostButtonSx`, `navPillSx`, `tone`, `accentText`) instead of re-inlining them, so dark mode and contrast stay correct.

### Don't:
- **Don't** set white (or near-white) text on Market Green — contrast fails.
- **Don't** use hard offset / zero-blur shadows or sharp 0-radius corners.
- **Don't** introduce cool tech-blue, blue-tinted white, or stark monochrome; warmth is the identity.
- **Don't** use emoji or unicode glyphs as icons; use the drawn MUI icon set at consistent size and weight.
- **Don't** use gradient text, glassmorphism, blur as decoration, or neon glow; emphasis comes from weight and size.
- **Don't** flood large light surfaces with Market Green; tint it at 0.06–0.18 alpha when you need a wash.
- **Don't** set display or headline text at light weights.
- **Don't** carry the formal "Państwo" voice — copy is informal Polish ("Ty"), per PRODUCT.md.
