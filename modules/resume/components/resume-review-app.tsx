"use client";

import * as React from "react";
import Link from "next/link";
import { SparklesIcon, Loader2Icon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RESUME_MAX, JOB_MAX, type ResumeReport } from "@/modules/resume/config";
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
        <div className="flex items-center justify-between">
          <Label htmlFor="resume">Your resume</Label>
          <span className="text-xs text-muted-foreground tabular-nums">
            {resume.length.toLocaleString()}/{RESUME_MAX.toLocaleString()}
          </span>
        </div>
        <Textarea
          id="resume"
          value={resume}
          onChange={(e) => setResume(e.target.value.slice(0, RESUME_MAX))}
          rows={10}
          placeholder="Paste your resume text here.  Tip: open your resume (PDF/Word), select all (Ctrl/⌘+A), copy, and paste."
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
