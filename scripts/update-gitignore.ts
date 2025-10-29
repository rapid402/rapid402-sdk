import { Octokit } from '@octokit/rest';
import { readFile } from 'fs/promises';

let connectionSettings: any;

async function getAccessToken() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY ? 'repl ' + process.env.REPL_IDENTITY : process.env.WEB_REPL_RENEWAL ? 'depl ' + process.env.WEB_REPL_RENEWAL : null;
  if (!xReplitToken) throw new Error('Token not found');
  
  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    { headers: { 'Accept': 'application/json', 'X_REPLIT_TOKEN': xReplitToken } }
  ).then(res => res.json()).then(data => data.items?.[0]);
  
  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;
  if (!accessToken) throw new Error('Not connected');
  return accessToken;
}

async function run() {
  const octokit = new Octokit({ auth: await getAccessToken() });
  const { data: user } = await octokit.users.getAuthenticated();
  const repo = 'rapid402-sdk';
  
  console.log('📤 Updating .gitignore with comprehensive patterns...');
  
  const content = await readFile('shared/sdk/.gitignore', 'utf-8');
  
  // Get existing file SHA
  let sha: string | undefined;
  try {
    const { data } = await octokit.repos.getContent({
      owner: user.login,
      repo,
      path: '.gitignore'
    });
    if ('sha' in data) sha = data.sha;
  } catch (e) {
    // File doesn't exist yet
  }
  
  await octokit.repos.createOrUpdateFileContents({
    owner: user.login,
    repo,
    path: '.gitignore',
    message: 'Update .gitignore with comprehensive patterns',
    content: Buffer.from(content).toString('base64'),
    sha
  });
  
  console.log('✅ .gitignore updated successfully!');
  console.log('📋 Now includes sections for:');
  console.log('   - Build outputs');
  console.log('   - Environment files');
  console.log('   - Logs');
  console.log('   - Coverage reports');
  console.log('   - Editor files');
  console.log('   - OS generated files');
  console.log('   - And more...');
}

run().catch(console.error);
