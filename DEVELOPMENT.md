# Development Guide

## Project Structure

```
cityofghosts/
├── .github/
│   └── workflows/
│       └── build-and-deploy.yml  # CI/CD workflow
├── src/                          # Twee source files
│   ├── index.twee               # Main story file
│   ├── home.twee                # Home location scenes
│   └── diner.twee               # Diner location scenes
├── scripts/
│   ├── validate-twee.js         # Twee file validation
│   └── build.js                 # Build script
├── dist/                        # Build output (generated)
│   └── index.html               # Compiled game
└── storyformats/                # Twine story formats
```

## Prerequisites

- **Node.js** (v18 or later)
- **Tweego** - Twee compiler
  - Download from: https://github.com/tmedwards/tweego/releases
  - Add to your PATH

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yakuzadave/cityofghosts.git
   cd cityofghosts
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Tweego (if not already installed):
   - **Linux/macOS**: Download and extract to `/usr/local/bin/`
   - **Windows**: Download and add to PATH

## Development Workflow

### Validate Twee Files

Check your Twee files for syntax issues:

```bash
npm run validate
```

This will check for:
- Missing passage names
- Mismatched link brackets
- Mismatched macro delimiters

### Build the Game

Compile Twee files into HTML:

```bash
npm run build
```

This will:
1. Run validation automatically (prebuild)
2. Compile all `.twee` files in `src/` directory
3. Output to `dist/index.html`

### Clean Build Artifacts

Remove the `dist/` directory:

```bash
npm run clean
```

## Writing Twee Files

All Twee source files should be placed in the `src/` directory. The build process will compile all `.twee` files together.

### Basic Passage Structure

```twee
:: PassageName [tags] {"position":"x,y"}

Content goes here with [[links]] and <<macros>>
```

### Custom Macros

This project uses custom macros inspired by Disco Elysium:

- `<<BlankSpeaker>>` - Clear current speaker
- `<<SetSpeaker "Name">>` - Set speaker name
- `<<AddParagraph "text">>` - Add a paragraph
- `<<AddOption "text" "passage">>` - Add a dialogue option
- `<<PassiveSkill>>` - Passive skill check

## Continuous Integration

The project uses GitHub Actions for automated building and deployment:

1. **Validate** - Checks Twee files for errors
2. **Build** - Compiles the game
3. **Deploy** - Deploys to GitHub Pages (on main branch only)

The workflow runs on:
- Push to `main` branch
- Pull requests to `main` branch (validation and build only, no deployment)

### GitHub Pages Deployment

The game is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

**Deployment Configuration:**
- Uses GitHub's native Pages deployment action (`actions/deploy-pages@v4`)
- Deploys the compiled `dist/index.html` to GitHub Pages
- Accessible at: `https://yakuzadave.github.io/cityofghosts/`

**Important Notes:**
- Deployment only happens on pushes to `main` (not on PRs)
- The repository must have GitHub Pages enabled in Settings → Pages
- Source should be set to "GitHub Actions" (not a branch)

### Viewing CI Results

- Check the **Actions** tab in GitHub
- Build artifacts are available for download (30-day retention)
- Deployment status visible in the "github-pages" environment

## Testing Your Changes

1. Make changes to `.twee` files in `src/`
2. Run `npm run build` to compile
3. Open `dist/index.html` in a browser to test
4. Commit and push when satisfied

## Troubleshooting

### Build Fails with "Tweego not found"

Ensure Tweego is installed and in your PATH:

```bash
tweego --version
```

### Validation Warnings

Some macro mismatch warnings are expected due to nested macros. As long as the build succeeds, these are typically fine.

### Syntax Errors

If the build fails with a syntax error:
1. Check the error message for the file and line number
2. Ensure passage headers are on their own line
3. Check for properly closed brackets and macros

## Resources

- [Tweego Documentation](https://www.motoslave.net/tweego/docs/)
- [SugarCube Documentation](https://www.motoslave.net/sugarcube/2/)
- [Twee3 Language Reference](https://github.com/iftechfoundation/twine-specs/blob/master/twee-3-specification.md)
