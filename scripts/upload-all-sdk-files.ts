import { Octokit } from '@octokit/rest';
import { readFile, readdir } from 'fs/promises';
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

  if (!xReplitToken) throw new Error('X_REPLIT_TOKEN not found');

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    { headers: { 'Accept': 'application/json', 'X_REPLIT_TOKEN': xReplitToken } }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;
  if (!connectionSettings || !accessToken) throw new Error('GitHub not connected');
  return accessToken;
}

async function getGitHubClient() {
  return new Octokit({ auth: await getAccessToken() });
}

async function uploadAll(repoName: string) {
  console.log('🚀 Uploading complete SDK...');
  
  const octokit = await getGitHubClient();
  const { data: user } = await octokit.users.getAuthenticated();
  
  const files = [
    ['.eslintrc.js', '/tmp/sdk-temp/.eslintrc.js'],
    ['.gitignore', '/tmp/sdk-temp/.gitignore'],
    ['jest.config.js', '/tmp/sdk-temp/jest.config.js'],
    ['tsup.config.ts', '/tmp/sdk-temp/tsup.config.ts'],
    ['package.json', '/tmp/sdk-temp/package.json'],
    ['package-lock.json', '/tmp/sdk-temp/package-lock.json'],
    ['tsconfig.json', '/tmp/sdk-temp/tsconfig.json'],
    ['README.md', '/tmp/sdk-temp/README.md'],
    ['src/index.ts', '/tmp/sdk-temp/src/index.ts'],
    ['src/client.ts', '/tmp/sdk-temp/src/client.ts'],
    ['src/types.ts', '/tmp/sdk-temp/src/types.ts'],
    ['tests/client.test.ts', '/tmp/sdk-temp/tests/client.test.ts'],
    ['tests/types.test.ts', '/tmp/sdk-temp/tests/types.test.ts'],
    ['.github/workflows/test.yml', '/tmp/sdk-temp/.github/workflows/test.yml'],
    ['.github/workflows/publish.yml', '/tmp/sdk-temp/.github/workflows/publish.yml'],
  ];
  
  console.log(`📂 Uploading ${files.length} files...\n`);
  
  let uploaded = 0;
  for (const [path, filePath] of files) {
    try {
      const content = await readFile(filePath, 'utf-8');
      
      // Get existing file SHA if it exists
      let sha: string | undefined;
      try {
        const { data } = await octokit.repos.getContent({
          owner: user.login,
          repo: repoName,
          path
        });
        if ('sha' in data) sha = data.sha;
      } catch (e) {
        // File doesn't exist yet
      }
      
      await octokit.repos.createOrUpdateFileContents({
        owner: user.login,
        repo: repoName,
        path,
        message: sha ? `Update ${path}` : `Add ${path}`,
        content: Buffer.from(content).toString('base64'),
        sha
      });
      
      console.log(`  ✓ ${path}`);
      uploaded++;
    } catch (error: any) {
      console.log(`  ✗ ${path} - ${error.message}`);
    }
  }
  
  console.log(`\n✅ ${uploaded}/${files.length} files uploaded`);
  console.log(`🔗 https://github.com/${user.login}/${repoName}`);
}

uploadAll('rapid402-sdk').catch(console.error);
