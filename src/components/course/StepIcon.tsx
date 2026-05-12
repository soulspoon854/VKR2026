import { PlayCircle, FileText, TerminalSquare, ListChecks, type LucideIcon } from "lucide-react";
import type { StepType } from "@/data/course";

export const stepIconMap: Record<StepType, LucideIcon> = {
  video: PlayCircle,
  text: FileText,
  terminal: TerminalSquare,
  quiz: ListChecks,
};

export const stepLabelMap: Record<StepType, string> = {
  video: "Видео",
  text: "Теория",
  terminal: "Терминал",
  quiz: "Тест",
};