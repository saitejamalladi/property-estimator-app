# Action Plan for Issue #2: Edit JSON on the Home Page

## Issue Summary
Add an "Edit Settings" CTA in the top-right of the header. Clicking it opens a JSON editor modal to update the configuration. Changes persist locally (localStorage) and preview immediately. Include a "Copy Settings" CTA in the editor. Note: localStorage persists across deployments; users can refresh to reset if needed.

## Action Plan

1. **Add Edit Settings CTA**
   - Add an "Edit Settings" button in the top-right of the header.
   - When clicked, open a modal with a JSON editor for the config.

2. **Create JSON Editor Modal**
   - Implement a modal component with a JSON editor (e.g., using react-json-editor-ajrm or a textarea with validation).
   - Load current config (from localStorage or defaults) into the editor.

3. **Add Config Validation**
   - Add validation for the JSON structure (e.g., using ajv schema) to ensure weights sum to 1, multipliers in range, etc.
   - Show errors in the modal.

4. **Implement Save and Persistence**
   - On save, update localStorage with the new config and refresh the app state to apply changes immediately.

5. **Add Copy CTA in Editor**
   - Add a "Copy Settings" button in the modal to copy the current JSON config to clipboard.

6. **Accessibility and Responsiveness**
   - Ensure the modal is accessible (ARIA labels, keyboard navigation).
   - Test on mobile and desktop.

7. **Testing and Validation**
   - Run lint, build, and manual tests.
   - Validate that localStorage persists across refreshes but can be reset if needed.

## Notes
- Use localStorage for persistence; it survives deployments but can be cleared by users.
- For schema validation, consider a JSON schema matching the Config interface.
- Estimated effort: 4-6 hours, depending on editor library choice.