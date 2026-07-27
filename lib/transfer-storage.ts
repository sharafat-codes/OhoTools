import "server-only";

import { createClient } from "@supabase/supabase-js";

import { TRANSFER_BUCKET } from "@/lib/transfer-shared";

// Object storage for the Send feature (Supabase Storage — same vendor as the DB).
// The server only ever handles ciphertext. Uploads/downloads go directly between
// the browser and Supabase via short-lived signed URLs, so large files never
// pass through our (size-limited) serverless functions.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

export function isTransferConfigured(): boolean {
  return Boolean(url && serviceKey);
}

function admin() {
  if (!url || !serviceKey) {
    throw new Error("Supabase storage is not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

/** A signed upload token the browser uses with `uploadToSignedUrl` (bypasses serverless limits). */
export async function createUploadUrl(path: string): Promise<{ signedUrl: string; token: string; path: string }> {
  const { data, error } = await admin().storage.from(TRANSFER_BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw error ?? new Error("Could not create an upload URL.");
  return data;
}

/** Short-lived signed URL the browser GETs ciphertext from. */
export async function createDownloadUrl(path: string, expiresInSeconds = 3600): Promise<string> {
  const { data, error } = await admin().storage.from(TRANSFER_BUCKET).createSignedUrl(path, expiresInSeconds);
  if (error || !data) throw error ?? new Error("Could not create a download URL.");
  return data.signedUrl;
}

/** Best-effort delete (used on expiry purge and failed uploads). */
export async function removeObjects(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  try {
    await admin().storage.from(TRANSFER_BUCKET).remove(paths);
  } catch {
    /* best effort */
  }
}
