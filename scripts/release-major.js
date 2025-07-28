#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🚀 Triggering Major Release via GitHub Actions...');
console.log('⚠️  This will create a BREAKING CHANGE release!');

try {
  // Trigger the GitHub Action workflow for major release
  execSync('gh workflow run publish.yml --field version_type=major', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Major release workflow triggered successfully!');
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
