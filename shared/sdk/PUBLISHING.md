# Publishing @rapid402/sdk to npm

This guide explains how to publish the Rapid402 SDK to the npm registry so users can install it with `npm install @rapid402/sdk`.

## Prerequisites

1. **npm Account**: Create a free account at [npmjs.com](https://www.npmjs.com/signup)
2. **npm CLI**: Already installed (comes with Node.js)
3. **Access Rights**: You need to own the `@rapid402` organization on npm or use a different scope

## One-Time Setup

### 1. Login to npm

```bash
cd shared/sdk
npm login
```

This will prompt you for:
- Username
- Password
- Email
- One-time password (2FA if enabled)

### 2. (Optional) Create npm Organization

If you want to publish as `@rapid402/sdk`, you need to create the `@rapid402` organization on npm:

1. Go to [npmjs.com](https://www.npmjs.com)
2. Click your profile → "Add Organization"
3. Create organization named `rapid402`

**Alternative**: Publish without a scope (just `rapid402-sdk`) by changing `package.json`:
```json
{
  "name": "rapid402-sdk",  // instead of @rapid402/sdk
  ...
}
```

## Publishing Process

### Step 1: Build the SDK

The SDK is already built! The `dist/` folder contains the compiled code.

To rebuild manually:
```bash
cd shared/sdk
npx tsc
```

### Step 2: Test the Package Locally (Optional)

Before publishing, test the package:

```bash
# Create a tarball
npm pack

# This creates rapid402-sdk-1.0.0.tgz
# Install it in another project to test:
cd /path/to/test-project
npm install /path/to/shared/sdk/rapid402-sdk-1.0.0.tgz
```

### Step 3: Publish to npm

```bash
cd shared/sdk

# First time publishing (public package)
npm publish --access public

# For updates (after changing version in package.json)
npm publish
```

### Step 4: Verify the Package

After publishing, verify at:
- Package page: `https://www.npmjs.com/package/@rapid402/sdk`
- Try installing: `npm install @rapid402/sdk`

## Version Management

### Update Version Before Publishing

Before each new publish, update the version in `package.json`:

```bash
# Patch version (bug fixes): 1.0.0 → 1.0.1
npm version patch

# Minor version (new features): 1.0.0 → 1.1.0
npm version minor

# Major version (breaking changes): 1.0.0 → 2.0.0
npm version major
```

This will:
- Update `package.json`
- Create a git tag
- Commit the change

### Version Guidelines

- **Patch** (1.0.x): Bug fixes, documentation updates
- **Minor** (1.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

## Troubleshooting

### Error: "Package name taken"

If `@rapid402/sdk` is taken:
1. Use a different name: `@yourname/rapid402-sdk`
2. Or publish without scope: `rapid402-sdk`

### Error: "You need permission"

You need to:
1. Own the `@rapid402` organization on npm
2. Or publish under your username: `@yourusername/sdk`

### Error: "Already published"

You're trying to publish the same version twice. Update version:
```bash
npm version patch
npm publish
```

## Automated Publishing (GitHub Actions)

For production, set up automated publishing with GitHub Actions:

```yaml
# .github/workflows/publish.yml
name: Publish SDK
on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: cd shared/sdk && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## After Publishing

Once published, users can install your SDK:

```bash
npm install @rapid402/sdk
```

And use it in their code:

```typescript
import { Rapid402Client } from '@rapid402/sdk';

const client = new Rapid402Client({
  baseUrl: 'https://rapid402.com/api/v1'
});
```

## Package Updates

When you make changes:

1. Update the code in `shared/sdk/`
2. Rebuild: `npx tsc`
3. Update version: `npm version patch` (or minor/major)
4. Publish: `npm publish`

## Support

- npm Documentation: https://docs.npmjs.com/
- Publishing Guide: https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry
- Scoped Packages: https://docs.npmjs.com/about-scopes
