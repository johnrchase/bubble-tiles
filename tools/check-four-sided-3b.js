#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const appPath = path.join(__dirname, '..', 'app.js');
const source = fs.readFileSync(appPath, 'utf8');
const expected = 'RB3B: makeRhombicBubbleTile("2A", "#7f90d5", [1, 0, 0, 1]),';
if (!source.includes(expected)) {
  console.error('Four-sided 2A regression: expected RB3B to remain the 2A tile with bite pattern [1, 0, 0, 1].');
  process.exit(1);
}
console.log('Four-sided 2A guard passed.');
