// Shared config/types for the AI Resume Reviewer. No server-only imports — used
// by both the client UI and the API route. Self-contained so the module can be
// lifted out later (career-prep suite alongside the interview module).

export const RESUME_MAX = 15000;
export const JOB_MAX = 6000;

export type ResumeIssue = { severity: "high" | "medium" | "low"; issue: string; fix: string };
export type ResumeSection = { name: string; score: number; feedback: string }; // score 1–5
export type ResumeRewrite = { original: string; improved: string };

export type ResumeReport = {
  overallScore: number; // 0–100
  verdict: string; // short phrase
  atsScore: number; // 0–100, ATS-friendliness
  matchScore: number | null; // 0–100 vs target job, null if none provided
  missingKeywords: string[]; // keywords in the job but missing from the resume
  strengths: string[];
  issues: ResumeIssue[];
  sections: ResumeSection[]; // Summary, Experience, Skills, Education, Formatting…
  rewrites: ResumeRewrite[]; // suggested bullet rewrites (Pro)
  topActions: string[]; // top fixes
};
