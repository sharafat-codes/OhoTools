// Constants shared by the Send feature's server and browser code.
// (Kept out of transfer-storage.ts so client components can import them without
// pulling in the server-only Supabase admin client.)

export const TRANSFER_BUCKET = "transfers";
// 50 MB matches Supabase's free-tier global upload limit. Raising this requires
// bumping the Supabase project's global file-size limit (paid plan).
export const FREE_MAX_BYTES = 50 * 1024 * 1024;
export const MAX_EXPIRY_HOURS = 24;

export const EXPIRY_OPTIONS = [
  { label: "1 hour", hours: 1 },
  { label: "6 hours", hours: 6 },
  { label: "12 hours", hours: 12 },
  { label: "24 hours", hours: 24 },
];
