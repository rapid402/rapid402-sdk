import { Octokit } from '@octokit/rest';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

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
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
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

async function getUserInfo() {
  const octokit = await getGitHubClient();
  const { data: user } = await octokit.users.getAuthenticated();
  return user;
}

async function pushToGitHub(repoName: string, branchName = 'main') {
  console.log('🚀 Starting GitHub push...');
  
  const octokit = await getGitHubClient();
  const user = await getUserInfo();
  
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
        description: 'Rapid402 - x402 Payment Facilitator on Solana',
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
    console.log(`📍 Current commit: ${currentCommitSha.substring(0, 7)}`);
  } catch (error: any) {
    if (error.status !== 404) throw error;
    console.log(`🌱 Creating new branch: ${branchName}`);
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
  
  console.log('📂 Reading SDK package files...');
  
  // Create blobs for SDK files only (from screenshot)
  const filesToUpload = [
    'shared/sdk/.eslintrc.js',
    'shared/sdk/.gitignore',
    'shared/sdk/README.md',
    'shared/sdk/jest.config.js',
    'shared/sdk/package-lock.json',
    'shared/sdk/package.json',
    'shared/sdk/tsconfig.json',
    'shared/sdk/tsup.config.ts'
  ];
  
  const tree: any[] = [];
  
  for (const filePath of filesToUpload) {
    try {
      const content = await readFile(filePath, 'utf-8');
      const { data: blob } = await octokit.git.createBlob({
        owner: user.login,
        repo: repoName,
        content,
        encoding: 'utf-8'
      });
      
      tree.push({
        path: filePath,
        mode: '100644' as const,
        type: 'blob' as const,
        sha: blob.sha
      });
      
      console.log(`  ✓ ${filePath}`);
    } catch (error) {
      console.log(`  ⚠ Skipping ${filePath} (not found)`);
    }
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
  const commitMessage = `🚀 Update Rapid402 - Production ready Solana x402 facilitator

- Real Ed25519 signature verification
- On-chain SOL and SPL token settlements
- Live Solana blockchain integration
- Solana purple branding
- @rapid402/sdk published on npm`;
  
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
      // Reference doesn't exist, create it
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
  console.log(`📝 Commit: ${repo.html_url}/commit/${newCommit.sha}`);
  
  return {
    url: repo.html_url,
    commitSha: newCommit.sha,
    filesUploaded: tree.length
  };
}

// Run the script
const repoName = process.argv[2] || 'rapid402';
pushToGitHub(repoName)
  .then(result => {
    console.log('\n✅ Push completed successfully!');
    console.log(`📊 ${result.filesUploaded} files uploaded`);
  })
  .catch(error => {
    console.error('\n❌ Error pushing to GitHub:', error.message);
    process.exit(1);
  });
