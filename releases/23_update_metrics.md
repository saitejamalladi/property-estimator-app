# Action Plan for Issue #23: Update the metrics

## Issue Summary
Update the property estimator metrics with new comprehensive criteria including schools, transport, house quality, pricing, family proximity, groceries, Indian groceries, safety, health services, amenities, stores, restaurants, temples, private schools, and Indian community factors.

## Action Plan
1. Analyze current metrics configuration in `src/config.ts`
2. Update the metrics object with all new metrics from the issue specification
3. Ensure proper weight assignments and multiplier values
4. Verify gatefail conditions are correctly applied
5. Test the configuration changes

## Estimated Effort
- Time: 2 hours
- Complexity: Medium
- Files to modify: 1 file (`src/config.ts`)

## Technical Details
The current config has 4 metrics. We need to expand to 15 metrics with proper weights and multipliers. Each metric follows the existing structure with options having id, label, value, and optional gateFail flag.

New metrics to add:
- Primary school in zone (weight 7)
- Public Transport with parking (weight 5) 
- House Quality (weight 4)
- Property Price (weight 5)
- Close to Family (weight 3)
- Supermarket (weight 3)
- Indian groceries (weight 3)
- Safety & Environment (weight 3)
- Health & Services (weight 3)
- Amenities (weight 3)
- Stores (weight 2)
- Indian restaurants (weight 3)
- Hindu temples (weight 3)
- Private Schools (weight 2)
- Indian Community (weight 2)

## Development Workflow and Git Steps (MANDATORY)

Follow the repository's Copilot workflow requirements.

1. Create feature branch from remote main (FIRST STEP)

```bash
git checkout -b feature/update-metrics origin/main
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
git commit -m "feat: update metrics configuration with comprehensive criteria

- Add 15 new metrics including schools, transport, pricing, community factors
- Update weights and multipliers according to issue specifications
- Apply gatefail conditions where specified
- Maintain existing config structure and types

Closes #23"
```

5. Push and open a Pull Request

```bash
git push origin feature/update-metrics
```

Create the PR via GitHub UI (link appears in terminal or use repo URL) and use the PR template.

## Pre-PR Checklist
- [ ] Release documentation file created/updated in `releases/` (this file)
- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` completes successfully (no TS errors)
- [ ] Manual testing completed (desktop + mobile responsiveness)
- [ ] Accessibility respected (keyboard navigation, ARIA labels)
- [ ] No console errors or warnings
- [ ] Feature branch created from `origin/main` as FIRST STEP
- [ ] Descriptive branch name used
- [ ] Commit message uses Conventional Commits and references issue

## Notes
This is a configuration-only change that updates the metrics used for property scoring. The existing scoring logic in `computeScore.ts` should work unchanged with the new metrics structure.