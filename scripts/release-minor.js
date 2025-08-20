#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🚀 Triggering Minor Release via GitHub Actions...');

try {
  // Trigger the GitHub Action workflow for minor release
  execSync('gh workflow run publish.yml --field version_type=minor', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Minor release workflow triggered successfully!');
  console.log('📦 Check GitHub Actions tab to monitor the release process.');
  console.log('🔗 https://github.com/wilde-it/bruno-generator/actions');
  
} catch (error) {
  console.error('❌ Failed to trigger release:', error.message);
  console.log('\n💡 Make sure you have:');
  console.log('   - GitHub CLI installed: https://cli.github.com/');
  console.log('   - Authenticated with: gh auth login');
  console.log('   - Push access to the repository');
  process.exit(1);
}
