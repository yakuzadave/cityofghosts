# GitHub Pages Configuration Guide

This file explains how to configure GitHub Pages for this repository to serve the built Twine game.

## The Issue

If you see only the README being served on GitHub Pages instead of the Twine game, it's because GitHub Pages is configured to serve from the wrong source.

## Solution

You need to configure GitHub Pages to use **GitHub Actions** as the deployment source:

### Steps:

1. Go to your repository on GitHub
2. Click on **Settings** (you need admin/write access)
3. In the left sidebar, click on **Pages** (under "Code and automation")
4. Under "Build and deployment", find the **Source** setting
5. Change it to **"GitHub Actions"** (not "Deploy from a branch")
6. Save the changes

### What This Does

When set to "GitHub Actions":
- The workflow in `.github/workflows/build-and-deploy.yml` will deploy the built game
- The compiled `dist/index.html` (Twine game) will be served on GitHub Pages
- Every push to `main` will automatically rebuild and redeploy

### Alternative: Deploy from Branch (Legacy Method)

If you prefer the legacy approach, you can:
1. Set Source to "Deploy from a branch"
2. Choose branch: `gh-pages`
3. Choose folder: `/ (root)`

However, the GitHub Actions approach is more modern and provides better control.

## Verification

After configuring:
1. Push changes to the `main` branch (or merge a PR)
2. Check the **Actions** tab to see the workflow run
3. Once complete, visit `https://yakuzadave.github.io/cityofghosts/`
4. You should see the Twine game, not the README

## Troubleshooting

### Still seeing README after configuration

- Wait a few minutes for GitHub to propagate the changes
- Check the Actions tab to ensure the workflow completed successfully
- Verify the deployment shows in the "Environments" section (should show "github-pages")

### Deployment fails with permissions error

- Ensure the repository has Pages enabled (Settings → Pages)
- The workflow already has the correct permissions configured
- Try re-running the workflow from the Actions tab

### 404 Error

- Ensure the `index.html` file exists in the deployed artifact
- Check the workflow logs to confirm the build step succeeded
- Verify the upload-pages-artifact step succeeded

## Contact

If issues persist, create an issue in the repository with:
- The URL you're trying to access
- Screenshot of Settings → Pages configuration
- Link to the failing workflow run
