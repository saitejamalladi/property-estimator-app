# Action Plan for Issue #13: Move editsettings to a new page

## Issue Summary
Move the current "Edit Settings" JSON editor from a modal to a dedicated page. The "Edit Settings" call-to-action (CTA) should remain visible on the main screen, but clicking it should navigate to a new route (page) instead of opening a modal. The new page must preserve existing validation, copy, save, and persistence behavior.

Issue link: https://github.com/saitejamalladi/property-estimator-app/issues/13

## Action Plan

1. Add routing
   - Install `react-router-dom` (v6).
   - Wrap the app with `BrowserRouter` and define routes:
     - `/` → main dashboard (current content showing grid and score panel).
     - `/settings` → new settings page for editing configuration.

2. Restructure into layout + pages
   - Convert `App.tsx` into a layout that owns shared state: `config`, `selections`, and handlers (`handleSaveConfig`, `handleSelect`, `handleReset`, `handleCopy`).
   - Render header and footer in the layout; use `<Outlet />` for nested pages.
   - Extract the current main content into a `DashboardPage` (or render inline on `/`).

3. Create `SettingsPage`
   - Port the JSON editor UX from `ConfigEditorModal.tsx` to a full page:
     - Keep the Ajv schema and validation logic identical.
     - Provide actions: Copy, Save, Cancel (or Back).
   - On Save:
     - Call the same `handleSaveConfig(newConfig)` used today to persist to localStorage and re-initialize selections (first non-gateFail option per metric).
     - Navigate back to `/`.
   - On Cancel/Back: navigate back to `/` without persisting changes.

4. Update Header CTA
   - Replace `onEditSettings` callback usage with navigation to `/settings` (e.g., via `Link` or `useNavigate`).

5. Remove modal usage
   - Remove `<ConfigEditorModal />` from the layout (former `App.tsx`).
   - Optionally remove `ConfigEditorModal.tsx` and its CSS after verifying the new page covers all behaviors.

6. QA and polish
   - Build and lint the project.
   - Manual checks:
     - Navigating to `/settings` works and renders the editor.
     - Invalid JSON shows validation errors and disables Save.
     - Copy to clipboard works.
     - Saving applies changes across the app and resets selections as today.
     - Cancel/Back preserves current config.

## Technical Details

### Router setup (high-level)
- In `src/main.tsx` wrap the app with `BrowserRouter`.
- In `App.tsx`, create a layout that renders `Header`, `FooterActions`, and an `<Outlet />` for routes.

Example skeleton (not exact final code):
```tsx
// main.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

```tsx
// App.tsx (layout skeleton)
function AppLayout() {
  // state: config, selections, handlers
  return (
    <div className="app">
      <Header /* navigate to /settings */ />
      <Outlet />
      <FooterActions /* reset, copy */ />
    </div>
  );
}
```

### Settings page
- Reuse the Ajv schema and logic from `ConfigEditorModal.tsx` without the modal overlay and focus-trap logic.
- Provide accessible headings and labels (e.g., `h1` “Edit Configuration”).
- Buttons:
  - Copy Config → clipboard of formatted JSON.
  - Save → validate; on success, call `handleSaveConfig` then navigate to `/`.
  - Cancel → navigate to `/`.

### State and persistence
- Continue storing under `localStorage['propertyEstimatorConfig']`.
- Keep the current behavior that re-initializes selections to first non-`gateFail` options after a successful save.

## Acceptance Criteria
- Clicking the header’s “Edit Settings” navigates to `/settings`.
- The settings page offers JSON editing with the same validation, copy, and save semantics as the modal.
- Save updates app state and localStorage; selections re-initialized.
- Cancel/Back discards changes and returns to `/`.
- The modal component is no longer used.
- Build and lint pass with no TypeScript errors.

## Files to Add/Update
- Add: `src/pages/SettingsPage.tsx` (new page)
- Optional Add: `src/pages/DashboardPage.tsx` (if extracting)
- Update: `src/main.tsx` (add router)
- Update: `src/App.tsx` (layout + routes)
- Update: `src/components/Header.tsx` (navigate to `/settings`)
- Remove (optional): `src/components/ConfigEditorModal.tsx` and `ConfigEditorModal.css`

## Risks and Mitigations
- Deep link refresh 404s: Vite dev server handles routes; ensure production hosting serves `index.html` for unknown routes (already mitigated with `public/404.html`).
- User confusion on navigation: add a clear page title and a visible Back/Cancel.
- Schema drift: keep a single source of truth for the Ajv schema (extract to a shared module if needed).

## Testing and Validation
- Lint and build: `npm run lint`, `npm run build`.
- Manual flows:
  - Navigate to `/settings`; edit invalid JSON → errors shown; Save disabled.
  - Copy contents → confirm clipboard.
  - Save valid JSON → app updates, selections reset; redirected to `/`.
  - Cancel → redirected to `/` with no changes.

## Effort Estimate
- Routing and layout refactor: 1–2 hours
- Settings page extraction: 1–2 hours
- Cleanup and QA: 0.5–1 hour
- Total: ~3–5 hours

## Rollout Notes
- No data migration; relies on existing localStorage key.
- Announce behavior change (full page vs modal) in release notes; provide a short GIF in the PR to demonstrate the flow.

## Development Workflow and Git Steps

Follow the repository’s Copilot workflow requirements.

1. Create feature branch from remote main

```bash
git checkout -b feature/move-editsettings-to-new-page origin/main
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
git commit -m "feat: move Edit Settings to a dedicated page

- Add react-router-dom and define routes (/ and /settings)
- Refactor App into layout with routed pages and shared state
- Create SettingsPage with JSON editor and validation
- Replace modal usage and update Header CTA to navigate

Closes #13"
```

5. Push and open a Pull Request

```bash
git push origin feature/move-editsettings-to-new-page
```

Create the PR via GitHub UI (link appears in terminal or use repo URL) and use the PR template.

## Pre-PR Checklist
- [ ] Release documentation file created/updated in `releases/` (this file)
- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` completes successfully (no TS errors)
- [ ] Manual testing completed (desktop + mobile responsiveness)
- [ ] Accessibility respected (keyboard navigation, ARIA labels)
- [ ] No console errors or warnings
- [ ] Feature branch created from `origin/main`
- [ ] Descriptive branch name used: `feature/move-editsettings-to-new-page`
- [ ] Commit message uses Conventional Commits and references issue: `Closes #13`

## Pull Request

Title format:
```
feat: Move Edit Settings to dedicated page
```

Suggested PR description:
```markdown
## Description
Move the existing JSON editor from a modal to a dedicated `/settings` page. Keep the header CTA and navigate to the new page.

### Changes Made
- Add react-router-dom and define routes
- Refactor App into a layout with `<Outlet />`
- Create SettingsPage and port validation/copy/save behavior
- Remove modal usage; update Header CTA to navigate

### Before/After
- Before: Edit Settings opened an in-page modal
- After: Edit Settings navigates to a full settings page `/settings`

### Testing
- ✅ Lint passed
- ✅ Build successful
- ✅ Manual testing completed (desktop + mobile)

### Files Changed
- `src/main.tsx` – Router setup
- `src/App.tsx` – Layout + routes
- `src/pages/SettingsPage.tsx` – New settings page
- `src/components/Header.tsx` – CTA navigates to `/settings`
- (Optional) Remove `src/components/ConfigEditorModal.tsx` and CSS

Closes #13
```
