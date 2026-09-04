"use client";

import * as React from "react";
import { VideoIcon, VideoOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function WebcamTest() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const [active, setActive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<{ label: string; resolution: string } | null>(null);

  const stop = React.useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setActive(false);
    setInfo(null);
  }, []);

  React.useEffect(() => () => stop(), [stop]);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      const track = stream.getVideoTracks()[0];
      const s = track.getSettings();
      setInfo({
        label: track.label || "Camera",
        resolution: s.width && s.height ? `${s.width} × ${s.height}` : "—",
      });
      setActive(true);
    } catch (e) {
      const name = e instanceof DOMException ? e.name : "";
      setError(
        name === "NotAllowedError"
          ? "Camera access was blocked. Allow camera permission in your browser and try again."
          : name === "NotFoundError"
            ? "No camera was found on this device."
            : "Couldn't start the camera. Make sure no other app is using it and try again.",
      );
      setActive(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted/40">
        <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
        {!active && (
          <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <VideoIcon className="size-8" />
              Click “Start camera” to test your webcam.
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {info && (
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="text-muted-foreground">Camera</div>
            <div className="mt-0.5 truncate font-medium">{info.label}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="text-muted-foreground">Resolution</div>
            <div className="mt-0.5 font-medium">{info.resolution}</div>
          </div>
        </div>
      )}

      <div>
        {active ? (
          <Button variant="outline" onClick={stop}>
            <VideoOffIcon /> Stop camera
          </Button>
        ) : (
          <Button onClick={start}>
            <VideoIcon /> Start camera
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Your video stays on your device — it&apos;s shown locally in your browser and never uploaded.
      </p>
    </div>
  );
}
