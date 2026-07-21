import { z } from "zod";

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, { error: "Use a 6-digit hex color, e.g. #000000." });

export const qrInputSchema = z.object({
  name: z.string().trim().max(100).optional(),
  data: z
    .string()
    .trim()
    .min(1, { error: "Enter a URL or some text to encode." })
    .max(2000, { error: "That content is too long (2000 characters max)." }),
  fgColor: hexColor.default("#000000"),
  bgColor: hexColor.default("#ffffff"),
  size: z.number().int().min(128).max(1024).default(512),
  margin: z.number().int().min(0).max(10).default(2),
  ecLevel: z.enum(["L", "M", "Q", "H"]).default("M"),

  // Pro styling
  moduleStyle: z.enum(["square", "rounded", "dots"]).default("square"),
  gradient: z.boolean().default(false),
  fgColor2: hexColor.nullish(),
  // base64 data URL; capped to keep DB rows reasonable (~375KB image)
  logo: z.string().max(500_000).nullish(),
});

export type QRInput = z.infer<typeof qrInputSchema>;
export type QRErrorLevel = QRInput["ecLevel"];
export type QRModuleStyle = QRInput["moduleStyle"];
