# Action Plan for Issue #16: Change the weights logic

## Issue Summary
Modify the scoring logic to simplify weight management. Instead of requiring users to balance weights to sum to 1.0, allow users to input any positive numbers they prefer. The app will automatically calculate and display the percentage distribution based on the relative weights.

**Example:**
- Input: `schools: 4, public_transport: 1, groceries: 3, house_quality: 12`
- Calculated percentages: schools 20%, public_transport 5%, groceries 15%, house_quality 60%

## Action Plan

### 1. Update TypeScript Types
- **File:** `src/types.ts`
- Add a new field to display calculated percentages alongside raw weights
- Keep `weights` as `Record<string, number>` (no longer constrained to 0-1 range)

### 2. Create Weight Normalization Utility
- **File:** `src/utils/normalizeWeights.ts` (new file)
- Create a function `normalizeWeights(weights: Record<string, number>): Record<string, number>`
  - Calculate sum of all weights
  - Return normalized weights (each weight / sum) in range [0, 1]
- Create a function `calculatePercentages(weights: Record<string, number>): Record<string, number>`
  - Calculate sum of all weights
  - Return percentages (each weight / sum * 100)

### 3. Update Scoring Logic
- **File:** `src/computeScore.ts`
- Import `normalizeWeights` utility
- Normalize weights before using them in the scoring formula
- Keep the existing formula: `Final = basePoints * product(1 + (m_i - 1) * w_i)`
- Use normalized weights (0-1 range) in calculations

### 4. Update Default Configuration
- **File:** `src/config.ts`
- Change default weights to use simple integer values instead of decimals
- Example: `{ schools: 4, public_transport: 3, groceries: 2, house_quality: 1 }`

### 5. Update Settings Page Validation
- **File:** `src/pages/SettingsPage.tsx`
- Remove the validation that checks if weights sum to 1
- Update JSON schema to accept any positive number (remove maximum: 1 constraint)
- Add validation to ensure weights are positive numbers (minimum: 0, or > 0)
- Display calculated percentages for user feedback

### 6. Add Percentage Display in Settings UI
- **File:** `src/pages/SettingsPage.tsx`
- After the JSON editor, show a summary section
- Display calculated percentages for each category using `calculatePercentages`
- Format: "Schools: 4 (20%), Public Transport: 1 (5%), ..."
- Use light styling to show this is calculated, not editable

### 7. Update Documentation (if exists)
- Update any documentation that mentions weight constraints
- Document the new simplified weight input system

## Estimated Effort
- **Time:** 2-3 hours
- **Complexity:** Medium
- **Files to modify:** 4 files
- **Files to create:** 1 new utility file

## Technical Details

### Weight Normalization Formula
```typescript
// Given weights: { a: 4, b: 1, c: 3, d: 12 }
// Sum = 20
// Normalized: { a: 0.2, b: 0.05, c: 0.15, d: 0.6 }
// Percentages: { a: 20, b: 5, c: 15, d: 60 }

function normalizeWeights(weights: Record<string, number>): Record<string, number> {
  const sum = Object.values(weights).reduce((acc, w) => acc + w, 0);
  if (sum === 0) return weights; // Avoid division by zero
  
  const normalized: Record<string, number> = {};
  for (const [key, value] of Object.entries(weights)) {
    normalized[key] = value / sum;
  }
  return normalized;
}

function calculatePercentages(weights: Record<string, number>): Record<string, number> {
  const sum = Object.values(weights).reduce((acc, w) => acc + w, 0);
  if (sum === 0) return weights; // Avoid division by zero
  
  const percentages: Record<string, number> = {};
  for (const [key, value] of Object.entries(weights)) {
    percentages[key] = Math.round((value / sum) * 100 * 100) / 100; // Round to 2 decimals
  }
  return percentages;
}
```

### Updated computeScore.ts
```typescript
import { normalizeWeights } from './utils/normalizeWeights';

export function computeScore(cfg: Config, sel: Selection): ScoreResult {
  const base = cfg.aggregation.basePoints;
  const failures: { metricId: string; reason: string }[] = [];
  let product = 1;

  // Normalize weights to [0, 1] range
  const normalizedWeights = normalizeWeights(cfg.weights);

  for (const [metricId, metric] of Object.entries(cfg.metrics)) {
    const optionId = sel[metricId];
    const opt = metric.options.find(o => o.id === optionId);
    if (!opt) continue;

    if (opt.gateFail) {
      failures.push({ metricId, reason: opt.label });
    }

    const w = normalizedWeights[metricId] ?? 0; // Use normalized weight
    const m = opt.value;
    product *= (1 + (m - 1) * w);
  }

  const score = Math.round(base * product * 100) / 100;
  const status = failures.length > 0 ? "GATEFAIL" : "OK";

  return { status, score, product, failures };
}
```

### Updated Settings Page Validation Schema
```typescript
const schema = {
  type: 'object',
  properties: {
    aggregation: {
      type: 'object',
      properties: { basePoints: { type: 'number', minimum: 0 } },
      required: ['basePoints']
    },
    weights: {
      type: 'object',
      patternProperties: { 
        '.*': { 
          type: 'number', 
          minimum: 0  // Removed maximum: 1 constraint
        } 
      }
    },
    // ... rest of schema
  },
  required: ['aggregation', 'weights', 'metrics']
};
```

### Percentage Display Component
```tsx
{/* Add after JsonEditor in SettingsPage.tsx */}
<div className="settings-page__percentages">
  <h3>Calculated Weight Percentages</h3>
  <div className="percentages-grid">
    {Object.entries(calculatePercentages(jsonData.weights)).map(([key, pct]) => (
      <div key={key} className="percentage-item">
        <span className="category-name">{key}:</span>
        <span className="raw-weight">{jsonData.weights[key]}</span>
        <span className="arrow">→</span>
        <span className="percentage">{pct}%</span>
      </div>
    ))}
  </div>
</div>
```

## Development Workflow and Git Steps (MANDATORY)

Follow the repository's Copilot workflow requirements.

### 1. Create feature branch from remote main (FIRST STEP)

```bash
git checkout -b feature/change-weights-logic origin/main
```

### 2. Implement the changes as outlined above

**Step 2.1:** Create utility file for weight normalization
- Create `src/utils/normalizeWeights.ts`
- Implement `normalizeWeights()` and `calculatePercentages()` functions
- Add proper TypeScript typing

**Step 2.2:** Update computeScore.ts
- Import `normalizeWeights` utility
- Apply normalization before using weights in scoring formula
- Test that scoring still works correctly

**Step 2.3:** Update config.ts
- Change default weights to simple integers (e.g., 4, 3, 2, 1)

**Step 2.4:** Update SettingsPage.tsx
- Remove validation that checks weights sum to 1
- Update JSON schema to remove maximum: 1 constraint
- Add percentage display section
- Import `calculatePercentages` utility

**Step 2.5:** Add CSS styling for percentage display
- Update `src/pages/SettingsPage.css`
- Add styles for `.settings-page__percentages`, `.percentages-grid`, `.percentage-item`

### 3. Run quality checks (MANDATORY)

```bash
npm run lint
npm run build
```

Both commands must pass with zero errors.

### 4. Manual testing checklist

- [ ] Open settings page and verify JSON editor loads
- [ ] Edit weights to use integers (e.g., 4, 1, 3, 12)
- [ ] Verify percentage display shows correct calculations
- [ ] Save configuration and verify no validation errors
- [ ] Return to dashboard and verify scoring still works
- [ ] Test with different weight combinations
- [ ] Verify edge cases (all zeros, single non-zero weight)
- [ ] Test localStorage persistence

### 5. Commit with a Conventional Commit message and include the issue reference

```bash
git add .
git commit -m "feat: simplify weights with automatic normalization

- Create normalizeWeights utility for automatic percentage calculation
- Update computeScore to normalize weights before scoring
- Remove validation requiring weights to sum to 1
- Add percentage display in settings showing calculated distribution
- Update default config to use simple integer weights
- Allow any positive numbers as weight input

Closes #16"
```

### 6. Push and open a Pull Request

```bash
git push origin feature/change-weights-logic
```

Create the PR via GitHub UI (link appears in terminal or use repo URL) and use the PR template.

## Pre-PR Checklist
- [ ] Release documentation file created/updated in `releases/` (this file)
- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` completes successfully (no TS errors)
- [ ] Manual testing completed (all scenarios in checklist above)
- [ ] Percentage calculation verified for accuracy
- [ ] Scoring logic still produces correct results
- [ ] Settings validation updated and tested
- [ ] No console errors or warnings
- [ ] Feature branch created from `origin/main` as FIRST STEP
- [ ] Descriptive branch name used
- [ ] Commit message uses Conventional Commits and references issue

## Pull Request

**Title format:**
```
feat: simplify weights with automatic normalization
```

**Suggested PR description:**
```markdown
## Description
Simplifies weight management by allowing users to input any positive numbers instead of requiring weights to sum to 1.0. The app automatically calculates and displays percentage distribution.

### Changes Made
- Created `normalizeWeights` utility to convert raw weights to normalized values (0-1)
- Updated `computeScore` to normalize weights before applying scoring formula
- Removed validation constraint requiring weights to sum to 1
- Added percentage display in Settings page showing calculated distribution
- Updated default config to use simple integer weights (4, 3, 2, 1)
- Updated JSON schema to accept any positive number for weights

### Before/After
**Before:** Users had to carefully balance weights to sum to 1.0 (e.g., 0.4, 0.3, 0.2, 0.1)
**After:** Users can input any numbers they prefer (e.g., 4, 3, 2, 1 or 12, 4, 3, 1)

### Features
- ✅ Automatic weight normalization
- ✅ Real-time percentage calculation display
- ✅ Simplified user input (any positive numbers)
- ✅ Maintains existing scoring formula accuracy
- ✅ No breaking changes to saved configurations

### Testing
- ✅ Lint passed
- ✅ Build successful
- ✅ Manual testing completed with various weight combinations
- ✅ Verified scoring accuracy with normalized weights
- ✅ Tested edge cases (zeros, single weight, large numbers)
- ✅ Confirmed localStorage persistence

### Files Changed
- `src/utils/normalizeWeights.ts` - New utility for weight normalization
- `src/computeScore.ts` - Updated to use normalized weights
- `src/config.ts` - Updated default weights to integers
- `src/pages/SettingsPage.tsx` - Removed validation, added percentage display
- `src/pages/SettingsPage.css` - Added styling for percentage display
- `releases/16_change_weights_logic.md` - This implementation plan

Closes #16
```

## Notes

### Backward Compatibility
- Existing configurations with decimal weights (0-1 range) will continue to work
- Normalization works correctly for both integer and decimal inputs
- No migration needed for existing saved data

### Edge Cases to Handle
1. **All weights are zero:** Return original weights (avoid division by zero)
2. **Single non-zero weight:** Should calculate to 100%
3. **Very large numbers:** Normalization handles any positive values
4. **Decimal inputs:** Still work correctly (e.g., 0.4, 0.3, 0.2, 0.1 → 40%, 30%, 20%, 10%)

### Future Enhancements (out of scope)
- Add UI sliders or number inputs for weights instead of JSON editing
- Add preset weight templates (e.g., "Balanced", "Family Focus", "Urban Living")
- Visual representation (pie chart) of weight distribution
