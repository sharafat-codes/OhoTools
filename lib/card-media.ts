import "server-only";

import { createClient } from "@supabase/supabase-js";

import { CARD_MEDIA_BUCKET } from "@/lib/card-media-shared";

// Public object storage for invitation-website media (gallery photos, a
// custom MP3). Same Supabase project as the database and the Send feature,
// but a separate, PUBLIC bucket: these files are meant to be seen by every
// guest who opens the link, so there is nothing to sign on the way out.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

export function isCardMediaConfigured(): boolean {
  return Boolean(url && serviceKey);
}

function admin() {
  if (!url || !serviceKey) {
    throw new Error("Supabase storage is not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

let bucketReady: Promise<void> | null = null;

/**
 * Creates the bucket the first time it is needed, so there is no manual step
 * in the Supabase dashboard to forget on a new project. Safe to call on every
 * request: the work happens once per process and "already exists" is fine.
 */
export function ensureBucket(): Promise<void> {
  if (!bucketReady) {
    bucketReady = (async () => {
      const { error } = await admin().storage.createBucket(CARD_MEDIA_BUCKET, { public: true });
      if (error && !/already exists|duplicate/i.test(error.message)) {
        bucketReady = null; // let the next request retry rather than cache a failure
        throw error;
      }
    })();
  }
  return bucketReady;
}

/** A signed upload token the browser uses with `uploadToSignedUrl`. */
export async function createMediaUploadUrl(path: string): Promise<{ token: string; path: string }> {
  await ensureBucket();
  const { data, error } = await admin().storage.from(CARD_MEDIA_BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw error ?? new Error("Could not create an upload URL.");
  return { token: data.token, path: data.path };
}

/** The permanent public URL of an object in the bucket. */
export function mediaPublicUrl(path: string): string {
  return admin().storage.from(CARD_MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Best-effort delete, for a failed upload or a removed photo. */
export async function removeMedia(paths: string[]): Promise<void> {
  if (!paths.length) return;
  try {
    await admin().storage.from(CARD_MEDIA_BUCKET).remove(paths);
  } catch {
    /* best effort */
  }
}
