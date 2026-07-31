// Remove the password from (decrypt) a PDF via Cloudmersive. The current
// password is passed as an HTTP header, so it must be plain ASCII.
export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024;
const asciiOnly = (s: string) => /^[\x20-\x7E]+$/.test(s);

export async function POST(req: Request) {
  const key = process.env.CLOUDMERSIVE_API_KEY?.trim();
  if (!key) return Response.json({ error: "PDF security isn't configured yet." }, { status: 503 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const file = form.get("file");
  const password = String(form.get("password") ?? "");

  if (!(file instanceof File)) return Response.json({ error: "No PDF provided." }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "File too large (max 15 MB)." }, { status: 413 });
  if (!password) return Response.json({ error: "Please enter the PDF's current password." }, { status: 400 });
  if (!asciiOnly(password)) {
    return Response.json({ error: "The password must use standard (ASCII) characters." }, { status: 400 });
  }

  try {
    const upstream = new FormData();
    upstream.append("inputFile", file, file.name || "document.pdf");

    const res = await fetch("https://api.cloudmersive.com/convert/edit/pdf/decrypt", {
      method: "POST",
      headers: { Apikey: key, password },
      body: upstream,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return Response.json(
        { error: `Could not unlock the PDF (${res.status}) — check the password${detail ? `: ${detail.slice(0, 160)}` : ""}` },
        { status: 502 },
      );
    }
    return new Response(await res.arrayBuffer(), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="unlocked.pdf"',
      },
    });
  } catch {
    return Response.json({ error: "PDF service error. Try again." }, { status: 500 });
  }
}
