#!/usr/bin/env node
/*
 * deploy.cjs — stage the approved narration, then deploy.
 *
 *   npm run deploy
 *
 * The audio now ships on EVERY deploy: public/audio holds only the recordings
 * listed in content/narration-approved.json, which is the publication decision.
 * This script simply makes sure that folder matches the approved list before
 * fly deploy copies the working directory into the image.
 *
 * It replaces an earlier design where the audio was excluded by default and had
 * to be opted into. That was right while public/audio was a scratch area of
 * evaluation takes, and wrong the moment a recording was chosen for publication:
 * an ordinary deploy would silently drop the studio voice from the live site.
 */

const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');

console.log('\n> node scripts/stage-audio.cjs   (approved recordings only)');
execFileSync('node', ['scripts/stage-audio.cjs'], { stdio: 'inherit' });

const approvedFile = 'content/narration-approved.json';
const approved = fs.existsSync(approvedFile)
  ? Object.keys(JSON.parse(fs.readFileSync(approvedFile, 'utf8')).approved || {})
  : [];

if (approved.length && !fs.existsSync('public/audio')) {
  console.error('\nApproved recordings are listed but nothing was staged.');
  console.error('Are the files still in tts-out? Deploying now would publish a page');
  console.error('that claims to have audio and does not. Aborting.');
  process.exit(1);
}

console.log(`\n> fly deploy   (${approved.length} approved recording(s) included)\n`);
const code = spawnSync('fly', ['deploy', ...process.argv.slice(2)],
  { stdio: 'inherit', shell: true }).status ?? 1;
process.exit(code);
