# Release Process

This project uses automated releases with semantic versioning.

## How it Works

### Automatic Patch Releases (x.x.X)
- **Trigger**: Every commit to the `main` branch
- **What happens**: 
  1. Tests run automatically
  2. Patch version is bumped (e.g., 1.0.0 → 1.0.1)
  3. Package is built and published to NPM
  4. GitHub release is created
- **Use for**: Bug fixes, small improvements, documentation updates

### Manual Minor Releases (x.X.0)
- **Trigger**: Manual workflow dispatch or npm script
- **What happens**:
  1. Tests run
  2. Minor version is bumped (e.g., 1.0.5 → 1.1.0)  
  3. Package is built and published to NPM
  4. GitHub release is created
- **Use for**: New features, enhancements (non-breaking)

### Manual Major Releases (X.0.0)
- **Trigger**: Manual workflow dispatch or npm script  
- **What happens**:
  1. Tests run
  2. Major version is bumped (e.g., 1.2.3 → 2.0.0)
  3. Package is built and published to NPM  
  4. GitHub release is created
- **Use for**: Breaking changes, major API updates

## Releasing

### For Patch Releases
Just push to main - it's automatic! 🎉

```bash
git push origin main
```

### For Minor Releases
```bash
# Option 1: Using npm script (requires GitHub CLI)
npm run release:minor

# Option 2: Via GitHub UI
# Go to Actions > Manual Release (Minor/Major) > Run workflow > Select "minor"
```

### For Major Releases  
```bash
# Option 1: Using npm script (requires GitHub CLI)
npm run release:major

# Option 2: Via GitHub UI
# Go to Actions > Manual Release (Minor/Major) > Run workflow > Select "major"
```

## Setup Requirements

### For Maintainers
1. **NPM Token**: Add `NPM_TOKEN` secret to GitHub repository settings
2. **GitHub CLI** (for local scripts): Install from https://cli.github.com/
3. **Authentication**: Run `gh auth login` locally

### NPM Token Setup
1. Go to https://www.npmjs.com/settings/tokens
2. Create a new "Automation" token
3. Add it as `NPM_TOKEN` in GitHub repository secrets

## Version Strategy

- **Patch** (1.0.X): Bug fixes, documentation, small tweaks
- **Minor** (1.X.0): New features, enhancements, non-breaking changes  
- **Major** (X.0.0): Breaking changes, major API redesigns

## Workflow Files

- `.github/workflows/auto-release.yml` - Automatic patch releases on main
- `.github/workflows/publish.yml` - Manual minor/major releases
- `scripts/release-minor.js` - Local script for minor releases
- `scripts/release-major.js` - Local script for major releases
