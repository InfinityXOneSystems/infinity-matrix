#!/usr/bin/env node

/**
 * System Health Check Script
 * 
 * Performs comprehensive health checks on all Infinity-Matrix components:
 * - GitHub API connectivity
 * - Supabase connection
 * - Cloud services
 * - Local system resources
 * 
 * @see docs/blueprint.md for architecture details
 * @see .github/workflows/system-health.yml for automated checks
 */

const https = require('https');
const { execSync } = require('child_process');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkUrl(url, name) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 5000 }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        log(`  ✓ ${name} is accessible (${res.statusCode})`, 'green');
        resolve(true);
      } else {
        log(`  ✗ ${name} returned status ${res.statusCode}`, 'red');
        resolve(false);
      }
    }).on('error', (err) => {
      log(`  ✗ ${name} is not accessible: ${err.message}`, 'red');
      resolve(false);
    }).on('timeout', () => {
      log(`  ✗ ${name} request timed out`, 'red');
      resolve(false);
    });
  });
}

async function checkServices() {
  log('\n🔍 Checking External Services', 'blue');
  log('==============================\n');
  
  const checks = [
    checkUrl('https://api.github.com', 'GitHub API'),
    checkUrl('https://infinityxai.com', 'infinityxai.com'),
  ];
  
  // Check Supabase if configured
  if (process.env.SUPABASE_URL) {
    checks.push(checkUrl(process.env.SUPABASE_URL, 'Supabase'));
  } else {
    log('  ⚠ Supabase URL not configured', 'yellow');
  }
  
  return await Promise.all(checks);
}

function checkLocalResources() {
  log('\n🖥️  Checking Local Resources', 'blue');
  log('============================\n');
  
  let allPassed = true;
  
  // Check required files
  const requiredFiles = [
    'README.md',
    'package.json',
    'docs/blueprint.md',
    'docs/roadmap.md',
    'docs/prompt_suite.md',
    'docs/system_manifest.md',
    'COLLABORATION.md',
    'setup_instructions.md'
  ];
  
  requiredFiles.forEach(file => {
    try {
      execSync(`test -f ${file}`, { stdio: 'ignore' });
      log(`  ✓ ${file}`, 'green');
    } catch (err) {
      log(`  ✗ ${file} is missing`, 'red');
      allPassed = false;
    }
  });
  
  return allPassed;
}

function checkTooling() {
  log('\n🔧 Checking Required Tools', 'blue');
  log('===========================\n');
  
  const tools = ['git', 'node', 'npm'];
  let allFound = true;
  
  tools.forEach(tool => {
    try {
      const version = execSync(`${tool} --version`, { encoding: 'utf8' }).trim();
      log(`  ✓ ${tool}: ${version}`, 'green');
    } catch (err) {
      log(`  ✗ ${tool} not found`, 'red');
      allFound = false;
    }
  });
  
  return allFound;
}

async function main() {
  log('\n🏥 Infinity-Matrix System Health Check', 'blue');
  log('=======================================\n');
  
  const serviceResults = await checkServices();
  const localCheck = checkLocalResources();
  const toolingCheck = checkTooling();
  
  const allPassed = serviceResults.every(r => r) && localCheck && toolingCheck;
  
  log('\n' + '='.repeat(40));
  if (allPassed) {
    log('\n✓ All health checks passed!', 'green');
    process.exit(0);
  } else {
    log('\n✗ Some health checks failed', 'red');
    log('  Review the output above for details', 'yellow');
    process.exit(1);
  }
}

// Run health check
main().catch(err => {
  log(`\n❌ Health check error: ${err.message}`, 'red');
  process.exit(1);
});
