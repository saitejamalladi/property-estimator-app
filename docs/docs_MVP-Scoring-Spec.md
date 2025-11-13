# Property Estimation MVP — Scoring Model

Scope: This document captures the agreed MVP scoring logic and data model for the estimation screen. We’ll discuss app UI/features next.

## 1) Model Overview

- Formula (Hybrid, multiplicative uplift):
  - FinalScore = Base × Πi [1 + (m_i − 1) × w_i]
- Base score:
  - Base = 50
- Weights:
  - One weight per metric, each in [0, 1]. Recommended to normalize so Σw_i = 1 for interpretability, but not strictly required.
- Multipliers:
  - Each metric selection maps to a multiplier m_i in [0.75, 1.5], where 1.0 is neutral.
- Gate fails (deal breakers):
  - Each metric option can be flagged with gateFail: true.
  - If any selected option has gateFail: true:
    - status = "GATEFAIL" (show red background banner and list blocking reasons)
    - Still compute the score using the selected multipliers. Do NOT zero it out.

Notes:
- Keeping multipliers in [0.75, 1.5] avoids extreme swings and enables intuitive tuning.
- Gate fails are explicit, user-visible blockers rather than silently collapsing the score.

## 2) MVP Metrics (4)

Prioritized metrics and suggested default weights (editable later):
- Schools: w = 0.40
- Public Transport: w = 0.30
- Groceries (major supermarkets): w = 0.20
- House Quality (age/condition): w = 0.10

These default weights sum to 1.00. You can adjust per preference as long as each is in [0, 1].

### Metric option bands and multipliers

All multipliers adhere to [0.75, 1.5].

1) Schools (quality + proximity)
- 4★ within 10 min → m = 1.50
- 3★ within 15 min → m = 1.20
- 2★ or farther → m = 1.00
- No acceptable school within target radius → m = 0.75, gateFail: true

2) Public transport (availability/frequency)
- High frequency ≤ 10 min → m = 1.40
- Standard service ≤ 20 min → m = 1.20
- Limited / farther than 20 min → m = 1.00
- None within 20 min → m = 0.75, gateFail: true

3) Groceries (Coles/Woolworths/Aldi/IGA)
- ≤ 5 min → m = 1.50
- ≤ 10 min → m = 1.20
- ≤ 15 min → m = 1.00
- > 20 min → m = 0.75, gateFail: true

4) House quality (age/condition)
- Brand new → m = 1.30
- ≤ 8 years → m = 1.15
- 8–15 years → m = 1.00
- > 15 years (poor condition) → m = 0.75, gateFail: true

## 3) Calculation Details

- FinalScore = Base × Πi [1 + (m_i − 1) × w_i]
  - Base = 50
  - m_i ∈ [0.75, 1.5]
  - w_i ∈ [0, 1] (recommended Σw_i = 1)

Example:
- Weights: schools 0.40, transport 0.30, groceries 0.20, house 0.10
- Selections: schools 1.50, transport 1.20, groceries 1.20, house 1.15
- Product = (1 + 0.50×0.40) × (1 + 0.20×0.30) × (1 + 0.20×0.20) × (1 + 0.15×0.10)
          = 1.20 × 1.06 × 1.04 × 1.015 ≈ 1.345
- FinalScore ≈ 50 × 1.345 ≈ 67.3
- If a selected option is a gate fail (e.g., groceries > 20 min → gateFail), status becomes GATEFAIL, but the score is still computed and shown.

## 4) Gate Fail Behavior (Deal Breakers)

- Gate failures are explicit flags on certain options (e.g., “No public transport within 20 min”).
- UI:
  - Show a red background banner and list all gate fail reasons.
  - Keep the numeric score visible (computed as usual).
- Rationale:
  - You can still compare properties numerically while being clearly warned there is a deal-breaking condition.

## 5) Minimal JSON Config (Seed)

This seed is intentionally small and focused on the MVP. Values can be edited in-app.

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

## 6) Minimal Pseudocode

```ts
type Option = { id: string; label: string; value: number; gateFail?: boolean };
type Metric = { label: string; options: Option[] };
type Config = {
  aggregation: { basePoints: number };
  weights: Record<string, number>;
  metrics: Record<string, Metric>;
};

type Selection = Record<string, string>; // metricId -> optionId

function computeScore(cfg: Config, sel: Selection) {
  const base = cfg.aggregation.basePoints;
  const failures: { metricId: string; reason: string }[] = [];
  let product = 1;

  for (const [metricId, metric] of Object.entries(cfg.metrics)) {
    const optionId = sel[metricId];
    const opt = metric.options.find(o => o.id === optionId);
    if (!opt) continue; // treat as not selected (no change)

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

## 7) Benchmarking

- You’ll define bands/percentiles later after reviewing a few properties. No bands are enforced in MVP.

## 8) Next

- Discuss app UI/feature set and how to capture/edit the JSON config in-app.
- Add additional metrics (crime, healthcare, parks, etc.) with safe multipliers and optional gate fails.