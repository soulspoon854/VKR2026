import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
  Trophy,
  RotateCcw,
} from "lucide-react";
import { quizQuestions } from "@/data/quiz";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: CoursePage,
});

const STORAGE_KEY = "infosec-course-progress-v1";

interface Progress {
  current: number;
  answers: Record<number, number>; // questionId -> selected option index
}

function loadProgress(): Progress {
  if (typeof window === "undefined") return { current: 0, answers: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { current: 0, answers: {} };
}

function CoursePage() {
  const [progress, setProgress] = useState<Progress>({ current: 0, answers: {} });
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress]);

  const total = quizQuestions.length;
  const idx = Math.min(progress.current, total - 1);
  const question = quizQuestions[idx];
  const isFinished = progress.current >= total;

  // Sync local UI to stored answer when navigating
  useEffect(() => {
    if (isFinished) return;
    const stored = progress.answers[question.id];
    setSelected(stored ?? null);
    setRevealed(stored !== undefined);
  }, [idx, isFinished]); // eslint-disable-line react-hooks/exhaustive-deps

  const correctCount = useMemo(
    () =>
      quizQuestions.reduce(
        (acc, q) => acc + (progress.answers[q.id] === q.correctIndex ? 1 : 0),
        0,
      ),
    [progress.answers],
  );

  const answeredCount = Object.keys(progress.answers).length;
  const progressPct = Math.round((answeredCount / total) * 100);

  const goTo = (i: number) =>
    setProgress((p) => ({ ...p, current: Math.max(0, Math.min(total, i)) }));

  const handleCheck = () => {
    if (selected === null) return;
    setRevealed(true);
    setProgress((p) => ({ ...p, answers: { ...p.answers, [question.id]: selected } }));
  };

  const handleNext = () => goTo(idx + 1);
  const handlePrev = () => goTo(idx - 1);

  const handleReset = () => {
    setProgress({ current: 0, answers: {} });
    setSelected(null);
    setRevealed(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-sm font-semibold sm:text-base">
            Курс: Информационная безопасность
          </h1>
          <span className="ml-auto text-xs text-muted-foreground">
            {answeredCount}/{total} отвечено · {correctCount} верно
          </span>
        </div>

        {/* Step icons */}
        <div className="mx-auto max-w-7xl px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {quizQuestions.map((q, i) => {
              const ans = progress.answers[q.id];
              const isAnswered = ans !== undefined;
              const isCorrect = isAnswered && ans === q.correctIndex;
              const isActive = i === idx && !isFinished;
              return (
                <button
                  key={q.id}
                  onClick={() => goTo(i)}
                  className={cn(
                    "relative flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-lg border transition-all",
                    isActive
                      ? "border-primary bg-primary/20 ring-2 ring-primary"
                      : "border-border bg-secondary hover:bg-secondary/70",
                  )}
                  aria-label={`Вопрос ${i + 1}`}
                >
                  <HelpCircle
                    className={cn(
                      "h-6 w-6",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <span className="mt-0.5 text-[10px] font-medium">Q{i + 1}</span>
                  {isAnswered && (
                    <span
                      className={cn(
                        "absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full",
                        isCorrect
                          ? "bg-[oklch(0.74_0.20_145)]"
                          : "bg-destructive",
                      )}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="h-3 w-3 text-background" />
                      ) : (
                        <XCircle className="h-3 w-3 text-background" />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              {isFinished
                ? "Курс завершён"
                : `${question.module} · Вопрос ${idx + 1} из ${total}`}
            </span>
            <div className="ml-auto flex w-40 items-center gap-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="w-9 text-right tabular-nums">{progressPct}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_280px]">
        <section className="rounded-xl border border-border bg-card p-6 shadow-lg">
          {isFinished ? (
            <FinishedView
              correct={correctCount}
              total={total}
              onReset={handleReset}
              onReview={() => goTo(0)}
            />
          ) : (
            <>
              <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded bg-primary/15 px-2 py-0.5 text-primary">
                  {question.module}
                </span>
                <span>· {question.title}</span>
              </div>
              <h2 className="text-xl font-semibold sm:text-2xl">{question.question}</h2>

              <div className="mt-6 space-y-2">
                {question.options.map((opt, i) => {
                  const chosen = selected === i;
                  const isCorrect = i === question.correctIndex;
                  const showState = revealed;
                  return (
                    <button
                      key={i}
                      onClick={() => !revealed && setSelected(i)}
                      disabled={revealed}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-all",
                        !showState &&
                          (chosen
                            ? "border-primary bg-primary/15"
                            : "border-border bg-secondary hover:border-primary/50"),
                        showState &&
                          isCorrect &&
                          "border-[oklch(0.74_0.20_145)] bg-[oklch(0.74_0.20_145)]/15",
                        showState &&
                          !isCorrect &&
                          chosen &&
                          "border-destructive bg-destructive/15",
                        showState && !isCorrect && !chosen && "border-border opacity-60",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold",
                            chosen && !showState && "border-primary bg-primary text-primary-foreground",
                            showState && isCorrect && "border-[oklch(0.74_0.20_145)] bg-[oklch(0.74_0.20_145)] text-background",
                            showState && !isCorrect && chosen && "border-destructive bg-destructive text-destructive-foreground",
                          )}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-sm sm:text-base">{opt}</span>
                      </span>
                      {showState && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-[oklch(0.74_0.20_145)]" />
                      )}
                      {showState && !isCorrect && chosen && (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </button>
                  );
                })}
              </div>

              {revealed && (
                <div
                  className={cn(
                    "mt-5 rounded-lg border p-4 text-sm",
                    selected === question.correctIndex
                      ? "border-[oklch(0.74_0.20_145)]/50 bg-[oklch(0.74_0.20_145)]/10"
                      : "border-destructive/50 bg-destructive/10",
                  )}
                >
                  <div className="mb-1 font-semibold">
                    {selected === question.correctIndex ? "Верно!" : "Неверно"}
                  </div>
                  <div className="text-muted-foreground">{question.explanation}</div>
                </div>
              )}

              <div className="mt-6 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={idx === 0}
                >
                  <ChevronLeft /> Назад
                </Button>
                {!revealed ? (
                  <Button onClick={handleCheck} disabled={selected === null}>
                    Проверить
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    {idx === total - 1 ? "Завершить" : "Далее"} <ChevronRight />
                  </Button>
                )}
              </div>
            </>
          )}
        </section>

        {/* Sidebar */}
        <aside className="rounded-xl border border-border bg-card p-4 shadow-lg">
          <h3 className="mb-3 text-sm font-semibold">Программа курса</h3>
          <ol className="space-y-1">
            {quizQuestions.map((q, i) => {
              const ans = progress.answers[q.id];
              const isAnswered = ans !== undefined;
              const isCorrect = isAnswered && ans === q.correctIndex;
              const isActive = i === idx && !isFinished;
              return (
                <li key={q.id}>
                  <button
                    onClick={() => goTo(i)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-xs transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary",
                    )}
                  >
                    <span className="truncate">
                      {i + 1}. {q.title}
                    </span>
                    {isAnswered &&
                      (isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[oklch(0.74_0.20_145)]" />
                      ) : (
                        <XCircle className="h-4 w-4 flex-shrink-0 text-destructive" />
                      ))}
                  </button>
                </li>
              );
            })}
          </ol>

          <button
            onClick={handleReset}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-secondary"
          >
            <RotateCcw className="h-3 w-3" /> Сбросить прогресс
          </button>
        </aside>
      </main>
    </div>
  );
}

function FinishedView({
  correct,
  total,
  onReset,
  onReview,
}: {
  correct: number;
  total: number;
  onReset: () => void;
  onReview: () => void;
}) {
  const pct = Math.round((correct / total) * 100);
  const passed = pct >= 70;
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div
        className={cn(
          "flex h-20 w-20 items-center justify-center rounded-full",
          passed ? "bg-[oklch(0.74_0.20_145)]/20" : "bg-destructive/20",
        )}
      >
        <Trophy
          className={cn(
            "h-10 w-10",
            passed ? "text-[oklch(0.74_0.20_145)]" : "text-destructive",
          )}
        />
      </div>
      <h2 className="mt-4 text-2xl font-bold">
        {passed ? "Курс пройден!" : "Курс завершён"}
      </h2>
      <p className="mt-2 text-muted-foreground">
        Правильных ответов: <span className="font-semibold text-foreground">{correct}</span>{" "}
        из {total} ({pct}%)
      </p>
      <div className="mt-6 flex gap-2">
        <Button variant="outline" onClick={onReview}>
          Просмотреть ответы
        </Button>
        <Button onClick={onReset}>
          <RotateCcw /> Пройти заново
        </Button>
      </div>
    </div>
  );
}
