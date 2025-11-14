# GitHub Copilot Instructions - Property Estimator App

This document provides instructions for GitHub Copilot when assisting with development of this project. It outlines the workflow, file naming conventions, and quality standards that must be followed.

---

## Table of Contents

1. [File Naming Conventions](#file-naming-conventions)
2. [Development Workflow](#development-workflow)
3. [Pre-PR Checklist](#pre-pr-checklist)
4. [Branch Naming](#branch-naming)
5. [Commit Message Format](#commit-message-format)
6. [Testing Requirements](#testing-requirements)
7. [Pull Request Process](#pull-request-process)

---

## File Naming Conventions

### Release Documentation (`releases/*`)

All feature implementations and changes must be documented in the `releases/` directory.

**Naming Pattern:**
```
releases/{issue-number}_{short_description}.md
```

**Examples:**
- `releases/1_change_layout_to_rows.md`
- `releases/2_edit_json_on_the_home_page.md`
- `releases/4_inline_metric_value_display.md`

**Required Sections:**
```markdown
# Action Plan for Issue #{number}: {Title}

## Issue Summary
Brief description of the change

## Action Plan
1. Step 1
2. Step 2
...

## Estimated Effort
- Time: X hours
- Complexity: Low/Medium/High
- Files to modify: N files

## Technical Details
Code snippets, implementation notes

## Development Workflow and Git Steps (MANDATORY)

Follow the repository's Copilot workflow requirements.

1. Create feature branch from remote main (FIRST STEP)

```bash
git checkout -b feature/{descriptive-name} origin/main
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
git commit -m "{type}: {brief description}

- Change 1
- Change 2
- Change 3

Closes #{issue-number}"
```

5. Push and open a Pull Request

```bash
git push origin feature/{branch-name}
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

## Pull Request

Title format:
```
{type}: {Brief description}
```

Suggested PR description template provided above.

## Notes
Additional context
```

### Component Files
- Use PascalCase for components: `MetricTile.tsx`
- Matching CSS files: `MetricTile.css`
- Utility/helper files: camelCase `computeScore.ts`

### Type Definitions
- Place in `src/types.ts` or colocate with components
- Use TypeScript interfaces and types

---

## Development Workflow

**CRITICAL: Always create a feature branch FIRST before any implementation work.**

### 1. Create Feature Branch (FIRST STEP - MANDATORY)

**Before doing anything else**, create a feature branch from remote main. **Always use a unique branch name** - if your chosen name already exists, append a number or find an alternative.

```bash
# STEP 1: Check existing branches and create unique feature branch from remote main
git fetch origin
git branch -r | grep "origin/feature/"  # Check existing feature branches

# Create branch with unique name (examples):
git checkout -b feature/change-weights-logic origin/main
# If exists, try: feature/change-weights-logic-2
# Or: feature/weights-auto-normalization

# Verify you're on the new branch
git branch
```

**Never work directly on `main` branch. Always create a feature branch first.**

### 2. Create Issue Documentation

After creating the feature branch, create a release documentation file:

```bash
# Create the action plan file
touch releases/{issue-number}_{description}.md

# Edit the file with issue summary, action plan, technical details, and git workflow
```

### 3. Implement Changes

Make your code changes following the action plan in your release documentation.

### 4. Run Quality Checks

**Before committing**, run all checks:

```bash
# 1. Run linter
npm run lint

# 2. Run TypeScript compiler and build
npm run build

# 3. Test locally (optional but recommended)
npm run dev
# Visit http://localhost:5173 and manually test changes
```

**All checks must pass with no errors before proceeding.**

### 5. Commit Changes

```bash
# Stage all changes
git add .

# Commit with conventional commit message
git commit -m "feat: {brief description}

{detailed description}
- Change 1
- Change 2

Closes #{issue-number}"
```

### 6. Push and Create PR

```bash
# Push to remote
git push origin feature/{branch-name}

# Create PR via GitHub UI or CLI
# PR link will be shown in terminal output
```

---

## Pre-PR Checklist

Before creating a pull request, ensure:

### ✅ Documentation
- [ ] Release documentation file created in `releases/`
- [ ] Action plan includes all required sections
- [ ] Technical details and code snippets documented

### ✅ Code Quality
- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` completes successfully
- [ ] No TypeScript compilation errors
- [ ] Code follows existing patterns and conventions

### ✅ Testing
- [ ] Manual testing completed locally
- [ ] All features work as expected
- [ ] Responsive design verified (mobile + desktop)
- [ ] Accessibility features maintained (keyboard nav, ARIA labels)
- [ ] No console errors or warnings

### ✅ Git Hygiene
- [ ] Feature branch created from `origin/main`
- [ ] Descriptive branch name used
- [ ] Commit messages follow conventional format
- [ ] All changes staged and committed
- [ ] Branch pushed to remote

### ✅ Files Updated
- [ ] Source files modified as needed
- [ ] CSS updated if UI changes made
- [ ] Types updated if data structures changed
- [ ] Release documentation added to commit

---

## Branch Naming

Use descriptive branch names following this pattern:

### Feature Branches
```
feature/{short-description}
```

**Examples:**
- `feature/inline-metric-value`
- `feature/edit-json-config`
- `feature/add-dark-mode`

### Bugfix Branches
```
bugfix/{issue-or-description}
```

**Examples:**
- `bugfix/score-calculation-error`
- `bugfix/mobile-layout-issue`

### Other Branch Types
- `hotfix/{critical-issue}` - For urgent production fixes
- `chore/{task}` - For maintenance tasks
- `docs/{update}` - For documentation-only changes

---

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>: <subject>

<body>

<footer>
```

### Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Example
```
feat: Display metric multiplier inline with label

- Move multiplier value to display inline with label in parentheses
- Update MetricTile component to combine label and multiplier
- Adjust CSS styling for inline display with lighter weight
- Reduce tile min-height from 120px to 80px for better density

Closes #4
```

---

## Testing Requirements

### Automated Tests
```bash
# Linting
npm run lint

# Build verification
npm run build
```

### Manual Testing Checklist

**For UI Changes:**
- [ ] Test on desktop browser (Chrome/Firefox/Safari)
- [ ] Test on mobile viewport (responsive design)
- [ ] Test all interactive elements (clicks, hovers, focus states)
- [ ] Verify accessibility (keyboard navigation, screen reader support)
- [ ] Check for console errors

**For Logic Changes:**
- [ ] Test with various input combinations
- [ ] Verify edge cases
- [ ] Check error handling
- [ ] Validate data persistence (localStorage)

**For Config Changes:**
- [ ] Test with default config
- [ ] Test with modified config
- [ ] Verify validation works
- [ ] Check error messages display correctly

---

## Pull Request Process

### 1. Create Pull Request

Use the GitHub UI or URL provided after pushing:
```
https://github.com/saitejamalladi/property-estimator-app/pull/new/{branch-name}
```

### 2. PR Template

**Title Format:**
```
{type}: {Brief description}
```

**Description Template:**
```markdown
## Description
Brief overview of changes

### Changes Made
- Change 1
- Change 2

### Before/After
Show visual changes if applicable

### Features
- ✅ Feature 1
- ✅ Feature 2

### Testing
- ✅ Lint passed
- ✅ Build successful
- ✅ Manual testing completed

### Files Changed
- `path/to/file1` - Description
- `path/to/file2` - Description

Closes #{issue-number}
```

### 3. Review and Merge

- Address any review comments
- Ensure CI/CD checks pass (if configured)
- Merge when approved
- Delete feature branch after merge

---

## Local Development

### Setup
```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

### Available Scripts
```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

### Project Structure
```
property-estimator-app/
├── src/
│   ├── components/     # React components
│   ├── assets/         # Static assets
│   ├── types.ts        # TypeScript type definitions
│   ├── config.ts       # Default configuration
│   ├── computeScore.ts # Scoring logic
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Public static files
├── releases/           # Feature documentation
├── docs/               # Project documentation
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── eslint.config.js    # ESLint configuration
```

---

## Deployment

The app is automatically deployed to GitHub Pages via GitHub Actions.

### Automatic Deployment
- Pushes to `main` branch trigger automatic deployment
- Check `.github/workflows/deploy.yml` for CI/CD configuration
- View deployment status in the **Actions** tab

### Manual Verification
After merge to main:
1. Wait for GitHub Actions to complete
2. Visit: `https://saitejamalladi.github.io/property-estimator-app/`
3. Verify changes are live

---

## Questions or Issues?

- Check existing documentation in `docs/`
- Review past issues and PRs for examples
- Reference this instruction file for workflow guidance

---

## Summary: Required Workflow for Copilot

**MANDATORY ORDER - Follow these steps exactly:**

```bash
# 1. FIRST STEP: Create feature branch from origin/main (BEFORE ANY OTHER WORK)
git checkout -b feature/{name} origin/main

# 2. Create release doc
touch releases/{N}_{description}.md
# Edit the file with action plan, technical details, AND git workflow steps

# 3. Make changes (implement the feature)

# 4. Test (MANDATORY - must pass with zero errors)
npm run lint && npm run build

# 5. Commit with conventional message
git add .
git commit -m "feat: description

- Change 1
- Change 2

Closes #{issue-number}"

# 6. Push and create PR
git push origin feature/{name}
# Create PR via GitHub UI using the link shown in terminal
```

**Critical:** Every change requires:
1. **Feature branch created from `origin/main` as the VERY FIRST STEP** (use unique name if chosen name exists)
2. Documentation in `releases/` with git workflow section
3. Passing `npm run lint` with zero errors
4. Successful `npm run build`
5. Proper conventional commit message
6. Reference to issue number in commit/PR
7. Pull request created via GitHub UI
