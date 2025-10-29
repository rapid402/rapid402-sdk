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

async function pushSDKToGitHub(repoName: string, branchName = 'main') {
  console.log('🚀 Starting SDK push to GitHub...');
  
  const octokit = await getGitHubClient();
  const { data: user } = await octokit.users.getAuthenticated();
  
  console.log(`📝 Authenticated as: ${user.login}`);
  
  // Files to upload
  const files = {
    '.eslintrc.js': 'module.exports = {\n  parser: "@typescript-eslint/parser",\n  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],\n  rules: {}\n};\n',
    '.gitignore': 'node_modules/\ndist/\n*.log\n.env\n.DS_Store\n',
    'jest.config.js': 'module.exports = {\n  preset: "ts-jest",\n  testEnvironment: "node"\n};\n',
    'tsup.config.ts': `import { defineConfig } from 'tsup';\n\nexport default defineConfig({\n  entry: ['src/index.ts'],\n  format: ['esm', 'cjs'],\n  dts: true,\n  splitting: false,\n  sourcemap: true,\n  clean: true,\n});\n`,
  };
  
  // Read from shared/sdk
  const sdkFiles: Record<string, string> = {
    'src/index.ts': 'shared/sdk/index.ts',
    'src/client.ts': 'shared/sdk/client.ts',
    'src/types.ts': 'shared/sdk/types.ts',
    'package.json': 'shared/sdk/package.json',
    'tsconfig.json': 'shared/sdk/tsconfig.json',
    'README.md': 'shared/sdk/README.md',
  };
  
  console.log('📂 Reading SDK files...');
  
  for (const [targetPath, sourcePath] of Object.entries(sdkFiles)) {
    try {
      const content = await readFile(sourcePath, 'utf-8');
      files[targetPath] = content;
      console.log(`  ✓ ${targetPath}`);
    } catch (error) {
      console.log(`  ⚠ Skipping ${targetPath}`);
    }
  }
  
  console.log(`\n📤 Uploading ${Object.keys(files).length} files to GitHub...`);
  
  let uploaded = 0;
  for (const [path, content] of Object.entries(files)) {
    try {
      await octokit.repos.createOrUpdateFileContents({
        owner: user.login,
        repo: repoName,
        path,
        message: `Add ${path}`,
        content: Buffer.from(content).toString('base64'),
        branch: branchName
      });
      console.log(`  ✓ ${path}`);
      uploaded++;
    } catch (error: any) {
      console.log(`  ✗ ${path} - ${error.message}`);
    }
  }
  
  const repoUrl = `https://github.com/${user.login}/${repoName}`;
  console.log(`\n✨ Successfully pushed to ${branchName}`);
  console.log(`🔗 Repository: ${repoUrl}`);
  
  return {
    url: repoUrl,
    filesUploaded: uploaded
  };
}

const repoName = process.argv[2] || 'rapid402-sdk';
pushSDKToGitHub(repoName)
  .then(result => {
    console.log(`\n✅ SDK push completed!`);
    console.log(`📊 ${result.filesUploaded} files uploaded`);
  })
  .catch(error => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
