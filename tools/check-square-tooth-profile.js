#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const appPath = path.join(__dirname, '..', 'app.js');
const src = fs.readFileSync(appPath, 'utf8');
function numberFor(name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*(?:SIDE_LENGTH\\s*\\*\\s*)?([0-9.]+)\\s*;`);
  const match = src.match(re);
  if (!match) throw new Error(`Missing ${name}`);
  return Number(match[1]);
}
const depth = numberFor('ZIGZAG_PROFILE_DEPTH');
const maxFraction = numberFor('ZIGZAG_PROFILE_MAX_SEGMENT_FRACTION');
const shoulderIn = numberFor('ZIGZAG_PROFILE_SHOULDER_IN');
const shoulderOut = numberFor('ZIGZAG_PROFILE_SHOULDER_OUT');
if (depth > 0.16) throw new Error(`Square-tooth depth ${depth} is too large; 60-degree corners can self-intersect.`);
if (maxFraction > 0.18) throw new Error(`Square-tooth segment fraction ${maxFraction} is too large; 60-degree corners can self-intersect.`);
if (shoulderIn < 0.38 || shoulderOut > 0.62) throw new Error(`Square-tooth shoulders ${shoulderIn}/${shoulderOut} are too wide; 60-degree corners can self-intersect.`);
console.log(`Square-tooth profile check passed: depth=${depth}, maxFraction=${maxFraction}, shoulders=${shoulderIn}/${shoulderOut}`);
