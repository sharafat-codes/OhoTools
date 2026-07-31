// Runs @imgly/background-removal inside a dedicated Web Worker so the heavy ML
// inference never touches the page's main thread.
//
// Why a worker of our own: the library only honors its `proxyToWorker` option
// when it runs on WebGPU (`device: "gpu"`). On the default CPU/wasm path — the
// common case — it forces `proxyToWorker` off and runs inference on whatever
// thread called it, freezing the tab ("Page Unresponsive"). Running the whole
// call inside this worker makes that irrelevant: the page stays responsive no
// matter which backend the library ends up using.
//
// @imgly is worker-safe: it uses OffscreenCanvas (available in workers) and
// only falls back to `document.createElement` when OffscreenCanvas is missing.
import { removeBackground } from "@imgly/background-removal";

type WorkerCtx = {
  postMessage: (message: unknown) => void;
  onmessage: ((e: MessageEvent) => void) | null;
};

const ctx = self as unknown as WorkerCtx;

ctx.onmessage = async (e: MessageEvent) => {
  const file = (e.data as { file: File }).file;
  try {
    const blob = await removeBackground(file, {
      // Smaller quantized model → faster download + inference.
      model: "isnet_quint8",
      progress: (key: string, current: number, total: number) => {
        ctx.postMessage({ type: "progress", key, current, total });
      },
      output: { format: "image/png" },
    });
    ctx.postMessage({ type: "done", blob });
  } catch (err) {
    ctx.postMessage({ type: "error", message: String(err) });
  }
};
