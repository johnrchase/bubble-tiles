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
const depth = numberFor('SPIKE_PROFILE_DEPTH');
const maxFraction = numberFor('SPIKE_PROFILE_MAX_SEGMENT_FRACTION');
const shoulderIn = numberFor('SPIKE_PROFILE_SHOULDER_IN');
const shoulderOut = numberFor('SPIKE_PROFILE_SHOULDER_OUT');
if (depth > 0.24) throw new Error(`Spike depth ${depth} is too large; this would reintroduce big spikes.`);
if (maxFraction > 0.28) throw new Error(`Spike segment fraction ${maxFraction} is too large; this would reintroduce big spikes.`);
if (shoulderIn < 0.33 || shoulderOut > 0.67) throw new Error(`Spike shoulders ${shoulderIn}/${shoulderOut} are too wide; this would reintroduce big spikes.`);
console.log(`Spike profile check passed: depth=${depth}, maxFraction=${maxFraction}, shoulders=${shoulderIn}/${shoulderOut}`);
