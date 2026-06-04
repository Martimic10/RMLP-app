import type { LetterGrade } from "@/lib/types";

const GRADE_COLOR: Record<LetterGrade, string> = {
  A: "text-emerald-400",
  B: "text-lime-400",
  C: "text-amber-400",
  D: "text-orange-400",
  F: "text-red-400",
};

const GRADE_RING: Record<LetterGrade, string> = {
  A: "border-emerald-500/30 bg-emerald-500/5",
  B: "border-lime-500/30 bg-lime-500/5",
  C: "border-amber-500/30 bg-amber-500/5",
  D: "border-orange-500/30 bg-orange-500/5",
  F: "border-red-500/30 bg-red-500/5",
};

export function GradeMark({
  grade,
  size = "section",
}: {
  grade: LetterGrade;
  size?: "hero" | "section";
}) {
  const sizeClass =
    size === "hero"
      ? "text-[3.75rem] leading-none sm:text-[5.5rem] md:text-[7rem]"
      : "h-10 w-10 text-base sm:h-11 sm:w-11 sm:text-lg";

  const boxClass =
    size === "hero"
      ? ""
      : `inline-flex shrink-0 items-center justify-center rounded border font-mono font-bold tabular-nums ${GRADE_RING[grade]}`;

  return (
    <span
      className={`font-mono font-bold tabular-nums tracking-tighter ${sizeClass} ${GRADE_COLOR[grade]} ${boxClass}`}
      aria-label={`Grade ${grade}`}
    >
      {grade}
    </span>
  );
}
