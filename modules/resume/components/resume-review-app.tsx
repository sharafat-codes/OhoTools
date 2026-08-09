"use client";

import * as React from "react";
import Link from "next/link";
import { SparklesIcon, Loader2Icon, RotateCcwIcon, UploadIcon, FileCheck2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RESUME_MAX, JOB_MAX, type ResumeReport } from "@/modules/resume/config";
import { extractResumeText } from "@/modules/resume/extract";
import { ResumeReviewReport } from "@/modules/resume/components/resume-report";

async function post(payload: unknown) {
  const res = await fetch("/api/resume", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(new Error(data.error || "Request failed"), {
      status: res.status,
      error: data.error as string | undefined,
      limitReached: Boolean(data.limitReached),
    });
  }
  return data;
}

export function ResumeReviewApp({ loggedIn, pro }: { loggedIn: boolean; pro: boolean }) {
  const [resume, setResume] = React.useState("");
  const [targetJob, setTargetJob] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [report, setReport] = React.useState<ResumeReport | null>(null);
  const [reportPro, setReportPro] = React.useState(pro);
  const [error, setError] = React.useState("");
  const [limitReached, setLimitReached] = React.useState(false);
  const [extracting, setExtracting] = React.useState(false);
  const [fileName, setFileName] = React.useState("");
  const [dragging, setDragging] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setExtracting(true);
    setError("");
    setFileName("");
    try {
      const text = await extractResumeText(file);
      if (!text || text.trim().length < 30) {
        setError("Couldn't read text from that file (it may be a scanned image). Paste your resume text instead.");
        return;
      }
      setResume(text.slice(0, RESUME_MAX));
      setFileName(file.name);
    } catch {
      setError("Couldn't read that file. Try a PDF, DOCX, or TXT — or paste the text.");
    } finally {
      setExtracting(false);
    }
  }

  async function run() {
    if (resume.trim().length < 60 || busy) return;
    setBusy(true);
    setError("");
    setLimitReached(false);
    try {
      const data = await post({ resume, targetJob: targetJob.trim() || undefined });
      setReport(data.report);
      setReportPro(Boolean(data.pro));
    } catch (e) {
      const err = e as { error?: string; message?: string; limitReached?: boolean };
      setError(err.error || err.message || "Something went wrong. Please try again.");
      if (err.limitReached) setLimitReached(true);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setReport(null);
    setError("");
    setLimitReached(false);
  }

  if (report) {
    return (
      <div className="flex flex-col gap-5">
        <ResumeReviewReport report={report} pro={reportPro} />
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={reset}>
            <RotateCcwIcon />
            Review another
          </Button>
          {!reportPro && (
            <Button render={<Link href="/pricing" />}>
              <SparklesIcon />
              Go Pro for rewrites &amp; unlimited
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Your resume</Label>

        {/* Upload dropzone */}
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.docx,.txt,.md,application/pdf,text/plain"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            onFile(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "flex w-full flex-col items-center gap-1.5 rounded-xl border border-dashed px-4 py-6 text-center transition-colors",
            dragging ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40",
          )}
        >
          {extracting ? (
            <Loader2Icon className="size-5 animate-spin text-primary" />
          ) : fileName ? (
            <FileCheck2Icon className="size-5 text-emerald-600 dark:text-emerald-500" />
          ) : (
            <UploadIcon className="size-5 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">
            {extracting ? "Reading your resume…" : fileName ? `Loaded ${fileName}` : "Upload resume — PDF, DOCX or TXT"}
          </span>
          <span className="text-xs text-muted-foreground">
            {fileName ? "Edit the text below if anything looks off, or upload another." : "Drag & drop or click — read in your browser, never uploaded to us."}
          </span>
        </button>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">…or paste the text below</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {resume.length.toLocaleString()}/{RESUME_MAX.toLocaleString()}
          </span>
        </div>
        <Textarea
          id="resume"
          value={resume}
          onChange={(e) => setResume(e.target.value.slice(0, RESUME_MAX))}
          rows={9}
          placeholder="Paste your resume text here."
          className="resize-y"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="job">
          Target job description <span className="text-muted-foreground">(optional — enables a match score + missing keywords)</span>
        </Label>
        <Textarea
          id="job"
          value={targetJob}
          onChange={(e) => setTargetJob(e.target.value.slice(0, JOB_MAX))}
          rows={4}
          placeholder="Paste the job description you're applying for…"
          className="resize-y"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {limitReached && !pro && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
          <p className="font-medium">You&rsquo;ve used today&rsquo;s free AI runs.</p>
          <p className="mt-1 text-muted-foreground">Upgrade to Pro for unlimited resume reviews, bullet rewrites, and all AI tools.</p>
          <Button render={<Link href="/pricing" />} className="mt-3" size="sm">
            <SparklesIcon />
            Upgrade to Pro
          </Button>
        </div>
      )}

      {loggedIn ? (
        <Button size="lg" onClick={run} disabled={busy || resume.trim().length < 60}>
          {busy ? <Loader2Icon className="animate-spin" /> : <SparklesIcon />}
          {busy ? "Reviewing…" : "Review my resume"}
        </Button>
      ) : (
        <Button render={<Link href="/login?next=/resume-review" />} size="lg">
          Sign in to review your resume
        </Button>
      )}
      <p className="text-center text-xs text-muted-foreground">
        Your resume is sent securely for AI analysis and not stored. {pro ? "Pro: unlimited." : "Free daily runs; Pro unlocks bullet rewrites & unlimited use."}
      </p>
    </div>
  );
}
