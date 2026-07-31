// Password-protect (encrypt) a PDF via Cloudmersive. Passwords are passed as
// HTTP headers per Cloudmersive's API, so they must be plain ASCII.
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
  const userPassword = String(form.get("userPassword") ?? "");
  const ownerPassword = String(form.get("ownerPassword") ?? "");

  if (!(file instanceof File)) return Response.json({ error: "No PDF provided." }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "File too large (max 15 MB)." }, { status: 413 });
  if (!userPassword) return Response.json({ error: "Please enter a password." }, { status: 400 });
  if (!asciiOnly(userPassword) || (ownerPassword && !asciiOnly(ownerPassword))) {
    return Response.json({ error: "Passwords must use standard (ASCII) characters." }, { status: 400 });
  }

  try {
    const upstream = new FormData();
    upstream.append("inputFile", file, file.name || "document.pdf");
    const headers: Record<string, string> = { Apikey: key, userPassword };
    if (ownerPassword) headers.ownerPassword = ownerPassword;

    const res = await fetch("https://api.cloudmersive.com/convert/edit/pdf/encrypt", {
      method: "POST",
      headers,
      body: upstream,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return Response.json(
        { error: `Could not protect the PDF (${res.status})${detail ? `: ${detail.slice(0, 200)}` : ""}` },
        { status: 502 },
      );
    }
    return new Response(await res.arrayBuffer(), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="protected.pdf"',
      },
    });
  } catch {
    return Response.json({ error: "PDF service error. Try again." }, { status: 500 });
  }
}
