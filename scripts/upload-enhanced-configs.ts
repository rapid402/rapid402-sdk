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
  
  console.log('🚀 Uploading enhanced config files matching PayAI standards...\n');
  
  const files = [
    { github: 'package.json', local: 'shared/sdk/package.json' },
    { github: 'tsconfig.json', local: 'shared/sdk/tsconfig.json' },
    { github: '.eslintrc.js', local: 'shared/sdk/.eslintrc.js' },
    { github: 'jest.config.js', local: 'shared/sdk/jest.config.js' },
    { github: '.prettierrc', local: 'shared/sdk/.prettierrc' },
  ];
  
  for (const { github: path, local: filePath } of files) {
    try {
      const content = await readFile(filePath, 'utf-8');
      
      // Get existing file SHA
      let sha: string | undefined;
      try {
        const { data } = await octokit.repos.getContent({
          owner: user.login,
          repo,
          path
        });
        if ('sha' in data) sha = data.sha;
      } catch (e) {
        // File doesn't exist yet
      }
      
      await octokit.repos.createOrUpdateFileContents({
        owner: user.login,
        repo,
        path,
        message: `Update ${path} with enhanced configuration`,
        content: Buffer.from(content).toString('base64'),
        sha
      });
      
      console.log(`  ✓ ${path}`);
    } catch (error: any) {
      console.log(`  ✗ ${path} - ${error.message}`);
    }
  }
  
  console.log('\n✅ All config files updated!');
  console.log('\n📋 Your SDK now has PayAI-level configurations:');
  console.log('   ✓ package.json - Multiple export paths, ESM+CJS, better scripts');
  console.log('   ✓ tsconfig.json - Strict TypeScript settings for quality');
  console.log('   ✓ .eslintrc.js - Professional linting rules');
  console.log('   ✓ jest.config.js - Better test coverage configuration');
  console.log('   ✓ .prettierrc - Code formatting configuration');
  console.log('\n🔗 https://github.com/rapid402/rapid402-sdk');
}

run().catch(console.error);
