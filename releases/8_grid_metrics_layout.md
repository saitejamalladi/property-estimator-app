# Action Plan for Issue #8: Change Metrics Layout

## Issue Summary
Change the metrics layout from rows with horizontal tiles to a grid layout where all metrics for a category are displayed in **columns** (vertically). Each metric tile should be a **square box**, and each category should have a **unique light background color**.

**Current Layout:**
```
+----------------------------------------------------------+
| Category Header (Schools) | [Tile1] [Tile2] [Tile3]    |
| Category Header (Transport) | [Tile1] [Tile2] [Tile3]  |
+----------------------------------------------------------+
```
Each row = one category with tiles horizontally arranged

**Target Layout:**
```
+----------------------------------------------------------+
| Schools (Category - unique color bg)                    |
| +--------+ +--------+ +--------+ +--------+             |
| | Tile 1 | | Tile 2 | | Tile 3 | | Tile 4 |             |
| | Square | | Square | | Square | | Square |             |
| +--------+ +--------+ +--------+ +--------+             |
|                                                          |
| Public Transport (Category - unique color bg)           |
| +--------+ +--------+ +--------+ +--------+             |
| | Tile 1 | | Tile 2 | | Tile 3 | | Tile 4 |             |
| +--------+ +--------+ +--------+ +--------+             |
+----------------------------------------------------------+
```
Each category = vertical stack with square tiles in horizontal row

## Action Plan

### 1. Analyze Current Layout Structure
- **Current**: MetricColumn uses flex-row with header on left, tiles on right
- **MetricColumn.css**: Header is 200px fixed, tiles wrap horizontally
- **MetricTile.css**: Tiles have min-height 80px, width 100%
- **Impact**: Need to change to vertical stack layout with square tiles

### 2. Define Dynamic Category Color Scheme
Create a fully dynamic color generation system so colors work even when categories are added/renamed, with no fixed palette or fixed number of colors:
- Hash metricId to generate a stable color per category (deterministic).
- Use HSL with low saturation and high lightness to ensure pastel/light backgrounds.

**Dynamic Hash-based Color Generation (Required)**
```typescript
function getCategoryColor(metricId: string): string {
  // Hash the metricId to get a number
  let hash = 0;
  for (let i = 0; i < metricId.length; i++) {
    hash = metricId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate light HSL color
  const hue = Math.abs(hash % 360);
  const saturation = 35; // Low saturation for pastel
  const lightness = 94;  // High lightness for light background
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
```

To improve contrast for text and borders over light backgrounds, also expose a computed border and text color:
```typescript
function getTextAndBorder(hslBg: string) {
  // naive parse for hsl(h, s%, l%) -> choose darker border and dark text
  return { text: '#111827', border: 'hsla(0, 0%, 0%, 0.12)' };
}
```

### 3. Update MetricColumn Component
- Change layout to vertical stack (flex-column)
- Move header above tiles (full width)
- Keep header styling (title + weight badge)
- Accept `categoryColor` prop from parent and apply via `style={{ backgroundColor: categoryColor }}`.
- Compute contrasting border/text if needed to maintain readability.

### 4. Create Color Utility Function
- Create `src/utils/categoryColors.ts` exporting:
  - `getCategoryColor(metricId: string): string` (hash-based HSL pastel; no fixed palette)
  - `getTextAndBorder(hslBg: string)` to return readable text and subtle border colors

### 5. Update MetricsGrid Component
- Import color utility function
- For deterministic colors across sessions and config changes, prefer the metricId-based color:
  - `const color = getCategoryColor(metricId)`
- Pass `categoryColor={color}` to `MetricColumn`

### 6. Update MetricColumn.css
- Remove flex-row, use flex-column for vertical stack
- Header takes full width (remove flex: 0 0 200px)
- Tiles container displays as horizontal row with wrap
- Remove hardcoded background color classes
- Base background will be set via inline style
- Ensure proper padding and spacing

### 7. Update MetricTile.css for Square Shape
- Change from `width: 100%` to fixed width
- Set equal width and height (aspect ratio 1:1)
- Adjust padding for square layout
- Center text content
- Ensure tiles are uniform size (e.g., 150px x 150px or use aspect-ratio)

### 8. Test and Validate
- Run `npm run lint` to check for errors
- Run `npm run build` to ensure successful compilation
- Manual testing:
  - Desktop: Verify vertical category layout with horizontal tiles
  - Square tiles: Check uniform sizing and appearance
  - Colors: Verify each category has unique, light background color
  - Dynamic: Add/remove categories via config to test color assignment
  - Responsive: Check mobile layout (tiles may stack or reduce size)
  - Interactions: Ensure selection, hover, focus states work

### 9. Commit and Create PR
- Create feature branch: `feature/grid-metrics-layout`
- Commit with message: "feat: Change metrics to vertical grid layout with square tiles and dynamic colors"
- Push to GitHub
- Create pull request referencing issue #8

## Estimated Effort
- **Time**: 2-3 hours
- **Complexity**: Medium (layout restructuring, sizing calculations, color theming)
- **Files to modify**: 4 files (`MetricColumn.tsx`, `MetricColumn.css`, `MetricTile.css`, `MetricsGrid.tsx`)

## Technical Details

### MetricColumn.tsx Changes

**Before:**
```tsx
<div className="metric-column">
  <div className="metric-column__header">
    <h3>{metric.label}</h3>
    <span>{weight}%</span>
  </div>
  <div className="metric-column__tiles">
    {tiles}
  </div>
</div>
```

**After:**
```tsx
<div className={`metric-column metric-column--${metricId}`}>
  <div className="metric-column__header">
    <h3>{metric.label}</h3>
    <span>{weight}%</span>
  </div>
  <div className="metric-column__tiles">
    {tiles}
  </div>
</div>
```

### MetricColumn.css Changes

**Update:**
```css
.metric-column {
  display: flex;
  flex-direction: column; /* Changed from row */
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  /* Background colors per category */
}

/* Remove category-specific classes; background applied inline via style */

.metric-column__header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%; /* Full width */
  margin-bottom: 0.5rem;
}

.metric-column__tiles {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
}
```

### MetricTile.css Changes

**Update:**
```css
.metric-tile {
  /* Square tiles with fixed dimensions */
  width: 150px;
  height: 150px;
  /* Or use aspect-ratio for responsive squares */
  /* aspect-ratio: 1 / 1; */
  /* width: calc((100% - 3rem) / 4); */
  
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  text-align: center; /* Center text in square */
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.metric-tile__label {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  font-size: 0.875rem; /* Smaller for square fit */
  text-align: center;
}

.metric-tile__multiplier {
  font-size: 0.75rem; /* Smaller for square */
  color: #6b7280;
  font-weight: 400;
}
```

## Dynamic Colors Reference

- Colors are generated per-category using `getCategoryColor(metricId)` with deterministic hashing.
- They are light pastels suitable for backgrounds with dark text.
- No fixed palette or fixed number of colors. New categories automatically receive a stable, unique light color.

## Responsive Considerations

### Desktop (>768px)
- Categories stack vertically
- Tiles display horizontally in rows (4 columns if space allows)
- Square tiles at fixed size (e.g., 150px)

### Tablet (768px - 480px)
- Categories stack vertically
- Tiles may wrap to 2-3 columns
- Tiles may reduce to ~120px or use percentage width

### Mobile (<480px)
- Categories stack vertically
- Tiles may display in 2 columns or single column
- Use percentage width with aspect-ratio for squares

## Notes
- Square tiles require careful sizing to fit labels and multipliers
- May need to adjust font sizes for smaller tiles
- Consider min-width to prevent tiles from being too small
- Background colors should be light enough to maintain readability
- Selected state should still be visible with colored backgrounds
- Deal breaker badge positioning needs testing in square layout

## Testing Checklist
- [ ] Each category has correct background color
- [ ] Tiles are square (equal width/height)
- [ ] All 4 options visible for each category
- [ ] Text fits well inside square tiles
- [ ] Selected state visible on colored backgrounds
- [ ] Hover and focus states work
- [ ] Deal breaker badges display correctly
- [ ] Mobile responsive layout works
- [ ] No horizontal scroll on any screen size
