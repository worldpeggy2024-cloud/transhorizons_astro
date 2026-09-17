#!/usr/bin/env node
/*
 * Split verify.prompt.md into N self-contained parts (same instructions, whole sentence groups), balanced by size.
 *   node rof-split-prompt.cjs [parts=3] [copyDir] [copyPrefix]
 * Writes verify.prompt.part-K.md in the job folder; with copyDir, also <copyDir>/<copyPrefix>-part-K.md.
 */
'use strict';
const fs = require('fs');
const JOB = 'C:/Users/peggy/DevTest/transhorizons_astro/content/docs/article-jobs/ring-of-fire';
const N = Number(process.argv[2] || 3);
const [, , , COPY, PREFIX = 'ring-of-fire-verify'] = process.argv;
const src = fs.readFileSync(`${JOB}/verify.prompt.md`, 'utf8').replace(/\r\n/g, '\n');
const first = src.indexOf('\n## Sentence ');
const head = src.slice(0, first).trimEnd();
const groups = src.slice(first + 1).split(/\n(?=## Sentence )/).map((g) => g.trimEnd());
const total = groups.reduce((a, g) => a + g.length, 0);
const parts = [];
let cur = [];
let size = 0;
for (const g of groups) {
  if (cur.length && size + g.length / 2 > (total / N) * (parts.length + 1) && parts.length < N - 1) { parts.push(cur); cur = []; }
  cur.push(g);
  size += g.length;
}
parts.push(cur);
const [title, ...rest] = head.split('\n');
parts.forEach((p, k) => {
  const quotes = p.join('\n').split('\n').filter((l) => /^- c\d+(?:-\d+)? — /.test(l)).length;
  const body = `${title} — part ${k + 1} of ${parts.length} (${quotes} quotes in ${p.length} sentences)\n${rest.join('\n')
    .replace('outside any project.', 'outside any project, with web search OFF.')}\n\n${p.join('\n\n')}\n`;
  fs.writeFileSync(`${JOB}/verify.prompt.part-${k + 1}.md`, body);
  if (COPY) fs.writeFileSync(`${COPY}/${PREFIX}-part-${k + 1}.md`, body);
  console.log(`part ${k + 1}: ${quotes} quotes, ${p.length} sentences, ${Math.round(body.length / 1024)} KB`);
});
