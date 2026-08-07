// Shared config for the AI Mock Interview module. No server-only imports — used
// by both the client UI and the API route. Kept self-contained so the whole
// `interview` module can be lifted into its own app later with minimal rework.

export type RoleId = "frontend" | "backend" | "fullstack" | "data" | "devops" | "mobile";
export type LevelId = "junior" | "mid" | "senior";
export type TypeId = "technical" | "behavioral" | "mixed";

export const ROLES: { id: RoleId; label: string; focus: string }[] = [
  { id: "frontend", label: "Frontend", focus: "HTML/CSS, JavaScript/TypeScript, React, browser & performance, accessibility, UI state" },
  { id: "backend", label: "Backend", focus: "APIs, databases & SQL, caching, concurrency, auth, scalability, testing" },
  { id: "fullstack", label: "Full-Stack", focus: "frontend and backend, end-to-end features, data flow, deployment" },
  { id: "data", label: "Data / ML", focus: "SQL, data modeling, Python/pandas, statistics, ML fundamentals, pipelines" },
  { id: "devops", label: "DevOps / SRE", focus: "CI/CD, containers & Kubernetes, cloud, observability, incidents, IaC" },
  { id: "mobile", label: "Mobile", focus: "iOS/Android or React Native/Flutter, app lifecycle, performance, offline, releases" },
];

export const LEVELS: { id: LevelId; label: string }[] = [
  { id: "junior", label: "Junior" },
  { id: "mid", label: "Mid-level" },
  { id: "senior", label: "Senior" },
];

export const TYPES: { id: TypeId; label: string; blurb: string }[] = [
  { id: "technical", label: "Technical Q&A", blurb: "Concepts & problem-solving" },
  { id: "behavioral", label: "Behavioral", blurb: "STAR stories & soft skills" },
  { id: "mixed", label: "Mixed", blurb: "A realistic blend of both" },
];

export type InterviewConfig = {
  role: RoleId;
  level: LevelId;
  type: TypeId;
  jd?: string; // Pro — job description to tailor to
  resume?: string; // Pro — candidate background to tailor to
};

// Plan caps. Free = a single short mock per day; Pro = longer mocks, several
// per day, plus JD/resume tailoring. Kept modest to bound AI cost.
export const PLAN_CAPS = {
  free: { questions: 5, sessionsPerDay: 1, tailoring: false },
  pro: { questions: 10, sessionsPerDay: 15, tailoring: true },
} as const;

export function capsFor(pro: boolean) {
  return pro ? PLAN_CAPS.pro : PLAN_CAPS.free;
}

export function labelFor(config: InterviewConfig): string {
  const role = ROLES.find((r) => r.id === config.role)?.label ?? "Software";
  const level = LEVELS.find((l) => l.id === config.level)?.label ?? "";
  const type = TYPES.find((t) => t.id === config.type)?.label ?? "";
  return `${level} ${role} · ${type}`;
}

export const JD_MAX = 4000;
export const RESUME_MAX = 4000;
export const ANSWER_MAX = 4000;

export type InterviewReport = {
  overallScore: number; // 0–100
  readiness: string; // short phrase, e.g. "Almost there"
  summary: string;
  strengths: string[];
  improvements: string[];
  focusAreas: string[];
  perQuestion: {
    question: string;
    answerSummary: string;
    score: number; // 1–5
    feedback: string;
    modelAnswer: string;
  }[];
};
