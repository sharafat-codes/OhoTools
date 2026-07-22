import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-decode-a-jwt",
  title: "How to Decode a JWT (JSON Web Token) — Safely",
  description:
    "Understand what's inside a JSON Web Token, how to decode its header and payload, and why decoding is not the same as verifying.",
  keywords: [
    "how to decode jwt",
    "jwt decoder",
    "json web token explained",
    "read jwt payload",
    "decode json web token",
  ],
  date: "2026-07-22",
  readingMinutes: 4,
  tags: ["Developer", "Security"],
  related: ["jwt-decoder", "base64", "hash-generator"],
};

export function Body() {
  return (
    <>
      <p>
        A JSON Web Token (JWT) is a compact, URL-safe token used for authentication and passing
        claims between systems. If you&apos;ve ever needed to see what&apos;s <em>inside</em> one —
        who it&apos;s for, when it expires — this guide shows you how, and what to watch out for.
      </p>

      <h2>The three parts of a JWT</h2>
      <p>
        A JWT is three Base64url-encoded sections separated by dots:{" "}
        <code>header.payload.signature</code>.
      </p>
      <ul>
        <li><strong>Header</strong> — the token type and signing algorithm (e.g. HS256).</li>
        <li><strong>Payload</strong> — the claims: subject (<code>sub</code>), issued-at (<code>iat</code>), expiry (<code>exp</code>), and any custom data.</li>
        <li><strong>Signature</strong> — proves the token wasn&apos;t tampered with, created using a secret or private key.</li>
      </ul>

      <h2>Decode it</h2>
      <p>
        Paste a token into our <Link href="/tools/jwt-decoder">JWT decoder</Link> to instantly see the
        header and payload, with the <code>iat</code> and <code>exp</code> timestamps shown in
        human-readable form. Decoding happens entirely in your browser, so it&apos;s safe even for
        sensitive tokens.
      </p>
      <p>
        Under the hood, the header and payload are just{" "}
        <Link href="/tools/base64">Base64url</Link> — the decoder simply decodes those two sections
        and pretty-prints the JSON.
      </p>

      <h2>Decoding is not verifying</h2>
      <p>
        This is the crucial part: <strong>anyone can decode a JWT</strong> — the payload is not
        encrypted, only encoded. Decoding tells you what the token <em>claims</em>, but not whether
        it&apos;s genuine.
      </p>
      <p>
        <strong>Verifying</strong> is different: it checks the signature against the secret or public
        key to confirm the token is authentic and unaltered, and that it hasn&apos;t expired.
        Verification must happen on the server — never trust a token&apos;s contents based on decoding
        alone.
      </p>

      <h2>Security tips</h2>
      <ul>
        <li>Never put secrets or sensitive personal data in the payload — it&apos;s readable by anyone.</li>
        <li>Always check the <code>exp</code> claim and reject expired tokens.</li>
        <li>Verify the signature on the server with the correct algorithm; don&apos;t accept <code>alg: none</code>.</li>
        <li>Signatures rely on cryptographic <Link href="/tools/hash-generator">hashing</Link> — keep your signing secret truly secret.</li>
      </ul>

      <h2>FAQ</h2>
      <h3>Is the payload encrypted?</h3>
      <p>No — it&apos;s Base64url-encoded and fully readable. Treat everything in it as public.</p>
      <h3>Can I edit a JWT?</h3>
      <p>
        You can change the payload, but without the signing secret you can&apos;t produce a valid
        signature, so a server that verifies properly will reject it.
      </p>
    </>
  );
}
