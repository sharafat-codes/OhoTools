import { z } from "zod";

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, { error: "Use a 6-digit hex color." });

export const createLinkSchema = z.object({
  name: z.string().trim().max(100).optional(),
  targetUrl: z
    .url({ error: "Enter a valid URL, including https://" })
    .max(2000),
  fgColor: hexColor.default("#000000"),
  bgColor: hexColor.default("#ffffff"),
});

export const updateLinkSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().max(100).optional(),
  targetUrl: z.url({ error: "Enter a valid URL, including https://" }).max(2000),
  active: z.boolean(),
  expiresAt: z.string().nullish(), // ISO string or null/undefined
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
