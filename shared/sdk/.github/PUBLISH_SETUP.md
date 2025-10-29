# Publishing Setup

This document explains how to set up automated publishing for the `@rapid402/sdk` package.

## GitHub Secrets Required

You need to add the following secrets to your GitHub repository:

### 1. NPM_TOKEN

1. Go to [npmjs.com](https://npmjs.com/) and log in
2. Navigate to your account settings → Access Tokens
3. Create a new "Automation" token with "Publish" permissions
4. Copy the token
5. In your GitHub repository, go to Settings → Secrets and variables → Actions
6. Add a new repository secret named `NPM_TOKEN` with the token value

### 2. GITHUB_TOKEN

This is automatically provided by GitHub Actions, no setup needed.

## How the Workflow Works

The repository includes two GitHub Actions workflows:

### Test Workflow (`.github/workflows/test.yml`)

Runs on every push and pull request to main:
- Sets up Node.js 18 and 20 (matrix testing)
- Installs dependencies
- Runs ESLint for code quality
- Runs Jest tests
- Builds the package with TypeScript

### Publish Workflow (`.github/workflows/publish.yml`)

Runs when you create a GitHub release or manually trigger:
- Sets up Node.js 20
- Installs dependencies
- Builds the package
- Publishes to npm with public access
- Uses the NPM_TOKEN secret for authentication

## Publishing a New Version

### Method 1: Manual Release (Recommended)

1. Update the version in `package.json`:
   ```bash
   npm version patch   # 1.0.0 → 1.0.1
   npm version minor   # 1.0.0 → 1.1.0
   npm version major   # 1.0.0 → 2.0.0
   ```

2. Commit and push the version change:
   ```bash
   git add package.json
   git commit -m "Bump version to X.X.X"
   git push
   ```

3. Create a GitHub release:
   - Go to your repository → Releases → "Create a new release"
   - Create a new tag (e.g., `v1.0.1`)
   - Title: "Version 1.0.1"
   - Description: Describe what changed
   - Click "Publish release"

4. The publish workflow will automatically run and push to npm

### Method 2: Manual Trigger

1. Go to Actions → "Publish to npm" → "Run workflow"
2. Select the branch (usually `main`)
3. Click "Run workflow"

## Version Management Best Practices

### Semantic Versioning

Follow [semver](https://semver.org/) conventions:
- **PATCH** (1.0.X): Bug fixes, small improvements
- **MINOR** (1.X.0): New features, backward compatible
- **MAJOR** (X.0.0): Breaking changes

### Before Publishing

Make sure to:
1. ✅ All tests pass locally (`npm test`)
2. ✅ Code is properly linted (`npm run lint`)
3. ✅ Build succeeds (`npm run build`)
4. ✅ Update CHANGELOG.md (if you have one)
5. ✅ Version number is correct in package.json

## Testing the Workflow

1. **Test the test workflow:**
   - Create a branch
   - Make changes
   - Push to GitHub
   - Check the Actions tab to see tests run

2. **Test the publish workflow:**
   - Update version to something like `1.0.1-beta.1`
   - Create a pre-release on GitHub
   - Verify it publishes to npm with the beta tag

## Current Package Status

- **Package Name:** `@rapid402/sdk`
- **Current Version:** 1.0.0
- **Registry:** https://www.npmjs.com/package/@rapid402/sdk
- **Repository:** https://github.com/rapid402/rapid402-sdk

## Troubleshooting

### Common Issues:

1. **NPM_TOKEN not working**
   - Ensure it's an "Automation" token with publish permissions
   - Check the token hasn't expired
   - Verify it's added to GitHub repository secrets correctly

2. **Version already exists**
   - npm will reject publishing if the version already exists
   - Bump the version number before publishing
   - Check current version: `npm view @rapid402/sdk version`

3. **Build failures**
   - Ensure all dependencies are in package.json
   - Test the build locally: `npm run build`
   - Check for TypeScript errors

4. **Permission denied**
   - Ensure you're a member of the npm organization
   - Check that your NPM_TOKEN has publish permissions

### Viewing Logs:

- Go to your repository's Actions tab
- Click on the failed workflow run
- Expand each step to see detailed logs
- Look for red error messages

## Manual Publishing (Fallback)

If GitHub Actions aren't working, you can publish manually:

```bash
# Make sure you're logged into npm
npm login

# Build the package
npm run build

# Publish
npm publish --access public
```

## Security Notes

- Never commit the NPM_TOKEN to the repository
- Keep the token in GitHub Secrets only
- Rotate tokens periodically (every 90 days recommended)
- Use automation tokens, not personal access tokens
- Set token permissions to minimum required (publish only)

## Additional Resources

- [npm documentation on tokens](https://docs.npmjs.com/about-access-tokens)
- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)
- [x402 Protocol Documentation](https://x402.org/)
