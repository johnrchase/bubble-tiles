#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const appPath = path.join(__dirname, '..', 'app.js');
const source = fs.readFileSync(appPath, 'utf8');
const expected2A = 'RB2B: makeRhombicBubbleTile("2A", "#fe3028", [1, 0, 1, 0]),';
const expected2C = 'RB3B: makeRhombicBubbleTile("2C", "#91bd0d", [1, 0, 0, 1]),';
if (!source.includes(expected2A) || !source.includes(expected2C)) {
  console.error('Rhombic naming regression: expected RB2B to remain 2A and RB3B to remain 2C with their settled colors and bite patterns.');
  process.exit(1);
}
if (!source.includes('ensureArcVariantTileDefinition(usesChiralIdentity ? colorType : baseType, targetBites)') ||
    !source.includes('definition.chiralIdentityType || definition.arcSourceType')) {
  console.error('Rhombic chiral regression: Arc-Dual variants must retain their canonical identity so H/V can switch partner identity and color.');
  process.exit(1);
}
console.log('Rhombic 2A/2C guard passed.');
