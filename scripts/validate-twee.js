#!/usr/bin/env node

/**
 * Validation script for Twee files
 * Checks for common issues in Twee source files
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');
let hasErrors = false;

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function validateTweeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const errors = [];
  const warnings = [];

  // Check for basic Twee passage format
  const passages = content.split(/^:: /m).filter(p => p.trim());
  
  if (passages.length === 0) {
    errors.push('No passages found in file');
  }

  // Check each passage
  passages.forEach((passage, index) => {
    const lines = passage.split('\n');
    const header = lines[0];

    // Skip if this is before the first passage
    if (!header || !header.trim()) return;

    // Check for passage name
    if (!header.match(/^\S+/)) {
      errors.push(`Passage ${index}: Missing passage name`);
    }

    // Check for unclosed brackets
    const openBrackets = (passage.match(/\[\[/g) || []).length;
    const closeBrackets = (passage.match(/\]\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      warnings.push(`Passage ${index}: Mismatched link brackets ([[/]]) - ${openBrackets} open, ${closeBrackets} close`);
    }

    // Check for unclosed macros
    const openMacros = (passage.match(/<<(?!\/)/g) || []).length;
    const closeMacros = (passage.match(/>>/g) || []).length;
    if (openMacros !== closeMacros) {
      warnings.push(`Passage ${index}: Mismatched macro delimiters (<</>>) - ${openMacros} open, ${closeMacros} close`);
    }
  });

  // Report results for this file
  if (errors.length > 0) {
    log(`\n❌ ${fileName}:`, colors.red);
    errors.forEach(err => log(`  - ${err}`, colors.red));
    hasErrors = true;
  }

  if (warnings.length > 0) {
    log(`\n⚠️  ${fileName}:`, colors.yellow);
    warnings.forEach(warn => log(`  - ${warn}`, colors.yellow));
  }

  if (errors.length === 0 && warnings.length === 0) {
    log(`✓ ${fileName}`, colors.green);
  }

  return { errors, warnings };
}

function main() {
  log('\n🔍 Validating Twee files...\n', colors.blue);

  if (!fs.existsSync(SRC_DIR)) {
    log(`Error: Source directory not found: ${SRC_DIR}`, colors.red);
    process.exit(1);
  }

  const files = fs.readdirSync(SRC_DIR)
    .filter(file => file.endsWith('.twee'))
    .map(file => path.join(SRC_DIR, file));

  if (files.length === 0) {
    log('No .twee files found in src/ directory', colors.yellow);
    process.exit(1);
  }

  log(`Found ${files.length} Twee file(s) to validate\n`, colors.blue);

  let totalErrors = 0;
  let totalWarnings = 0;

  files.forEach(file => {
    const result = validateTweeFile(file);
    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;
  });

  // Summary
  log('\n' + '='.repeat(50), colors.blue);
  if (hasErrors) {
    log(`\n❌ Validation failed with ${totalErrors} error(s) and ${totalWarnings} warning(s)`, colors.red);
    process.exit(1);
  } else if (totalWarnings > 0) {
    log(`\n⚠️  Validation completed with ${totalWarnings} warning(s)`, colors.yellow);
  } else {
    log('\n✅ All Twee files validated successfully!', colors.green);
  }
}

main();
