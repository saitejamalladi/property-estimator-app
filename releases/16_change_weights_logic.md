# Action Plan for Issue #16: Change the weights logic

## Issue Summary
Modify the scoring logic to allow users to input raw weight values instead of normalized percentages that must sum to 1. The app will automatically calculate and display percentages based on the raw values.

**Current behavior:**
- Users must enter weights that sum to exactly 1.0 (e.g., schools: 0.4, public_transport: 0.3, groceries: 0.2, house_quality: 0.1)
- Validation enforces weights sum to 1

**Target behavior:**
- Users enter any positive numbers (e.g., schools: 4, public_transport: 1, groceries: 3, house_quality: 12)
- App calculates percentages: schools 20%, public_transport 5%, groceries 15%, house_quality 60%
- App displays these percentages in the UI
- Internally normalizes weights for scoring calculation

## Action Plan

### 1. Analyze Current Implementation ✅
- **Weights storage**: Currently stored as normalized values (0-1) in `Config.weights`
- **Validation**: Both `ConfigEditorModal.tsx` and `SettingsPage.tsx` enforce weights sum to 1
- **Display**: `MetricColumn.tsx` shows `(weight * 100).toFixed(0)}%`
- **Computation**: `computeScore.ts` uses weights directly in formula
- **Impact**: Need to store raw weights, normalize for computation, display calculated percentages

### 2. Update Type Definitions
- Modify `Config.weights` type to allow any positive numbers
- Consider adding computed percentages to types if needed for UI

### 3. Create Weight Normalization Utility
- Add function to convert raw weights to normalized values (divide by sum)
- Add function to calculate display percentages from raw weights
- Place in `src/utils/weights.ts` or similar

### 4. Update Scoring Logic
- Modify `computeScore.ts` to normalize weights before using in calculation
- Ensure backward compatibility with existing configs

### 5. Update Validation Logic
- Remove "weights must sum to 1" validation from `ConfigEditorModal.tsx` and `SettingsPage.tsx`
- Add validation for positive numbers only
- Update JSON schema to allow weights > 1

### 6. Update UI Display Logic
- Modify `MetricColumn.tsx` to display calculated percentages instead of stored weights
- Add percentage calculation logic to component

### 7. Update Default Configuration
- Change `DEFAULT_CONFIG` in `config.ts` to use raw weight values
- Update example values to demonstrate the new input format

### 8. Test and Validate
- Run `npm run lint` and `npm run build`
- Test with various weight combinations
- Verify scoring calculations remain accurate
- Test UI displays correct percentages
- Test config editing and saving

## Estimated Effort
- **Time**: 2-3 hours
- **Complexity**: Medium (data structure changes, multiple file updates)
- **Files to modify**: 6+ files (`types.ts`, `computeScore.ts`, `config.ts`, `ConfigEditorModal.tsx`, `SettingsPage.tsx`, `MetricColumn.tsx`, new utility file)

## Technical Details

**Weight Normalization Function:**
```typescript
export function normalizeWeights(weights: Record<string, number>): Record<string, number> {
  const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
  const normalized: Record<string, number> = {};
  for (const [key, value] of Object.entries(weights)) {
    normalized[key] = value / total;
  }
  return normalized;
}

export function calculatePercentages(weights: Record<string, number>): Record<string, number> {
  const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
  const percentages: Record<string, number> = {};
  for (const [key, value] of Object.entries(weights)) {
    percentages[key] = (value / total) * 100;
  }
  return percentages;
}
```

**Updated Config Interface:**
```typescript
export type Config = {
  aggregation: {
    basePoints: number;
    formula: string;
  };
  weights: Record<string, number>; // Now stores raw values, not normalized
  metrics: Record<string, Metric>;
};
```

**Updated computeScore:**
```typescript
export function computeScore(cfg: Config, sel: Selection): ScoreResult {
  // ... existing code ...
  const normalizedWeights = normalizeWeights(cfg.weights);
  
  for (const [metricId, metric] of Object.entries(cfg.metrics)) {
    // ... existing code ...
    const w = normalizedWeights[metricId] ?? 0; // Use normalized weight
    // ... rest of calculation ...
  }
  // ... rest of function ...
}
```

## Development Workflow and Git Steps (MANDATORY)

Follow the repository's Copilot workflow requirements.

1. Create feature branch from remote main (FIRST STEP)

```bash
git checkout -b feature/change-weights-logic origin/main
```

2. Implement the changes as outlined above

3. Run quality checks (MANDATORY)

```bash
npm run lint
npm run build
```

4. Commit with a Conventional Commit message and include the issue reference

```bash
git add .
git commit -m "feat: Change weights logic to use raw values with auto-normalization

- Store raw weight values instead of normalized percentages
- Add weight normalization utility functions
- Update scoring logic to normalize weights internally
- Display calculated percentages in UI
- Remove sum-to-1 validation, allow positive numbers only
- Update default config with example raw values

Closes #16"
```

5. Push and open a Pull Request

```bash
git push origin feature/change-weights-logic
```

Create the PR via GitHub UI (link appears in terminal or use repo URL) and use the PR template.

## Pre-PR Checklist
- [x] Release documentation file created/updated in `releases/` (this file)
- [x] `npm run lint` passes with no errors
- [x] `npm run build` completes successfully (no TS errors)
- [x] Manual testing completed (desktop + mobile responsiveness)
- [x] Scoring calculations verified with various weight combinations
- [x] Config editing and saving works with new validation
- [x] Percentages display correctly in UI
- [x] Accessibility respected (keyboard navigation, ARIA labels)
- [x] Feature branch created from `origin/main` as FIRST STEP
- [x] Descriptive branch name used
- [x] Commit message uses Conventional Commits and references issue

## Notes
- Backward compatibility: Existing configs with normalized weights should still work
- Migration: Consider adding migration logic if needed for existing user configs
- UI: Percentages should be displayed with appropriate precision (0 decimal places)
- Validation: Allow any positive numbers, but consider minimum values to prevent division by zero</content>
<parameter name="filePath">/Users/saiteja/personal/property-estimator/property-estimator-app/releases/16_change_weights_logic.md