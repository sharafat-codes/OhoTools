import type { Metadata } from "next";

import { ReceiveFile } from "@/modules/transfer/components/receive-file";

// Ephemeral, private share links — never index them.
export const metadata: Metadata = {
  title: "Download a shared file",
  robots: { index: false, follow: false },
};

export default async function ReceivePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Someone sent you a file
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          It&apos;s decrypted right here in your browser.
        </p>
      </div>
      <ReceiveFile id={id} />
    </div>
  );
}
