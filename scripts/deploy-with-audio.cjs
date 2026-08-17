#!/usr/bin/env node
/*
 * deploy-with-audio.cjs — deploy INCLUDING the narration MP3s.
 *
 *   npm run deploy:audio                       # everything staged in public/audio
 *   npm run deploy:audio -- --only resource-civilization/en/adam-stone
 *
 * WHY: public/audio is excluded in .dockerignore so ordinary deploys stay small
 * (the audio would otherwise add ~900 MB to every one). Including it therefore
 * means disabling that exclusion, deploying, and putting it back — three manual
 * steps, one of which is easy to forget, and forgetting it makes every later
 * deploy huge.
 *
 * This does all three, and restores .dockerignore even if the deploy fails.
 * A normal `fly deploy` is unaffected and still excludes the audio.
 */

const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');

const DOCKERIGNORE = '.dockerignore';
const RULE = 'public/audio';

const args = process.argv.slice(2);
const onlyIndex = args.indexOf('--only');
const only = onlyIndex >= 0 ? args[onlyIndex + 1] : null;

// 1. Stage the audio (only what was asked for, if filtered).
const stageArgs = ['scripts/stage-audio.cjs', ...(only ? ['--only', only] : [])];
console.log(`\n> node ${stageArgs.join(' ')}`);
execFileSync('node', stageArgs, { stdio: 'inherit' });

const staged = fs.existsSync('public/audio');
if (!staged) {
  console.error('\nNothing staged in public/audio — aborting rather than deploying an empty audio tree.');
  process.exit(1);
}

// 2. Disable the exclusion, remembering the exact original bytes.
const original = fs.readFileSync(DOCKERIGNORE, 'utf8');
if (!new RegExp(`^${RULE}[ \\t]*\\r?$`, 'm').test(original)) {
  console.error(`\n"${RULE}" is not an active line in ${DOCKERIGNORE}. Not guessing — fix it by hand.`);
  process.exit(1);
}
const opened = original.replace(new RegExp(`^${RULE}[ \\t]*\\r?$`, 'm'), `# ${RULE}   # re-enabled automatically after deploy`);

let code = 1;
try {
  fs.writeFileSync(DOCKERIGNORE, opened, 'utf8');
  const size = fs.readdirSync('public/audio').length;
  console.log(`\n> fly deploy   (audio INCLUDED — ${size} top-level entr${size === 1 ? 'y' : 'ies'} in public/audio)\n`);
  code = spawnSync('fly', ['deploy', ...args.filter((a, i) => a !== '--only' && i !== onlyIndex + 1)],
    { stdio: 'inherit', shell: true }).status ?? 1;
} finally {
  // 3. Always restore, even on failure or Ctrl-C, so the next ordinary deploy
  // is small again. This is the whole reason the script exists.
  fs.writeFileSync(DOCKERIGNORE, original, 'utf8');
  console.log(`\n${DOCKERIGNORE} restored — ordinary deploys exclude the audio again.`);
}

process.exit(code);
