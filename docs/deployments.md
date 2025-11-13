# Property Estimator - Deployment Guide

This document provides step-by-step instructions for deploying the Property Estimator application to GitHub Pages.

## Prerequisites

- GitHub repository created and code pushed to `main` branch
- **Repository must be public** (GitHub Pages requires public repositories for free accounts)
- GitHub Pages enabled for the repository
- Node.js and npm installed locally

## Pre-Deployment Checklist

Before starting deployment, verify:

1. **Repository is Public**: Go to Settings → General → Danger Zone → Change repository visibility → Make public
2. **Main branch exists**: Ensure your code is pushed to the `main` branch
3. **Repository Permissions**: You should be the owner or have admin access
4. **GitHub Pages Access**: Free accounts can use Pages on public repositories

## Deployment Options

### Option 1: GitHub Actions (Recommended)

This method automatically builds and deploys your app whenever you push changes to the main branch.

#### Step 1: Create GitHub Actions Workflow

1. In your GitHub repository, create the directory `.github/workflows/` if it doesn't exist
2. Create a new file `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

#### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar

**If you see "add domain":**
- This means Pages hasn't been set up yet
- Click on the dropdown under "Source" (it might say "None" or show different options)
- Select **GitHub Actions** from the dropdown

**If you don't see GitHub Actions option:**
- Make sure your repository is **public** (GitHub Pages requires public repos for free accounts)
- If it's private, you'll need a GitHub Pro account for Pages
- Check that you have admin access to the repository

4. After selecting **GitHub Actions**, save the changes

#### Step 3: Deploy

1. Push the workflow file to your main branch
2. The deployment will start automatically
3. Check the **Actions** tab to monitor the deployment progress
4. Once complete, your app will be available at `https://[username].github.io/[repository-name]`

### Option 2: Manual Deployment

If you prefer to deploy manually without GitHub Actions:

#### Step 1: Build the Application

```bash
cd property-estimator-app
npm run build
```

This creates a `dist/` folder with the production build.

#### Step 2: Create gh-pages Branch

```bash
# Create and switch to gh-pages branch
git checkout -b gh-pages

# Remove all files except dist/
git rm -rf .
git commit -m "Remove existing files"

# Copy dist/ contents to root
cp -r dist/* .

# Add and commit the build files
git add .
git commit -m "Add build files"

# Push to gh-pages branch
git push origin gh-pages
```

#### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Under **Branch**, select **gh-pages** and **/(root)**
6. Save the changes

#### Step 4: Access Your App

Your app will be available at `https://[username].github.io/[repository-name]`

## Troubleshooting

### Build Fails
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run build`
- Verify Vite configuration is correct

### Deployment Fails
- Check that GitHub Pages is enabled in repository settings
- For GitHub Actions, ensure the workflow file is in the correct location
- Verify the build output is in the `dist/` folder
- **Repository Visibility**: Ensure your repository is public (required for free GitHub Pages)
- **Pages Settings**: If you see "add domain" instead of source options, try refreshing the page or check repository permissions

### GitHub Actions Not Available
- Repository must be public for free GitHub Pages with Actions
- Check that you have admin/owner permissions on the repository
- Try refreshing the Pages settings page

### App Not Loading
- Check that the repository name in package.json matches your GitHub repository
- Ensure the base path is correctly set in vite.config.ts if needed
- Clear browser cache and try again

## Custom Domain (Optional)

To use a custom domain:

1. Go to repository **Settings** → **Pages**
2. Under **Custom domain**, enter your domain
3. Configure DNS records as instructed
4. Save changes

## Updating the Deployment

- For GitHub Actions: Simply push changes to main branch
- For manual deployment: Rebuild and push to gh-pages branch

## Repository Structure

Ensure your repository has this structure:
```
property-estimator-app/
├── src/
├── public/
├── package.json
├── vite.config.ts
└── dist/ (generated by build)
```