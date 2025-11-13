# Property Estimation — UI Layout & Component Design (Based on Reference Screenshot ![image1](image1))

This document maps the MVP scoring spec to a UI similar in feel to the provided reference (image1). Focus: single estimation screen, tile-based selections, final score panel, gate fail visibility.

## 1. High-Level Layout

| Zone | Purpose |
|------|---------|
| Header (top) | App title + optional link to GitHub repo |
| Property Input Bar | Text input for Property Title (inline under header) |
| Metrics Columns | 4 columns (Schools, Public Transport, Groceries, House Quality). Each column contains selectable tiles. |
| Right Sidebar (Score Panel) | Live computation: Base, Product factors breakdown, Final Score, Gate Fail banner & reasons. |
| Footer (Optional) | Reset, Copy Summary, (future: Config Editor / Add Metric) |

Viewport behavior:
- Desktop: Columns scroll vertically; Score Panel fixed (sticky) on right.
- Mobile: Score Panel collapses under columns; columns stack vertically.

## 2. Metrics Columns (Tile Interaction Model)

Each metric forms a column:
- Column Header: Metric Label (e.g., Schools), shows weight (e.g., 40%) and an info icon tooltip explaining influence.
- Tiles:
  - Radio selection behavior (one active).
  - Visual states:
    - Default (neutral border)
    - Selected (solid or highlighted with subtle background)
    - Gate Fail option (red outline by default; if selected, tile background tinted light red)
  - Content:
    - Title line (e.g., “4★ within 10 min”)
    - Multiplier value (e.g., “1.5×”) subdued small text
    - Optional short descriptor line
  - Accessibility:
    - Entire tile is a `<button>` or a `<label><input type="radio" …></label>` for keyboard navigation.
    - `aria-pressed="true"` when selected (if button approach).

Hover / focus feedback:
- Slight elevation/shadow or border color change.
- Focus ring for keyboard navigation.

## 3. Score Panel (Sidebar)

Elements:
1. Property Title Display (mirrors input)
2. Status Badge:
   - OK (green/neutral)
   - GATEFAIL (red with icon)
3. Final Score (big number)
4. Breakdown Table:
   - Base: 50
   - Schools multiplier contribution
   - Public Transport contribution
   - Groceries contribution
   - House Quality contribution
   - Product (overall combined factor)
   - Final (Base × Product)
5. Gate Fail Reasons List (only visible when status = GATEFAIL):
   - Bullet list of failing metric labels (e.g., “Groceries: > 20 min”)
6. Actions:
   - Reset Selections
   - Copy Summary (copies JSON + human-readable list)
   - (Future) Toggle “Show Weights” or “Edit Weights”

Styling suggestions:
- Dark panel (like reference) or light with clear contrast.
- Gate Fail banner: full-width tinted red box with concise message.

## 4. Visual Scaling & Density

Spacing:
- Column width: flexible; use CSS grid with `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))` for responsiveness.
- Tile height: ~120–150px (enough for 2–3 lines).
- Use consistent corner radius (6–8px).
- Weight label chips (e.g., “40%”) styled as small pill badges.

Color Mapping (suggested):
- Schools: Indigo / Blue highlight
- Public Transport: Teal / Green
- Groceries: Amber / Orange
- House Quality: Purple / Violet
- Gate Fail: Red (#D32F2F base, light tint for backgrounds)

Each selected tile uses a subtle background tint of its category color (10–12% alpha).

## 5. State Flow

On tile click:
- Update `selections[metricId]`.
- Recompute score:
  - Iterate metrics; accumulate product.
  - Collect gateFail reasons.
- Update Score Panel.

On Reset:
- Reapply defaults (first non-gateFail option in each metric).
- Clear gateFail reasons.
- Recompute.

On Copy:
- Construct JSON:
  ```json
  {
    "title": "123 Example Street",
    "selections": {
      "schools": "excellent_10m",
      "public_transport": "standard_20m",
      "groceries": "le_10m",
      "house_quality": "le_8y"
    },
    "status": "OK",
    "score": 67.3
  }
  ```
- Plus a human-friendly block:
  ```
  Property: 123 Example Street
  Schools: 4★ within 10 min (1.5×)
  Public Transport: Standard ≤ 20 min (1.2×)
  Groceries: ≤ 10 min (1.2×)
  House Quality: ≤ 8 years (1.15×)
  Final Score: 67.3 (OK)
  ```

## 6. Component Breakdown (React)

```
<App>
  <Header />
  <PropertyTitleInput />
  <MainLayout>
    <MetricsGrid>
      <MetricColumn id="schools">
        <MetricHeader />
        <TileList>
          <MetricTile ... />
        </TileList>
      </MetricColumn>
      <!-- repeat for other metrics -->
    </MetricsGrid>
    <ScorePanel />
  </MainLayout>
  <FooterActions />
</App>
```

### Key Components

- `MetricTile`
  Props: `selected: boolean`, `gateFail: boolean`, `label`, `multiplier`, `onSelect`
  Behavior: selection triggers parent update.

- `ScorePanel`
  Props: `score`, `status`, `failures`, `breakdown`
  Renders breakdown rows: `(m_i - 1) * w_i` contribution (optional detail popover).

- `useEstimationState()` hook
  - Holds `propertyTitle`, `selections`, `computeScore()`, `reset()`, `copy()`.
  - Exposes derived `status`, `failures`, `score`, `breakdown`.

### Breakdown Calculation (Optional Detail)
Show per metric:
- Multiplier m
- Weight w
- Effective factor: `1 + (m - 1) * w`
- Contribution delta: `((m - 1) * w * Base)` (if you want an absolute “points gained” view; this is auxiliary and not required in MVP)

## 7. Responsive & Accessibility

- Mobile:
  - Score Panel placed below metrics (order: Title Input, Metrics, Score).
  - Tiles become single-column or two-column grid.
- Keyboard:
  - Tab into a metric column; Arrow keys (optional enhancement) to move between tiles.
  - Each tile must have visible focus ring.
- ARIA:
  - Tiles grouped within a `role="radiogroup"`; each tile `role="radio"` with `aria-checked`.
  - Gate Fail banner announced with `role="alert"` when status changes to GATEFAIL.

## 8. Minimal Styling Tokens

```
--color-bg: #ffffff;
--color-panel-bg: #111827;
--color-text: #1f2937;
--color-border: #e5e7eb;
--radius: 8px;
--shadow-tile: 0 1px 2px rgba(0,0,0,0.08);
--color-gatefail-bg: #fdecea;
--color-gatefail-border: #f44336;
```

Category accent colors:
```
--accent-schools: #3b82f6;
--accent-transport: #10b981;
--accent-groceries: #f59e0b;
--accent-house: #8b5cf6;
```

## 9. Future Extensions (Placeholders)

- Add “More Metrics” expandable section.
- Weight editing mode (slider per metric).
- Benchmark band display once defined.
- Scenario comparison (Property A vs B) using tabs.

## 10. Example Skeleton Code (TypeScript)

```tsx
// computeScore.ts
export function computeScore(cfg, sel) {
  const base = cfg.aggregation.basePoints;
  const failures = [];
  let product = 1;
  for (const [metricId, metric] of Object.entries(cfg.metrics)) {
    const optionId = sel[metricId];
    const opt = metric.options.find(o => o.id === optionId);
    if (!opt) continue;
    if (opt.gateFail) failures.push({ metricId, reason: opt.label });
    const w = cfg.weights[metricId] ?? 0;
    product *= (1 + (opt.value - 1) * w);
  }
  return {
    status: failures.length ? "GATEFAIL" : "OK",
    score: Math.round(base * product * 100) / 100,
    product,
    failures
  };
}
```

```tsx
// MetricTile.tsx
function MetricTile({ selected, gateFail, label, multiplier, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        "tile" +
        (selected ? " tile--selected" : "") +
        (gateFail ? " tile--gatefail" : "")
      }
      aria-pressed={selected}
    >
      <div className="tile__label">{label}</div>
      <div className="tile__multiplier">{multiplier.toFixed(2)}×</div>
      {gateFail && <div className="tile__badge">Deal Breaker</div>}
    </button>
  );
}
```

## 11. Testing Checklist (MVP)

- Select each gate-fail option → red banner appears, score updates.
- Reset returns to defaults (no gate fails).
- Copy results includes status and current selections.
- Keyboard navigation covers all tiles.
- Mobile layout readable (no horizontal scroll).

---

## 12. Open Items (To Decide Later)

- Benchmark bands (e.g., Poor/Moderate/Good).
- Persistence (localStorage).
- Additional metric categories.
- Weight editing UI.
- Dark/light theme toggle.

---

## 13. Summary

We will implement a single-screen React UI with four metric columns styled as selectable tiles, a computed hybrid score (Base × Weighted Product), and an explicit gate fail warning state while preserving numeric output. This mirrors the clarity and visual affordance of the reference layout (image1) without overcomplicating the MVP.
