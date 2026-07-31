// Client-side PDF encrypt/decrypt using qpdf compiled to WebAssembly. Runs
// entirely in the browser — the PDF is never uploaded — and handles all
// standard PDF encryption (RC4, AES-128/256), so it can unlock real-world
// protected PDFs (unlike server tools that only decrypt what they encrypted).
//
// The Emscripten glue (public/qpdf.js) is a CommonJS/UMD module with a Node
// branch that requires 'fs' — which the client bundler refuses to resolve. So
// we load it from /public at runtime with a tiny CommonJS shim, bypassing the
// bundler entirely (the 'fs' branch never runs in the browser).

type QpdfInstance = {
  callMain: (args: string[]) => number;
  FS: {
    writeFile: (path: string, data: Uint8Array) => void;
    readFile: (path: string) => Uint8Array;
  };
};
type QpdfFactory = (opts: { locateFile: () => string }) => Promise<QpdfInstance>;

let factoryPromise: Promise<QpdfFactory> | null = null;

function loadFactory(): Promise<QpdfFactory> {
  if (!factoryPromise) {
    factoryPromise = (async () => {
      const res = await fetch("/qpdf.js");
      if (!res.ok) throw new Error("Could not load the PDF engine.");
      const code = await res.text();
      const module = { exports: {} as Record<string, unknown> };
      // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
      const fn = new Function("module", "exports", "require", "__dirname", "__filename", code) as (
        m: typeof module,
        e: typeof module.exports,
        r: () => unknown,
        d: string,
        f: string,
      ) => void;
      fn(module, module.exports, () => ({}), "/", "/qpdf.js");
      const exported = module.exports;
      return (exported.default ?? exported) as QpdfFactory;
    })();
  }
  return factoryPromise;
}

// A fresh instance per run — Emscripten's callMain runs a program once.
async function run(file: File, argv: (input: string, output: string) => string[]): Promise<Blob> {
  const createModule = await loadFactory();
  const qpdf = await createModule({ locateFile: () => "/qpdf.wasm" });

  const input = "/input.pdf";
  const output = "/output.pdf";
  qpdf.FS.writeFile(input, new Uint8Array(await file.arrayBuffer()));

  const code = qpdf.callMain(argv(input, output));

  let out: Uint8Array | null = null;
  try {
    out = qpdf.FS.readFile(output);
  } catch {
    out = null;
  }
  // qpdf: 0 = success, 3 = success with warnings; anything else (e.g. 2 = wrong
  // password) is a failure.
  if (!out || out.length === 0 || (code !== 0 && code !== 3)) {
    throw new Error("QPDF_FAILED");
  }
  return new Blob([new Uint8Array(out)], { type: "application/pdf" });
}

/** Remove a password from a PDF (you must know the current password). */
export function decryptPdf(file: File, password: string): Promise<Blob> {
  return run(file, (input, output) => [`--password=${password}`, "--decrypt", input, output]);
}

/** Add a password + AES-256 encryption to a PDF. */
export function encryptPdf(file: File, password: string): Promise<Blob> {
  return run(file, (input, output) => ["--encrypt", password, password, "256", "--", input, output]);
}
