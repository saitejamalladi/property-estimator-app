# Action Plan for Issue #18: Move Weights in the Config

## Issue Summary
Restructure the config to embed weights directly within each metric instead of having a separate top-level weights object. This eliminates the need to modify weights separately when adding/removing metrics.

## Current Structure:
```json
{
  "aggregation": { "basePoints": 50, "formula": "..." },
  "weights": {
    "schools": 4,
    "public_transport": 1,
    "groceries": 3,
    "house_quality": 12
  },
  "metrics": {
    "schools": { "label": "Schools", "options": [...] },
    "public_transport": { "label": "Public Transport", "options": [...] }
  }
}
```

## Target Structure:
```json
{
  "aggregation": { "basePoints": 50, "formula": "..." },
  "metrics": {
    "schools": {
      "label": "Schools",
      "weight": 4,
      "options": [...]
    },
    "public_transport": {
      "label": "Public Transport",
      "weight": 1,
      "options": [...]
    }
  }
}
```

## Action Plan

### 1. Update Type Definitions
- **File:** `src/types.ts`
- Add `weight: number` to `Metric` type
- Remove `weights` from `Config` type

### 2. Create Migration Utility
- **File:** `src/utils/migrateConfig.ts` (new)
- Function to convert old config format to new format
- Handle existing saved configs automatically

### 3. Update Default Configuration
- **File:** `src/config.ts`
- Move weights from top-level into each metric
- Update DEFAULT_CONFIG to use new structure

### 4. Update Scoring Logic
- **File:** `src/computeScore.ts`
- Extract weights from `config.metrics[metricId].weight` instead of `config.weights[metricId]`
- Update `normalizeWeights` call to use extracted weights

### 5. Update UI Components
- **File:** `src/components/MetricsGrid.tsx`
- Pass `metric.weight` instead of `config.weights[metricId]`
- **File:** `src/components/MetricColumn.tsx`
- Update to use passed weight value (no changes needed to component logic)

### 6. Update Settings Page
- **File:** `src/pages/SettingsPage.tsx`
- Update JSON schema to expect weights inside metrics
- Remove weights validation from schema
- Update percentage calculation to extract weights from metrics
- **File:** `src/pages/SettingsPage.css`
- Update styles if needed for new structure

### 7. Update Config Editor Modal
- **File:** `src/components/ConfigEditorModal.tsx`
- Update JSON schema same as SettingsPage
- Remove weights validation

### 8. Update App Initialization
- **File:** `src/App.tsx` or wherever config is loaded
- Add migration logic to convert old configs on load
- Ensure backward compatibility

### 9. Test and Validate
- Run `npm run lint` and `npm run build`
- Test with old config format (should migrate automatically)
- Test with new config format
- Verify scoring calculations remain accurate
- Test UI displays correct percentages
- Test config editing and saving

## Estimated Effort
- **Time:** 3-4 hours
- **Complexity:** Medium (structural changes, migration logic)
- **Files to modify:** 8+ files
- **Files to create:** 1 new utility file

## Technical Details

### Migration Function:
```typescript
export function migrateConfig(config: any): Config {
  // If config already has new structure, return as-is
  if (config.metrics && typeof config.metrics === 'object') {
    const firstMetric = Object.values(config.metrics)[0] as any;
    if (firstMetric && typeof firstMetric.weight === 'number') {
      return config as Config;
    }
  }

  // Migrate old structure to new structure
  const newConfig = { ...config };
  if (config.weights && config.metrics) {
    for (const [metricId, metric] of Object.entries(config.metrics)) {
      (metric as any).weight = config.weights[metricId] || 1;
    }
    delete newConfig.weights;
  }

  return newConfig as Config;
}
```

### Updated Metric Type:
```typescript
export type Metric = {
  label: string;
  weight: number;
  options: Option[];
};
```

### Updated Config Type:
```typescript
export type Config = {
  aggregation: {
    basePoints: number;
    formula: string;
  };
  metrics: Record<string, Metric>;
};
```

### Updated computeScore:
```typescript
export function computeScore(cfg: Config, sel: Selection): ScoreResult {
  // ... existing code ...

  // Extract weights from metrics
  const weights: Record<string, number> = {};
  for (const [metricId, metric] of Object.entries(cfg.metrics)) {
    weights[metricId] = metric.weight;
  }

  // Normalize weights to [0, 1] range
  const normalizedWeights = normalizeWeights(weights);

  // ... rest of function uses normalizedWeights as before ...
}
```

## Development Workflow and Git Steps (MANDATORY)

1. Create feature branch from remote main (FIRST STEP)

```bash
git checkout -b feature/move-weights-to-metrics origin/main
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
git commit -m "feat: move weights into metrics config structure

- Embed weight property directly in each metric
- Remove separate top-level weights object
- Add migration logic for existing configs
- Update all code to use new structure
- Maintain backward compatibility

Closes #18"
```

5. Push and open a Pull Request

```bash
git push origin feature/move-weights-to-metrics
```

Create the PR via GitHub UI and use the PR template.

## Pre-PR Checklist
- [ ] Release documentation file created/updated in `releases/` (this file)
- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` completes successfully (no TS errors)
- [ ] Manual testing completed (desktop + mobile responsiveness)
- [ ] Migration logic tested with old config formats
- [ ] Scoring calculations verified with new structure
- [ ] Config editing works with embedded weights
- [ ] Percentages display correctly in UI
- [ ] Accessibility respected (keyboard navigation, ARIA labels)
- [ ] Feature branch created from `origin/main` as FIRST STEP
- [ ] Descriptive branch name used
- [ ] Commit message uses Conventional Commits and references issue

## Notes
- Migration handles both old and new config formats automatically
- No breaking changes for end users - existing saved configs migrate seamlessly
- Single source of truth for metrics reduces configuration errors
- Easier to add/remove metrics without forgetting weights