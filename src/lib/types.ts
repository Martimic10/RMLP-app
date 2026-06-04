export type LetterGrade = "A" | "B" | "C" | "D" | "F";

export type SectionKey =
  | "headline"
  | "hero"
  | "cta"
  | "trust"
  | "objections"
  | "clarity";

export interface RoastSection {
  key: SectionKey;
  title: string;
  grade: LetterGrade;
  roast: string;
  rewrite: string;
}

export interface RoastResult {
  overallGrade: LetterGrade;
  summary: string;
  sections: RoastSection[];
}

export interface RoastReport {
  id: string;
  url: string;
  status: "pending" | "processing" | "complete" | "failed";
  createdAt: string;
  overallGrade?: LetterGrade;
  summary?: string;
  sections?: RoastSection[];
  error?: string;
}

export const SECTION_LABELS: Record<SectionKey, string> = {
  headline: "Headline",
  hero: "Hero Copy",
  cta: "Call to Action",
  trust: "Trust Signals",
  objections: "Objection Handling",
  clarity: "Overall Clarity",
};
