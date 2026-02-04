#!/usr/bin/env node

/**
 * Build script for the City of Ghosts game
 * Uses Tweego to compile Twee files into HTML
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');
const OUTPUT_FILE = path.join(DIST_DIR, 'index.html');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function ensureDistDir() {
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
    log(`Created dist directory`, colors.cyan);
  }
}

function buildGame() {
  log('\n🔨 Building City of Ghosts...\n', colors.blue);

  ensureDistDir();

  // Check if tweego is available (note: tweego --version returns exit code 1, so we check stderr)
  exec('tweego --version 2>&1', (error, stdout) => {
    if (!stdout || !stdout.includes('tweego')) {
      log('❌ Error: Tweego not found. Please install Tweego first.', colors.red);
      log('   Installation: Download from https://github.com/tmedwards/tweego/releases', colors.cyan);
      process.exit(1);
    }

    // Build the game
    const buildCommand = `tweego "${SRC_DIR}/" -o "${OUTPUT_FILE}"`;
    log(`Executing: ${buildCommand}\n`, colors.cyan);

    exec(buildCommand, (error, stdout, stderr) => {
      if (error) {
        log(`❌ Build failed: ${error.message}`, colors.red);
        if (stderr) log(stderr, colors.red);
        process.exit(1);
      }

      if (stderr) {
        log(stderr, colors.red);
      }

      if (stdout) {
        log(stdout);
      }

      // Verify the output file was created
      if (fs.existsSync(OUTPUT_FILE)) {
        const stats = fs.statSync(OUTPUT_FILE);
        const fileSizeKB = (stats.size / 1024).toFixed(2);
        log(`✅ Build successful!`, colors.green);
        log(`   Output: ${OUTPUT_FILE}`, colors.cyan);
        log(`   Size: ${fileSizeKB} KB\n`, colors.cyan);
      } else {
        log('❌ Build failed: Output file not created', colors.red);
        process.exit(1);
      }
    });
  });
}

buildGame();
