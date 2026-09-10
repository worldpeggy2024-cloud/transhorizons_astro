/*
 * CDP screencast recorder.
 *
 * Playwright's built-in video is VP8 at an unguaranteed frame rate; this asks
 * Chromium for every compositor frame (Page.startScreencast) and writes each
 * one to disk with its timestamp. Frames only arrive when something repaints,
 * so a still page produces none — the assembler holds the last frame. Every
 * shot also opens with an explicit screenshot, so each shot has a frame at
 * t = 0 regardless of whether anything changed.
 */
import fs from 'node:fs';
import path from 'node:path';

export class Recorder {
  constructor({ outDir, format = 'png', quality = 92, maxWidth = 1920, maxHeight = 1080, log = () => {} }) {
    this.outDir = outDir;
    this.format = format;
    this.quality = quality;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.log = log;
    this.sessions = new Map();   // page -> cdp session
    this.shot = null;            // { id, dir, t0, frames: [], seq }
    this.pending = new Set();
    this.frameCount = 0;
    // Only the FOCUSED page's frames are stored: when a popup or a second
    // context is up, the page behind it keeps repainting and would interleave.
    this.focused = null;
    this.focusStack = [];
  }

  /**
   * Attach to a page. `screencast: false` records nothing automatically — the
   * action takes explicit snapshots instead (needed where the screencast's
   * CSS-pixel frames are the wrong size, e.g. a deviceScaleFactor-2 context).
   * `focus: true` makes it the recorded page until detach.
   */
  async attach(page, { screencast = true, focus = true } = {}) {
    if (!this.sessions.has(page)) {
      const cdp = await page.context().newCDPSession(page);
      this.sessions.set(page, cdp);
      if (screencast) {
        cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
          // Ack first so Chromium keeps sending; write asynchronously.
          cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
          if (!this.shot || this.focused !== page) return;
          const epochMs = metadata.timestamp * 1000;
          this._store(Buffer.from(data, 'base64'), epochMs, 'cast');
        });
        await cdp.send('Page.startScreencast', {
          format: this.format, quality: this.quality,
          maxWidth: this.maxWidth, maxHeight: this.maxHeight, everyNthFrame: 1,
        });
      }
      page.once('close', () => { this.sessions.delete(page); this._unfocus(page); });
    }
    if (focus) { this.focusStack.push(this.focused); this.focused = page; }
  }

  _unfocus(page) {
    if (this.focused === page) this.focused = this.focusStack.pop() ?? null;
  }

  async detach(page) {
    this._unfocus(page);
    const cdp = this.sessions.get(page);
    if (!cdp) return;
    try { await cdp.send('Page.stopScreencast'); } catch { /* page gone */ }
    try { await cdp.detach(); } catch { /* already detached */ }
    this.sessions.delete(page);
  }

  _store(buf, epochMs, kind) {
    const shot = this.shot;
    const seq = ++shot.seq;
    const ext = this.format === 'jpeg' ? 'jpg' : 'png';
    const file = `f_${String(seq).padStart(5, '0')}.${ext}`;
    const tMs = Math.max(0, Math.round(epochMs - shot.t0));
    shot.frames.push({ file, tMs, kind });
    this.frameCount++;
    const p = fs.promises.writeFile(path.join(shot.dir, file), buf)
      .catch((e) => this.log(`frame write failed: ${e.message}`))
      .finally(() => this.pending.delete(p));
    this.pending.add(p);
  }

  /** Open a shot: frames go to <outDir>/<id>/ with times relative to t0. */
  async beginShot(id, page, t0 = Date.now()) {
    const dir = path.join(this.outDir, id);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    this.shot = { id, dir, t0, frames: [], seq: 0 };
    await this.snapshot(page);
  }

  /** Explicit full-viewport screenshot appended as a frame (kind 'shot').
   *  Playwright's screenshot scales to DEVICE pixels, so a deviceScaleFactor-2
   *  context yields 1920x1080 here where the screencast gives 960x540. */
  async snapshot(page) {
    const p = page || this.focused;
    if (!p || !this.shot) return;
    const before = Date.now();
    try {
      const buf = await p.screenshot({
        type: this.format === 'jpeg' ? 'jpeg' : 'png',
        quality: this.format === 'jpeg' ? this.quality : undefined,
        scale: 'device', caret: 'hide', animations: 'allow', timeout: 10000,
      });
      this._store(buf, before, 'shot');
    } catch (e) {
      this.log(`snapshot failed: ${e.message}`);
    }
  }

  /** Close the shot; returns its frame list (sorted by time). */
  async endShot() {
    const shot = this.shot;
    this.shot = null;
    await Promise.all([...this.pending]);
    shot.frames.sort((a, b) => a.tMs - b.tMs || a.file.localeCompare(b.file));
    return shot.frames;
  }
}
