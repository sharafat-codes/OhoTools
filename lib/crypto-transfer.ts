// End-to-end encryption for the Send feature. Runs in the browser (Web Crypto).
// The AES-GCM key never leaves the client — it's carried in the share link's
// URL fragment. The server only ever sees ciphertext + IVs.

const ALGO = "AES-GCM";

// Normalize any byte input to a plain ArrayBuffer, which is always a valid
// BufferSource (avoids the Uint8Array<ArrayBufferLike> vs BufferSource strictness).
function ab(x: ArrayBuffer | Uint8Array): ArrayBuffer {
  if (x instanceof ArrayBuffer) return x;
  return x.buffer.slice(x.byteOffset, x.byteOffset + x.byteLength) as ArrayBuffer;
}

// ── base64url (URL-fragment-safe, no padding) ────────────────────────────────
export function bytesToB64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function b64urlToBytes(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// ── key handling ─────────────────────────────────────────────────────────────
export async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: ALGO, length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
}

export async function exportKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey("raw", key);
  return bytesToB64url(raw);
}

export async function importKey(b64url: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", ab(b64urlToBytes(b64url)), { name: ALGO }, true, [
    "encrypt",
    "decrypt",
  ]);
}

function newIv(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(12));
}

export type EncryptedFile = {
  content: ArrayBuffer; // ciphertext of the file bytes
  contentIv: string; // base64url
  metaCipher: string; // base64url ciphertext of { name, type }
  metaIv: string; // base64url
};

export async function encryptFile(file: File, key: CryptoKey): Promise<EncryptedFile> {
  const contentIvBytes = newIv();
  const content = await crypto.subtle.encrypt(
    { name: ALGO, iv: ab(contentIvBytes) },
    key,
    ab(await file.arrayBuffer()),
  );

  const metaIvBytes = newIv();
  const metaPlain = new TextEncoder().encode(
    JSON.stringify({ name: file.name, type: file.type || "application/octet-stream" }),
  );
  const metaCipherBuf = await crypto.subtle.encrypt(
    { name: ALGO, iv: ab(metaIvBytes) },
    key,
    ab(metaPlain),
  );

  return {
    content,
    contentIv: bytesToB64url(contentIvBytes),
    metaCipher: bytesToB64url(metaCipherBuf),
    metaIv: bytesToB64url(metaIvBytes),
  };
}

export async function decryptMeta(
  key: CryptoKey,
  metaCipher: string,
  metaIv: string,
): Promise<{ name: string; type: string }> {
  const plain = await crypto.subtle.decrypt(
    { name: ALGO, iv: ab(b64urlToBytes(metaIv)) },
    key,
    ab(b64urlToBytes(metaCipher)),
  );
  return JSON.parse(new TextDecoder().decode(plain));
}

export async function decryptContent(
  key: CryptoKey,
  content: ArrayBuffer,
  contentIv: string,
): Promise<ArrayBuffer> {
  return crypto.subtle.decrypt(
    { name: ALGO, iv: ab(b64urlToBytes(contentIv)) },
    key,
    ab(content),
  );
}

// ── Optional password gate ───────────────────────────────────────────────────
// The password never leaves the browser. We derive a verifier with PBKDF2 and
// hand the server only SHA-256(verifier) + salt at creation; at download the
// client re-derives the verifier and the server checks its hash. This gates
// access to the ciphertext without the server ever seeing the password.

export function randomSaltB64url(): string {
  return bytesToB64url(crypto.getRandomValues(new Uint8Array(16)));
}

export async function deriveVerifier(password: string, saltB64url: string): Promise<string> {
  const material = await crypto.subtle.importKey(
    "raw",
    ab(new TextEncoder().encode(password)),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: ab(b64urlToBytes(saltB64url)), iterations: 100_000, hash: "SHA-256" },
    material,
    256,
  );
  return bytesToB64url(bits);
}

export async function sha256B64url(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", ab(new TextEncoder().encode(input)));
  return bytesToB64url(digest);
}
