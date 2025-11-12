# Action Plan for Issue #4: Change Metric Value Position

## Issue Summary
Move the metric multiplier value to display **inline with the label** in parentheses instead of on a separate line.

**Current format:**
```
4★ within 10 min
1.5×
```

**Target format:**
```
4★ within 10 min (1.5×)
```

## Action Plan

### 1. Analyze Current UI Structure ✅
- **Current Implementation**: `MetricTile.tsx` displays label and multiplier in separate `<div>` elements
- **Current CSS**: `.metric-tile__label` and `.metric-tile__multiplier` are styled independently
- **Impact**: Need to merge these into a single display line

### 2. Update MetricTile Component
- Modify `MetricTile.tsx` to combine label and multiplier in one `<div>`
- Format as: `{label} ({value}×)`
- Remove the separate `.metric-tile__multiplier` div
- Preserve accessibility attributes

### 3. Update CSS Styling
- Update `MetricTile.css` to remove `.metric-tile__multiplier` styles
- Add styling for inline multiplier display (e.g., lighter color, smaller font-weight for the parenthetical)
- Ensure proper spacing and readability
- Test on mobile/desktop layouts

### 4. Test and Validate
- Run `npm run lint` to check for errors
- Run `npm run build` to ensure successful compilation
- Manual testing:
  - Verify all 4 metrics display correctly
  - Check mobile responsiveness
  - Ensure "Deal Breaker" badge still displays properly
  - Test selected/unselected states

### 5. Commit and Create PR
- Create feature branch: `feature/inline-metric-value`
- Commit with message: "feat: Display metric multiplier inline with label"
- Push to GitHub
- Create pull request referencing issue #4

## Estimated Effort
- **Time**: 30-45 minutes
- **Complexity**: Low (UI-only change, no logic modification)
- **Files to modify**: 2 files (`MetricTile.tsx`, `MetricTile.css`)

## Technical Details

**Before:**
```tsx
<div className="metric-tile__label">{option.label}</div>
<div className="metric-tile__multiplier">{option.value.toFixed(2)}×</div>
```

**After:**
```tsx
<div className="metric-tile__label">
  {option.label} <span className="metric-tile__multiplier">({option.value.toFixed(2)}×)</span>
</div>
```

## Notes
- This is a visual-only change; no logic modification required
- Maintains existing accessibility features
- Example output: "4★ within 10 min (1.5×)"
