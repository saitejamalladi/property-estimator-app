# Action Plan for Issue #10: Add Category to Deal Breakers

## Issue Summary
Currently, the deal breakers section in the final score panel only shows the selected option label (e.g., "Poor", "Very Poor") without indicating which category/metric it belongs to. Users need to see both the category name and the failing option to understand which metrics are causing deal breakers.

**Current Display:**
```
Deal Breakers:
- Poor
- Very Poor
```

**Target Display:**
```
Deal Breakers:
- Schools: Poor
- Public Transport: Very Poor
```

## Action Plan

### 1. Analyze Current Implementation
- **ScorePanel.tsx**: Displays `failure.reason` from `scoreResult.failures`
- **computeScore.ts**: Creates failures with `{ metricId, reason: opt.label }`
- **App.tsx**: Passes `scoreResult` to ScorePanel but not `config`
- **Issue**: No way to look up metric labels from metricId in ScorePanel

### 2. Update ScorePanel Component
- Add `config` prop to ScorePanelProps
- Modify failure display to show `${metricLabel}: ${failure.reason}`
- Look up metric label using `config.metrics[failure.metricId].label`

### 3. Update App.tsx
- Pass `config` prop to ScorePanel component
- Ensure config is available when scoreResult is computed

### 4. Test and Validate
- Run `npm run lint` to check for errors
- Run `npm run build` to ensure successful compilation
- Manual testing:
  - Select deal breaker options in different categories
  - Verify deal breakers show "Category: Option" format
  - Check that non-deal-breaker selections don't appear in failures
  - Test with multiple deal breakers from same/different categories

### 5. Commit and Create PR
- Create feature branch: `feature/add-category-to-deal-breakers`
- Commit with message: "feat: Add category names to deal breaker display in score panel"
- Push to GitHub
- Create pull request referencing issue #10

## Estimated Effort
- **Time**: 30-45 minutes
- **Complexity**: Low (prop passing and string formatting)
- **Files to modify**: 2 files (`ScorePanel.tsx`, `App.tsx`)

## Technical Details

### ScorePanel.tsx Changes

**Before:**
```tsx
type ScorePanelProps = {
  propertyTitle: string;
  scoreResult: ScoreResult;
};
```

**After:**
```tsx
type ScorePanelProps = {
  propertyTitle: string;
  scoreResult: ScoreResult;
  config: Config;
};
```

**Failure Display Update:**
```tsx
{failures.map((failure, index) => {
  const metricLabel = config.metrics[failure.metricId]?.label || 'Unknown';
  return (
    <li key={index} className="score-panel__failure-item">
      {metricLabel}: {failure.reason}
    </li>
  );
})}
```

### App.tsx Changes

**ScorePanel Usage:**
```tsx
<ScorePanel
  propertyTitle={propertyTitle}
  scoreResult={scoreResult}
  config={config}
/>
```

## Notes
- The metricId is already available in the failure object from computeScore
- This change maintains backward compatibility with existing failure structure
- No changes needed to computeScore.ts or types.ts
- Deal breaker badges on tiles remain unchanged (they show "Deal Breaker" without category)

## Testing Checklist
- [ ] Deal breakers display category name + option label
- [ ] Multiple deal breakers from different categories work
- [ ] Deal breakers from same category show correctly
- [ ] No deal breakers when none selected
- [ ] Copy functionality includes category names in summary
- [ ] No console errors or TypeScript issues</content>
<parameter name="filePath">/Users/saiteja/personal/property-estimator/property-estimator-app/releases/10_add_category_to_deal_breakers.md