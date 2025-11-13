# Action Plan for Issue #12: Hover Effect on Metric Tile

## Issue Summary
Currently, metric tiles have basic hover effects (border color change and light box shadow), but the user experience can be enhanced with more engaging visual feedback. The goal is to implement subtle zoom effects, improved shadows for a "paper look", and better differentiation between hover and selected states.

**Current Hover Effects:**
- Border color changes to blue (#3b82f6)
- Light box shadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`

**Target Effects:**
1. Slight zoom in on hover (scale transform)
2. Normal position when not hovering
3. Enhanced box shadow for paper-like elevation
4. Improved visual distinction between hover and selected states
5. Smooth transitions for all effects

## Action Plan

### 1. Analyze Current Implementation
- **MetricTile.css**: Contains basic hover styles with border and shadow changes
- **MetricTile.tsx**: Uses CSS classes for selected and gatefail states
- **Current Issues**: No zoom effect, shadow could be more pronounced for "paper look"

### 2. Enhance Hover Effects
- Add `transform: scale(1.05)` for slight zoom on hover
- Increase box shadow intensity for better paper elevation effect
- Ensure smooth transitions with existing `transition: all 0.2s ease`

### 3. Improve Selected State Differentiation
- Add subtle zoom to selected tiles (scale(1.02)) to distinguish from hover
- Enhance selected state shadow to be more prominent than hover
- Consider background color adjustments for better visual hierarchy

### 4. Test Visual Effects
- Test hover effects across different tile states (normal, selected, gatefail)
- Verify smooth transitions and no layout shifts
- Check accessibility (focus states still work)
- Test on different screen sizes and zoom levels

### 5. Commit and Create PR
- Create feature branch: `feature/hover-effect-metric-tile`
- Commit with message: "feat: Enhance hover effects on metric tiles with zoom and improved shadows"
- Push to GitHub
- Create pull request referencing issue #12

## Estimated Effort
- **Time**: 20-30 minutes
- **Complexity**: Low (CSS-only changes)
- **Files to modify**: 1 file (`MetricTile.css`)

## Technical Details

### MetricTile.css Changes

**Enhanced Hover State:**
```css
.metric-tile:hover {
  border-color: #3b82f6;
  box-shadow: 0 8px 16px -2px rgba(0, 0, 0, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}
```

**Enhanced Selected State:**
```css
.metric-tile--selected {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
  box-shadow: 0 6px 12px -2px rgba(0, 0, 0, 0.12);
  transform: scale(1.02);
}
```

**Combined Hover + Selected State:**
```css
.metric-tile--selected:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px -2px rgba(0, 0, 0, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

## Notes
- Scale transforms maintain tile proportions and don't affect layout
- Enhanced shadows create better depth perception for "paper look"
- Selected tiles have subtle zoom to indicate state without being as prominent as hover
- All transitions use existing 0.2s ease timing for consistency
- No changes needed to TypeScript/React components

## Testing Checklist
- [ ] Hover effect shows 5% zoom with enhanced shadow
- [ ] Selected tiles show 2% zoom with medium shadow
- [ ] Hover on selected tile shows 5% zoom with full shadow
- [ ] Gatefail tiles maintain red border with new effects
- [ ] Focus states still work for accessibility
- [ ] No layout shifts or overlapping on hover
- [ ] Smooth transitions between all states
- [ ] Effects work on touch devices (if applicable)</content>
<parameter name="filePath">/Users/saiteja/personal/property-estimator/property-estimator-app/releases/12_hover_effect_on_metric_tile.md