# Action Plan for Issue #6: Position of the Final Score

## Issue Summary
Change the layout to display metrics on the left side (60%) and the final score panel sticky on the right side (40%) in a side-by-side layout.

**Current Layout:**
```
Header
Property Title Input
Metrics (full width)
Score Panel (full width)
Footer Actions
```

**Target Layout:**
```
Header
Property Title Input
+-----------------------------------+-------------------+
|                                   |                   |
|  Metrics (60%)                    |  Score Panel (40%)|
|  - Rows of metric tiles           |  - Sticky         |
|                                   |  - Fixed position |
|                                   |                   |
+-----------------------------------+-------------------+
Footer Actions (full width)
```

## Action Plan

### 1. Analyze Current Layout Structure ✅
- **Current**: Vertical stack layout with full-width components
- **App.tsx**: Components rendered sequentially without wrapper
- **App.css**: Simple flex column layout
- **Impact**: Need to create a main content wrapper with two-column layout

### 2. Update App Component Structure
- Wrap `MetricsGrid` and `ScorePanel` in a new container div (`.app__main`)
- Keep `Header`, `PropertyTitleInput`, and `FooterActions` at full width
- Maintain existing component logic (no prop changes needed)

### 3. Update App.css for Two-Column Layout
- Create `.app__main` wrapper with flexbox/grid layout
- Set metrics area to 60% width
- Set score panel to 40% width with sticky positioning
- Add responsive breakpoint for mobile (stack vertically)
- Ensure proper spacing and overflow handling

### 4. Update ScorePanel.css (if needed)
- Remove existing margins that might conflict with new layout
- Ensure it works in sticky context
- Adjust max-width constraints
- Test overflow behavior

### 5. Test and Validate
- Run `npm run lint` to check for errors
- Run `npm run build` to ensure successful compilation
- Manual testing:
  - Desktop: Verify side-by-side layout (60/40 split)
  - Scroll behavior: Score panel stays sticky on right
  - Mobile: Verify it stacks vertically (score below metrics)
  - All screen sizes (tablet, desktop, wide desktop)
  - Score panel remains visible when scrolling metrics

### 6. Commit and Create PR
- Create feature branch: `feature/score-panel-right-layout`
- Commit with message: "feat: Position score panel on right side with sticky behavior"
- Push to GitHub
- Create pull request referencing issue #6

## Estimated Effort
- **Time**: 1-2 hours
- **Complexity**: Medium (layout restructuring, responsive design)
- **Files to modify**: 3 files (`App.tsx`, `App.css`, `ScorePanel.css`)

## Technical Details

### App.tsx Changes

**Before:**
```tsx
return (
  <div className="app">
    <Header onEditSettings={handleEditSettings} />
    <PropertyTitleInput value={propertyTitle} onChange={setPropertyTitle} />
    <MetricsGrid config={config} selections={selections} onSelect={handleSelect} />
    <ScorePanel propertyTitle={propertyTitle} scoreResult={scoreResult} />
    <FooterActions onReset={handleReset} onCopy={handleCopy} />
    <ConfigEditorModal ... />
  </div>
);
```

**After:**
```tsx
return (
  <div className="app">
    <Header onEditSettings={handleEditSettings} />
    <PropertyTitleInput value={propertyTitle} onChange={setPropertyTitle} />
    <div className="app__main">
      <MetricsGrid config={config} selections={selections} onSelect={handleSelect} />
      <ScorePanel propertyTitle={propertyTitle} scoreResult={scoreResult} />
    </div>
    <FooterActions onReset={handleReset} onCopy={handleCopy} />
    <ConfigEditorModal ... />
  </div>
);
```

### App.css Changes

**Add:**
```css
.app__main {
  display: flex;
  flex: 1;
  gap: 2rem;
  padding: 2rem;
  align-items: flex-start;
}

.app__main > *:first-child {
  flex: 0 0 60%;
  min-width: 0; /* Prevent flex overflow */
}

.app__main > *:last-child {
  flex: 0 0 40%;
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

@media (max-width: 1024px) {
  .app__main {
    flex-direction: column;
    gap: 1rem;
  }

  .app__main > *:first-child,
  .app__main > *:last-child {
    flex: 1 1 auto;
    position: static;
    max-height: none;
  }
}
```

### ScorePanel.css Changes

**Update:**
```css
.score-panel {
  /* Remove fixed margins that conflict with sticky layout */
  margin: 0; /* was: margin: 2rem; */
  /* Keep other styles */
}
```

## Notes
- Sticky positioning ensures score panel stays visible while scrolling through metrics
- 60/40 split provides good balance between content and summary
- Mobile breakpoint stacks components vertically for better UX
- MetricsGrid padding should be adjusted to remove conflicts
- ScorePanel already has internal padding, so container gap handles spacing

## Considerations
- Ensure score panel doesn't have max-width that's too restrictive for 40% viewport
- Test with long metric lists to ensure sticky behavior works smoothly
- Verify footer actions stay at bottom after layout change
- Check z-index doesn't conflict with modal or other overlays
