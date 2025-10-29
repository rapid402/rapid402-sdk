import { Octokit } from '@octokit/rest';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

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

async function uploadFile(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string
) {
  let sha: string | undefined;
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path });
    if ('sha' in data) sha = data.sha;
  } catch (e) {
    // File doesn't exist yet
  }
  
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    sha
  });
}

async function run() {
  const octokit = new Octokit({ auth: await getAccessToken() });
  const { data: user } = await octokit.users.getAuthenticated();
  const repo = 'rapid402-sdk';
  
  console.log('🚀 Pushing enhanced SDK to GitHub...\n');
  
  const files = [
    // Core source files
    { github: 'src/index.ts', local: 'shared/sdk/src/index.ts' },
    { github: 'src/types.ts', local: 'shared/sdk/src/types.ts' },
    { github: 'src/client/index.ts', local: 'shared/sdk/src/client/index.ts' },
    { github: 'src/server/index.ts', local: 'shared/sdk/src/server/index.ts' },
    
    // Config files
    { github: 'package.json', local: 'shared/sdk/package.json' },
    { github: 'tsconfig.json', local: 'shared/sdk/tsconfig.json' },
    { github: 'tsup.config.ts', local: 'shared/sdk/tsup.config.ts' },
    { github: '.eslintrc.js', local: 'shared/sdk/.eslintrc.js' },
    { github: 'jest.config.js', local: 'shared/sdk/jest.config.js' },
    { github: '.prettierrc', local: 'shared/sdk/.prettierrc' },
    
    // Documentation
    { github: 'README.md', local: 'shared/sdk/README.md' },
  ];
  
  for (const { github: path, local: filePath } of files) {
    try {
      const content = await readFile(filePath, 'utf-8');
      await uploadFile(
        octokit,
        user.login,
        repo,
        path,
        content,
        `Update ${path} - Enhanced SDK with client/server split`
      );
      console.log(`  ✓ ${path}`);
    } catch (error: any) {
      console.log(`  ✗ ${path} - ${error.message}`);
    }
  }
  
  console.log('\n✅ Enhanced SDK pushed to GitHub!');
  console.log('\n📦 Your SDK now includes:');
  console.log('   ✓ Client-side utilities (automatic 402 handling, wallet integration)');
  console.log('   ✓ Server-side utilities (payment verification, Express middleware)');
  console.log('   ✓ Solana dependencies (@solana/web3.js, @solana/spl-token)');
  console.log('   ✓ Multiple export paths (./client, ./server, ./types)');
  console.log('   ✓ Comprehensive README with examples');
  console.log('\n🔗 https://github.com/rapid402/rapid402-sdk');
  console.log('\n📝 Next steps:');
  console.log('   1. cd into rapid402-sdk directory');
  console.log('   2. npm install');
  console.log('   3. npm run build');
  console.log('   4. npm version patch (increment version)');
  console.log('   5. npm publish (publish to npm)');
}

run().catch(console.error);
