import { z } from "zod";

import { BARCODE_FORMAT_VALUES } from "@/modules/barcode/constants";

export const barcodeInputSchema = z.object({
  name: z.string().trim().max(100).optional(),
  data: z
    .string()
    .trim()
    .min(1, { error: "Enter the value to encode." })
    .max(2000, { error: "That content is too long (2000 characters max)." }),
  format: z.enum(BARCODE_FORMAT_VALUES as [string, ...string[]]).default("code128"),
  scale: z.number().int().min(1).max(8).default(3),
  height: z.number().int().min(10).max(120).default(60),
  includeText: z.boolean().default(true),
});

export type BarcodeInput = z.infer<typeof barcodeInputSchema>;
