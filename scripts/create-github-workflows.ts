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
  
  console.log('📁 Creating .github folder structure...');
  
  // Create .github/README.md first to create the folder
  await octokit.repos.createOrUpdateFileContents({
    owner: user.login,
    repo,
    path: '.github/README.md',
    message: 'Create .github folder',
    content: Buffer.from('# GitHub Configuration\n\nThis folder contains GitHub Actions workflows for CI/CD.\n').toString('base64')
  });
  console.log('  ✓ Created .github folder');
  
  // Now create workflow files
  const testYml = await readFile('shared/sdk/.github/workflows/test.yml', 'utf-8');
  await octokit.repos.createOrUpdateFileContents({
    owner: user.login,
    repo,
    path: '.github/workflows/test.yml',
    message: 'Add test workflow',
    content: Buffer.from(testYml).toString('base64')
  });
  console.log('  ✓ .github/workflows/test.yml');
  
  const publishYml = await readFile('shared/sdk/.github/workflows/publish.yml', 'utf-8');
  await octokit.repos.createOrUpdateFileContents({
    owner: user.login,
    repo,
    path: '.github/workflows/publish.yml',
    message: 'Add publish workflow',
    content: Buffer.from(publishYml).toString('base64')
  });
  console.log('  ✓ .github/workflows/publish.yml');
  
  console.log('\n✅ All workflow files uploaded!');
  console.log('📦 SDK now has complete structure matching PayAI');
  console.log('🔗 https://github.com/rapid402/rapid402-sdk');
}

run().catch(console.error);
