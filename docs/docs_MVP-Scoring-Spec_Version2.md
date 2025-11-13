# Property Estimation — MVP Scoring + App/UI Spec

This document defines the MVP scoring logic, configuration, and the minimal React app/UI requirements to run a single-screen property estimator that can be hosted on GitHub Pages.

Status: MVP
Scope: Scoring model + one estimation screen. No data integrations in MVP.

---

## 1) Scoring Model (Hybrid)

- Formula
  - FinalScore = Base × Πi [1 + (m_i − 1) × w_i]
- Base score
  - Base = 50
- Weights
  - One weight per metric; each in [0, 1].
  - Recommended default weights (Σw_i = 1):
    - Schools: 0.40
    - Public Transport: 0.30
    - Groceries (major supermarkets): 0.20
    - House Quality (age/condition): 0.10
- Multipliers
  - Each option in a metric maps to m_i in [0.75, 1.5], where 1.0 is neutral.
- Gate fails (deal breakers)
  - Certain options can be flagged with gateFail: true.
  - If any selected option has gateFail: true:
    - Status = "GATEFAIL"
    - UI shows a red background banner with reasons.
    - Still compute and show the score as per the formula (do NOT zero out).

Notes:
- The [0.75, 1.5] multiplier band keeps effects bounded and predictable.
- Gate fails are explicit warnings (not silent zeros).

### 1.1 MVP Metrics and Bands

All multipliers adhere to [0.75, 1.5]. Default weights shown above.

1) Schools (quality + proximity)
- 4★ within 10 min → m = 1.50
- 3★ within 15 min → m = 1.20
- 2★ or farther → m = 1.00
- No acceptable school within target radius → m = 0.75, gateFail: true

2) Public Transport (availability/frequency)
- High frequency ≤ 10 min → m = 1.40
- Standard service ≤ 20 min → m = 1.20
- Limited / farther than 20 min → m = 1.00
- None within 20 min → m = 0.75, gateFail: true

3) Groceries (Coles/Woolworths/Aldi/IGA)
- ≤ 5 min → m = 1.50
- ≤ 10 min → m = 1.20
- ≤ 15 min → m = 1.00
- > 20 min → m = 0.75, gateFail: true

4) House Quality (age/condition)
- Brand new → m = 1.30
- ≤ 8 years → m = 1.15
- 8–15 years → m = 1.00
- > 15 years (poor condition) → m = 0.75, gateFail: true

Example:
- Weights: 0.40, 0.30, 0.20, 0.10
- Selections: 1.50, 1.20, 1.20, 1.15
- Product = (1 + 0.50×0.40) × (1 + 0.20×0.30) × (1 + 0.20×0.20) × (1 + 0.15×0.10)
          = 1.20 × 1.06 × 1.04 × 1.015 ≈ 1.345
- FinalScore ≈ 50 × 1.345 ≈ 67.3
- If any selection is a gate fail, status = GATEFAIL (red banner) but score is still shown.

### 1.2 Minimal JSON Config (Seed)

This is editable in-app later.

```json
{
  "aggregation": {
    "basePoints": 50,
    "formula": "Final = basePoints * product(1 + (m_i - 1) * w_i)"
  },
  "weights": {
    "schools": 0.40,
    "public_transport": 0.30,
    "groceries": 0.20,
    "house_quality": 0.10
  },
  "metrics": {
    "schools": {
      "label": "Schools",
      "options": [
        { "id": "excellent_10m", "label": "4★ within 10 min", "value": 1.5 },
        { "id": "good_15m", "label": "3★ within 15 min", "value": 1.2 },
        { "id": "acceptable", "label": "2★ or farther", "value": 1.0 },
        { "id": "none", "label": "No acceptable school", "value": 0.75, "gateFail": true }
      ]
    },
    "public_transport": {
      "label": "Public Transport",
      "options": [
        { "id": "high_freq_10m", "label": "High frequency ≤ 10 min", "value": 1.4 },
        { "id": "standard_20m", "label": "Standard ≤ 20 min", "value": 1.2 },
        { "id": "limited_far", "label": "Limited / farther", "value": 1.0 },
        { "id": "none_20m", "label": "None within 20 min", "value": 0.75, "gateFail": true }
      ]
    },
    "groceries": {
      "label": "Major Supermarkets",
      "options": [
        { "id": "le_5m", "label": "≤ 5 min", "value": 1.5 },
        { "id": "le_10m", "label": "≤ 10 min", "value": 1.2 },
        { "id": "le_15m", "label": "≤ 15 min", "value": 1.0 },
        { "id": "gt_20m", "label": "> 20 min", "value": 0.75, "gateFail": true }
      ]
    },
    "house_quality": {
      "label": "House Quality (Age/Condition)",
      "options": [
        { "id": "brand_new", "label": "Brand New", "value": 1.3 },
        { "id": "le_8y", "label": "≤ 8 years old", "value": 1.15 },
        { "id": "8_to_15y", "label": "8–15 years old", "value": 1.0 },
        { "id": "gt_15y_poor", "label": "> 15 years (poor)", "value": 0.75, "gateFail": true }
      ]
    }
  }
}
```

---

## 2) App Requirements (React + GitHub Pages)

- Tech
  - React (Vite or CRA). TypeScript recommended.
  - Deploy via GitHub Pages (static site build).
  - Source code in personal GitHub account repository.
- Pages
  - Single screen (Estimation screen). No routing required in MVP.
- Data/config
  - Load the JSON config at startup (inline import or local file).
  - Default selections pre-populated for all metrics (one option per metric).
  - Allow editing weights later (optional toggle; not required for MVP).
- Accessibility
  - Keyboard navigable tiles.
  - Clear color contrast for gate fail banner (red background).
  - Aria labels on interactive elements.

---

## 3) UI Requirements

- Header
  - App title.
- Property Title Input
  - Single text field to enter property title/name.
  - Persist in local state.
- Metric Categories Section
  - Categories: Schools, Public Transport, Groceries, House Quality.
  - Each metric is displayed as a set of “tiles” (radio-like selection).
  - Default tile is pre-selected per metric.
  - Tile includes: label, multiplier (optional to show), and a gate-fail badge if applicable.
- Score Panel (sticky or fixed to the right/bottom on desktop)
  - Shows:
    - Final score (computed live).
    - Status:
      - OK (normal)
      - GATEFAIL (red background banner)
    - If GATEFAIL: list each failing metric with its selected reason/label.
- Actions
  - Reset selections to defaults.
  - Copy results to clipboard (title, selections, score, status).
  - Optional: Export/import JSON config (post-MVP).
- Responsiveness
  - Tiles wrap to fit mobile width.
  - Score panel stacks below content on mobile.

---

## 4) State and Types

Minimal state shape:
```ts
type Selection = Record<string, string>; // metricId -> optionId

type AppState = {
  propertyTitle: string;
  selections: Selection;
  status: "OK" | "GATEFAIL";
  score: number;
  failures: { metricId: string; reason: string }[];
};
```

---

## 5) Scoring Function (Pseudocode)

```ts
type Option = { id: string; label: string; value: number; gateFail?: boolean };
type Metric = { label: string; options: Option[] };
type Config = {
  aggregation: { basePoints: number };
  weights: Record<string, number>;
  metrics: Record<string, Metric>;
};

type Selection = Record<string, string>;

export function computeScore(cfg: Config, sel: Selection) {
  const base = cfg.aggregation.basePoints;
  const failures: { metricId: string; reason: string }[] = [];
  let product = 1;

  for (const [metricId, metric] of Object.entries(cfg.metrics)) {
    const optionId = sel[metricId];
    const opt = metric.options.find(o => o.id === optionId);
    if (!opt) continue; // treat as “no change” if missing

    if (opt.gateFail) {
      failures.push({ metricId, reason: opt.label });
    }

    const w = cfg.weights[metricId] ?? 0;
    const m = opt.value; // expected in [0.75, 1.5]
    product *= (1 + (m - 1) * w);
  }

  const score = Math.round(base * product * 100) / 100;
  const status = failures.length > 0 ? "GATEFAIL" : "OK";

  return { status, score, failures };
}
```

---

## 6) Minimal UI Structure (Component Outline)

- App
  - Header
  - PropertyTitleInput
  - MetricsGrid
    - MetricGroup (Schools)
      - TileOption[]
    - MetricGroup (Public Transport)
      - TileOption[]
    - MetricGroup (Groceries)
      - TileOption[]
    - MetricGroup (House Quality)
      - TileOption[]
  - ScorePanel
    - ScoreValue
    - StatusBadge (red background if GATEFAIL)
    - FailuresList (only if GATEFAIL)
  - Footer Actions
    - ResetButton
    - CopyResultsButton

---

## 7) Deployment (GitHub Pages)

- Recommended: Vite + React + TS.
- Build command: `vite build` (outputs to `dist/`).
- Push to `gh-pages` branch using GitHub Actions or `vite-plugin-gh-pages`.
- Set repository Settings → Pages → Deploy from branch `gh-pages`.

---

## 8) Non-Goals in MVP

- No external data fetches or maps.
- No persistence beyond page lifetime (no database).
- No user accounts or auth.
- No benchmarking bands (to be decided post-evaluation).

---

## 9) Next Steps

- Implement the React app shell with tiles and score panel.
- Wire the `computeScore` function to live selections.
- Add copy/reset actions.
- Validate on a few sample properties, then define benchmark bands.
