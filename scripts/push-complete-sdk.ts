import { Octokit } from '@octokit/rest';
import { readFile } from 'fs/promises';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function pushCompleteSDK(repoName: string, branchName = 'main') {
  console.log('🚀 Pushing complete SDK to GitHub...');
  
  const octokit = await getGitHubClient();
  const { data: user } = await octokit.users.getAuthenticated();
  
  console.log(`📝 Authenticated as: ${user.login}`);
  
  // All files to upload matching PayAI structure
  const filesToUpload: Record<string, string> = {
    // Root config files
    '.eslintrc.js': 'shared/sdk/.eslintrc.js',
    '.gitignore': 'shared/sdk/.gitignore',
    'jest.config.js': 'shared/sdk/jest.config.js',
    'tsup.config.ts': 'shared/sdk/tsup.config.ts',
    'package.json': 'shared/sdk/package.json',
    'package-lock.json': 'shared/sdk/package-lock.json',
    'tsconfig.json': 'shared/sdk/tsconfig.json',
    'README.md': 'shared/sdk/README.md',
    
    // Source files
    'src/index.ts': 'shared/sdk/index.ts',
    'src/client.ts': 'shared/sdk/client.ts',
    'src/types.ts': 'shared/sdk/types.ts',
    
    // Test files
    'tests/client.test.ts': 'shared/sdk/tests/client.test.ts',
    'tests/types.test.ts': 'shared/sdk/tests/types.test.ts',
    
    // GitHub workflows
    '.github/workflows/test.yml': 'shared/sdk/.github/workflows/test.yml',
    '.github/workflows/publish.yml': 'shared/sdk/.github/workflows/publish.yml',
  };
  
  // Static config files with inline content
  const staticFiles: Record<string, string> = {
    '.eslintrc.js': `module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {}
};
`,
    '.gitignore': `node_modules/
dist/
*.log
.env
.DS_Store
`,
    'jest.config.js': `module.exports = {
  preset: "ts-jest",
  testEnvironment: "node"
};
`,
    'tsup.config.ts': `import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
`
  };
  
  console.log('📂 Reading and uploading files...\n');
  
  let uploaded = 0;
  
  for (const [targetPath, sourcePath] of Object.entries(filesToUpload)) {
    let content: string;
    
    // Use static content or read from file
    if (staticFiles[targetPath]) {
      content = staticFiles[targetPath];
    } else {
      try {
        content = await readFile(sourcePath, 'utf-8');
      } catch (error) {
        console.log(`  ⚠ Skipping ${targetPath} (not found)`);
        continue;
      }
    }
    
    try {
      await octokit.repos.createOrUpdateFileContents({
        owner: user.login,
        repo: repoName,
        path: targetPath,
        message: `Add ${targetPath}`,
        content: Buffer.from(content).toString('base64'),
        branch: branchName
      });
      console.log(`  ✓ ${targetPath}`);
      uploaded++;
    } catch (error: any) {
      console.log(`  ✗ ${targetPath} - ${error.message}`);
    }
  }
  
  const repoUrl = `https://github.com/${user.login}/${repoName}`;
  console.log(`\n✨ Complete SDK structure pushed!`);
  console.log(`🔗 ${repoUrl}`);
  
  return { url: repoUrl, filesUploaded: uploaded };
}

const repoName = process.argv[2] || 'rapid402-sdk';
pushCompleteSDK(repoName)
  .then(result => {
    console.log(`\n✅ ${result.filesUploaded} files uploaded`);
    console.log(`📦 SDK matches PayAI structure with .github, src, and tests folders`);
  })
  .catch(error => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
