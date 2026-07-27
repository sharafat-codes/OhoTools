// Google Drive import via the Google Picker. Uses Google Identity Services for a
// short-lived access token (scope drive.file — access is granted only to files
// the user actually picks, so no sensitive-scope verification is needed), then
// downloads the picked file(s) with that token. All client-side.

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const SCOPE = "https://www.googleapis.com/auth/drive.file";

export function isGoogleDriveConfigured(): boolean {
  return Boolean(GOOGLE_API_KEY && GOOGLE_CLIENT_ID);
}

// ── Minimal typings for the untyped Google globals we touch ───────────────────
type TokenResponse = { access_token?: string; error?: string };
type TokenClient = { requestAccessToken: () => void };

interface DocsViewInstance {
  setMimeTypes(mimeTypes: string): DocsViewInstance;
  setIncludeFolders(v: boolean): DocsViewInstance;
  setSelectFolderEnabled(v: boolean): DocsViewInstance;
}
interface PickerBuilderInstance {
  setDeveloperKey(key: string): PickerBuilderInstance;
  setOAuthToken(token: string): PickerBuilderInstance;
  setAppId(appId: string): PickerBuilderInstance;
  addView(view: DocsViewInstance): PickerBuilderInstance;
  setTitle(title: string): PickerBuilderInstance;
  enableFeature(feature: unknown): PickerBuilderInstance;
  setCallback(cb: (data: Record<string, unknown>) => void): PickerBuilderInstance;
  build(): { setVisible(v: boolean): void };
}
interface PickerNS {
  PickerBuilder: new () => PickerBuilderInstance;
  DocsView: new (viewId?: unknown) => DocsViewInstance;
  ViewId: { DOCS: unknown; DOCS_IMAGES: unknown; PDFS: unknown };
  Feature: { MULTISELECT_ENABLED: unknown };
  Action: { PICKED: string; CANCEL: string };
  Response: { ACTION: string; DOCUMENTS: string };
  Document: { ID: string; NAME: string; MIME_TYPE: string };
}
interface GoogleGlobal {
  accounts: {
    oauth2: {
      initTokenClient(cfg: {
        client_id: string;
        scope: string;
        callback: (r: TokenResponse) => void;
        error_callback?: (err: { type?: string; message?: string }) => void;
      }): TokenClient;
    };
  };
  picker: PickerNS;
}
declare global {
  interface Window {
    gapi?: { load: (name: string, cb: () => void) => void };
    google?: GoogleGlobal;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

let readyPromise: Promise<void> | null = null;
function ensureReady(): Promise<void> {
  if (!readyPromise) {
    readyPromise = (async () => {
      await Promise.all([
        loadScript("https://accounts.google.com/gsi/client"),
        loadScript("https://apis.google.com/js/api.js"),
      ]);
      await new Promise<void>((resolve) => window.gapi!.load("picker", () => resolve()));
    })();
  }
  return readyPromise;
}

/** Warm up the Google scripts on mount so the sign-in popup opens cleanly on
 * click (a popup opened after a fresh network load can be blocked). */
export function preloadGoogleDrive(): void {
  if (isGoogleDriveConfigured()) ensureReady().catch(() => {});
}

function getToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID!,
      scope: SCOPE,
      callback: (r) =>
        r.access_token
          ? resolve(r.access_token)
          : reject(new Error(r.error ? `Google auth error: ${r.error}` : "No access token returned")),
      error_callback: (err) =>
        reject(new Error(err?.type ? `Google sign-in ${err.type}` : "Google sign-in failed")),
    });
    client.requestAccessToken();
  });
}

function chooseView(accept: string | undefined): DocsViewInstance {
  const picker = window.google!.picker;
  const a = accept ?? "";
  let view: DocsViewInstance;
  if (a.includes("pdf")) view = new picker.DocsView(picker.ViewId.PDFS);
  else if (a.startsWith("image")) view = new picker.DocsView(picker.ViewId.DOCS_IMAGES);
  else view = new picker.DocsView(picker.ViewId.DOCS);
  view.setIncludeFolders(false).setSelectFolderEnabled(false);
  return view;
}

function pick(
  token: string,
  accept: string | undefined,
  multiple: boolean,
): Promise<Array<{ id: string; name: string }>> {
  return new Promise((resolve) => {
    const picker = window.google!.picker;
    // The Cloud project number is the leading segment of the OAuth client ID.
    // Passing it as the app id is what lets the drive.file scope read files the
    // user picks here (otherwise the download 404s).
    const appId = (GOOGLE_CLIENT_ID ?? "").split("-")[0];
    let builder = new picker.PickerBuilder()
      .setDeveloperKey(GOOGLE_API_KEY!)
      .setOAuthToken(token)
      .setAppId(appId)
      .addView(chooseView(accept))
      .setCallback((data) => {
        const action = data[picker.Response.ACTION];
        if (action === picker.Action.PICKED) {
          const docs = (data[picker.Response.DOCUMENTS] as Array<Record<string, unknown>>) ?? [];
          resolve(
            docs.map((d) => ({
              id: String(d[picker.Document.ID]),
              name: String(d[picker.Document.NAME] ?? "download"),
            })),
          );
        } else if (action === picker.Action.CANCEL) {
          resolve([]);
        }
      });
    if (multiple) builder = builder.enableFeature(picker.Feature.MULTISELECT_ENABLED);
    builder.build().setVisible(true);
  });
}

async function download(id: string, name: string, token: string): Promise<File> {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${id}?alt=media&supportsAllDrives=true`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Drive download failed (${res.status})${detail ? `: ${detail.slice(0, 150)}` : ""}`);
  }
  const blob = await res.blob();
  return new File([blob], name, { type: blob.type || "application/octet-stream" });
}

/** Open the Google Picker and return the chosen file(s) as File objects. */
export async function importFromGoogleDrive(opts: {
  accept?: string;
  multiple?: boolean;
}): Promise<File[]> {
  if (!isGoogleDriveConfigured()) return [];
  await ensureReady();
  const token = await getToken();
  const docs = await pick(token, opts.accept, Boolean(opts.multiple));
  if (!docs.length) return [];
  return Promise.all(docs.map((d) => download(d.id, d.name, token)));
}
