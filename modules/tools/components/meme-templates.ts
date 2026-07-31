// Meme templates for the Meme Generator's "start from a template" picker.
//
// The built-in ones are generated on a canvas (solid colors / gradients), so
// they ship with no image files and no copyright concerns — great for text
// memes. To add the famous image templates, drop an image into
// public/memes/ and add an entry, e.g.:
//   { id: "drake", name: "Drake", kind: "image", src: "/memes/drake.jpg" }
// (Use images you have the rights to use.)

export type MemeTemplate =
  | { id: string; name: string; kind: "solid"; color: string }
  | { id: string; name: string; kind: "gradient"; from: string; to: string }
  | { id: string; name: string; kind: "image"; src: string };

export const MEME_TEMPLATES: MemeTemplate[] = [
  { id: "white", name: "Blank white", kind: "solid", color: "#ffffff" },
  { id: "black", name: "Blank black", kind: "solid", color: "#111111" },
  { id: "violet", name: "Violet", kind: "gradient", from: "#6d28d9", to: "#a855f7" },
  { id: "sunset", name: "Sunset", kind: "gradient", from: "#f97316", to: "#db2777" },
  { id: "ocean", name: "Ocean", kind: "gradient", from: "#0ea5e9", to: "#6366f1" },
  { id: "forest", name: "Forest", kind: "gradient", from: "#059669", to: "#065f46" },
];
