// Shared ffmpeg.wasm loader for the client-side media tools (video + audio).
// Single-threaded core from a CDN — no SharedArrayBuffer, so NO COOP/COEP
// response headers are needed (those would break the Dropbox / Google Picker /
// Paddle cross-origin scripts). The ~30 MB core is fetched once and cached in
// a module-level promise, so the second tool on a page reuses the same engine.

const CORE_CDN = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";

export type FFmpegInstance = {
  load: (cfg: { coreURL: string; wasmURL: string }) => Promise<unknown>;
  on: (event: string, cb: (e: { progress: number }) => void) => void;
  writeFile: (name: string, data: Uint8Array) => Promise<unknown>;
  readFile: (name: string) => Promise<Uint8Array | string>;
  exec: (args: string[]) => Promise<number>;
};

let ffmpegPromise: Promise<FFmpegInstance> | null = null;
let progressCb: (pct: number) => void = () => {};

/**
 * Load (once) and return the ffmpeg instance. `onProgress` receives 0–100 for
 * the current job; the listener is attached a single time and always calls the
 * latest callback, so repeated calls don't stack listeners.
 */
export async function getFfmpeg(onProgress: (pct: number) => void): Promise<FFmpegInstance> {
  progressCb = onProgress;
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { toBlobURL } = await import("@ffmpeg/util");
      const ff = new FFmpeg() as unknown as FFmpegInstance;
      await ff.load({
        coreURL: await toBlobURL(`${CORE_CDN}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${CORE_CDN}/ffmpeg-core.wasm`, "application/wasm"),
      });
      ff.on("progress", (e) =>
        progressCb(Math.min(100, Math.max(0, Math.round((e.progress || 0) * 100)))),
      );
      return ff;
    })();
  }
  return ffmpegPromise;
}
