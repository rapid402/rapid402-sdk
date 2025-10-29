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
  
  // Check if repo exists, create if not
  let repo;
  try {
    const { data } = await octokit.repos.get({
      owner: user.login,
      repo: repoName
    });
    repo = data;
    console.log(`✅ Repository ${repoName} found`);
  } catch (error: any) {
    if (error.status === 404) {
      console.log(`📦 Creating repository ${repoName}...`);
      const { data } = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        description: '@rapid402/sdk - TypeScript SDK for x402 payment protocol on Solana',
        private: false,
        auto_init: false
      });
      repo = data;
      console.log(`✅ Repository created: ${repo.html_url}`);
    } else {
      throw error;
    }
  }
  
  // Get current commit SHA
  let currentCommitSha: string | undefined;
  try {
    const { data: ref } = await octokit.git.getRef({
      owner: user.login,
      repo: repoName,
      ref: `heads/${branchName}`
    });
    currentCommitSha = ref.object.sha;
  } catch (error: any) {
    if (error.status !== 404 && error.status !== 409) throw error;
    console.log('📝 Repository is empty, creating initial commit');
  }
  
  // Get current tree if it exists
  let baseTreeSha: string | undefined;
  if (currentCommitSha) {
    const { data: commit } = await octokit.git.getCommit({
      owner: user.login,
      repo: repoName,
      commit_sha: currentCommitSha
    });
    baseTreeSha = commit.tree.sha;
  }
  
  console.log('📂 Reading SDK files...');
  
  // Files to upload - organized as they appear in the screenshot
  const fileMap: Record<string, string> = {
    // Root config files
    '.eslintrc.js': 'module.exports = {\n  parser: "@typescript-eslint/parser",\n  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],\n  rules: {}\n};\n',
    '.gitignore': 'node_modules/\ndist/\n*.log\n.env\n.DS_Store\n',
    'jest.config.js': 'module.exports = {\n  preset: "ts-jest",\n  testEnvironment: "node"\n};\n',
    'tsup.config.ts': `import { defineConfig } from 'tsup';\n\nexport default defineConfig({\n  entry: ['src/index.ts'],\n  format: ['esm', 'cjs'],\n  dts: true,\n  splitting: false,\n  sourcemap: true,\n  clean: true,\n});\n`,
    
    // Source files (from shared/sdk)
    'src/index.ts': null, // Will read from shared/sdk/index.ts
    'src/client.ts': null, // Will read from shared/sdk/client.ts
    'src/types.ts': null, // Will read from shared/sdk/types.ts
    
    // Package files
    'package.json': null, // Will read from shared/sdk/package.json
    'tsconfig.json': null, // Will read from shared/sdk/tsconfig.json
    'README.md': null, // Will read from shared/sdk/README.md
  };
  
  const tree: any[] = [];
  
  for (const [targetPath, content] of Object.entries(fileMap)) {
    let fileContent: string;
    
    if (content !== null) {
      fileContent = content;
    } else {
      // Read from shared/sdk
      const sourcePath = targetPath.startsWith('src/') 
        ? `shared/sdk/${targetPath.replace('src/', '')}`
        : `shared/sdk/${targetPath}`;
      
      try {
        fileContent = await readFile(sourcePath, 'utf-8');
      } catch (error) {
        console.log(`  ⚠ Skipping ${targetPath} (not found at ${sourcePath})`);
        continue;
      }
    }
    
    const { data: blob } = await octokit.git.createBlob({
      owner: user.login,
      repo: repoName,
      content: fileContent,
      encoding: 'utf-8'
    });
    
    tree.push({
      path: targetPath,
      mode: '100644' as const,
      type: 'blob' as const,
      sha: blob.sha
    });
    
    console.log(`  ✓ ${targetPath}`);
  }
  
  // Create tree
  const { data: newTree } = await octokit.git.createTree({
    owner: user.login,
    repo: repoName,
    tree,
    base_tree: baseTreeSha
  });
  
  console.log(`🌳 Created tree with ${tree.length} files`);
  
  // Create commit
  const commitMessage = `📦 Update @rapid402/sdk

- TypeScript SDK for x402 payment protocol
- Solana blockchain support
- Full type definitions
- Published on npm`;
  
  const { data: newCommit } = await octokit.git.createCommit({
    owner: user.login,
    repo: repoName,
    message: commitMessage,
    tree: newTree.sha,
    parents: currentCommitSha ? [currentCommitSha] : []
  });
  
  console.log(`💾 Created commit: ${newCommit.sha.substring(0, 7)}`);
  
  // Update reference
  try {
    await octokit.git.updateRef({
      owner: user.login,
      repo: repoName,
      ref: `heads/${branchName}`,
      sha: newCommit.sha
    });
  } catch (error: any) {
    if (error.status === 422) {
      await octokit.git.createRef({
        owner: user.login,
        repo: repoName,
        ref: `refs/heads/${branchName}`,
        sha: newCommit.sha
      });
    } else {
      throw error;
    }
  }
  
  console.log(`✨ Successfully pushed to ${branchName}`);
  console.log(`🔗 Repository: ${repo.html_url}`);
  
  return {
    url: repo.html_url,
    commitSha: newCommit.sha,
    filesUploaded: tree.length
  };
}

const repoName = process.argv[2] || 'rapid402-sdk';
pushSDKToGitHub(repoName)
  .then(result => {
    console.log('\n✅ SDK push completed!');
    console.log(`📊 ${result.filesUploaded} files uploaded`);
    console.log(`🔗 ${result.url}`);
  })
  .catch(error => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
