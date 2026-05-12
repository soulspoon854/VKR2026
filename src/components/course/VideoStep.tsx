import type { Step } from "@/data/course";

export function VideoStep({ step }: { step: Step }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground">{step.title}</h2>
      <div className="overflow-hidden rounded-lg border border-border bg-black shadow-lg">
        <video
          key={step.id}
          controls
          className="aspect-video w-full"
          src={step.videoUrl}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Посмотрите видео целиком, прежде чем переходить к следующему шагу.
      </p>
    </div>
  );
}