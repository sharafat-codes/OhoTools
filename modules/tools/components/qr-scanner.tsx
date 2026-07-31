"use client";

import * as React from "react";
import { toast } from "sonner";
import { CameraIcon, CopyIcon, ExternalLinkIcon, XIcon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";
import { ResultCard } from "@/modules/tools/components/tool-result";
import { Button } from "@/components/ui/button";

async function scan(data: ImageData): Promise<string | null> {
  const jsQR = (await import("jsqr")).default;
  return jsQR(data.data, data.width, data.height)?.data ?? null;
}

function isUrl(s: string) {
  return /^https?:\/\//i.test(s.trim());
}

export function QrScanner() {
  const [result, setResult] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [cameraOn, setCameraOn] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const stopCamera = React.useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }, []);

  // Stop tracks if the component unmounts mid-scan.
  React.useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  // Live camera scan loop — runs while the camera is on.
  React.useEffect(() => {
    if (!cameraOn) return;
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) return;
    video.srcObject = stream;
    let raf = 0;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const tick = async () => {
      if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const text = await scan(ctx.getImageData(0, 0, canvas.width, canvas.height));
        if (text) {
          setResult(text);
          setError(null);
          stopCamera();
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    video.play().then(
      () => {
        raf = requestAnimationFrame(tick);
      },
      () => setError("Could not start the camera preview."),
    );
    return () => cancelAnimationFrame(raf);
  }, [cameraOn, stopCamera]);

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const text = await scan(ctx.getImageData(0, 0, canvas.width, canvas.height));
        if (text) {
          setResult(text);
          setError(null);
        } else {
          setResult(null);
          setError("No QR code found in that image. Try a clearer, closer photo.");
        }
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setError("Could not read that image.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  async function startCamera() {
    setError(null);
    setResult(null);
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setCameraOn(true);
    } catch {
      setError("Could not access the camera. Check permissions, or upload an image instead.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {!cameraOn && (
        <>
          <Dropzone
            accept="image/*"
            onFile={onFile}
            title="Drag & drop a QR code image, or click to browse"
            hint="Or scan live with your camera — decoded in your browser."
          />
          <div className="flex justify-center">
            <Button variant="outline" onClick={startCamera}>
              <CameraIcon />
              Scan with camera
            </Button>
          </div>
        </>
      )}

      <div className={cameraOn ? "flex flex-col gap-3" : "hidden"}>
        <video
          ref={videoRef}
          playsInline
          muted
          className="mx-auto max-h-80 w-full rounded-lg border border-border bg-black object-contain"
        />
        <div className="flex justify-center">
          <Button variant="outline" onClick={stopCamera}>
            <XIcon />
            Stop camera
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground">Point your camera at a QR code…</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <ResultCard title="Decoded content">
          <p className="rounded-lg border border-border bg-muted/30 p-3 font-mono text-sm break-all">{result}</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard?.writeText(result).then(() => toast.success("Copied"), () => toast.error("Could not copy."))}
            >
              <CopyIcon className="size-3.5" />
              Copy
            </Button>
            {isUrl(result) && (
              <Button size="sm" render={<a href={result} target="_blank" rel="noopener noreferrer" />}>
                <ExternalLinkIcon className="size-3.5" />
                Open link
              </Button>
            )}
          </div>
        </ResultCard>
      )}
    </div>
  );
}
