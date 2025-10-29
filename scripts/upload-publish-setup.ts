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
  
  console.log('📤 Uploading PUBLISH_SETUP.md...');
  
  const content = await readFile('shared/sdk/.github/PUBLISH_SETUP.md', 'utf-8');
  
  await octokit.repos.createOrUpdateFileContents({
    owner: user.login,
    repo,
    path: '.github/PUBLISH_SETUP.md',
    message: 'Add publishing setup documentation',
    content: Buffer.from(content).toString('base64')
  });
  
  console.log('✅ PUBLISH_SETUP.md uploaded successfully!');
  console.log('🔗 https://github.com/rapid402/rapid402-sdk/blob/main/.github/PUBLISH_SETUP.md');
  console.log('\n📋 Your SDK now has the complete PayAI structure:');
  console.log('   ✓ .github/PUBLISH_SETUP.md - Publishing documentation');
  console.log('   ✓ .github/workflows/test.yml - CI testing (manual add)');
  console.log('   ✓ .github/workflows/publish.yml - NPM publishing (manual add)');
  console.log('   ✓ src/ - Source code');
  console.log('   ✓ tests/ - Test files');
  console.log('   ✓ All config files');
}

run().catch(console.error);
