"use client";
import { use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMovie } from "@/app/features/movies/api";
import { useCharacters } from "@/app/features/characters/api";
import { useScenes } from "@/app/features/scenes/api";
import { useGenerationJobs } from "@/app/features/generation/api";
import { useUIStore } from "@/app/store/ui-store";
import { deriveStep } from "@/app/features/pipeline/derive-step";
import type { PipelineStep } from "@/app/types";
import {
  Users, FileText, Clapperboard, Image as ImageIcon, Video, Download,
  ChevronLeft, Loader2, CheckCircle,
} from "lucide-react";

import { CharactersStep } from "@/app/features/characters/components/characters-step";
import { ScriptStep } from "@/app/features/scenes/components/script-step";
import { ScenesStep } from "@/app/features/scenes/components/scenes-step";
import { StoryboardStep } from "@/app/features/scenes/components/storyboard-step";
import { VideoStep } from "@/app/features/generation/components/video-step";
import { RenderStep } from "@/app/features/generation/components/render-step";

const STEPS: { key: PipelineStep; label: string; icon: React.ReactNode }[] = [
  { key: "characters", label: "Characters", icon: <Users className="size-4" /> },
  { key: "script",     label: "Script",     icon: <FileText className="size-4" /> },
  { key: "scenes",     label: "Scenes",     icon: <Clapperboard className="size-4" /> },
  { key: "storyboard", label: "Storyboard", icon: <ImageIcon className="size-4" /> },
  { key: "video",      label: "Video",      icon: <Video className="size-4" /> },
  { key: "render",     label: "Final Movie", icon: <Download className="size-4" /> },
];

export default function ProjectEditorPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const movieId = parseInt(projectId);
  const router = useRouter();

  /* ── Server state (React Query only — no Zustand duplication) ── */
  const { data: movie, isLoading } = useMovie(movieId);
  const { data: characters }       = useCharacters(movieId);
  const { data: scenes }           = useScenes(movieId);
  const { data: jobs }             = useGenerationJobs(movieId, true);

  /* ── Derived step + optional manual override ── */
  const { stepOverride, setStepOverride } = useUIStore();
  const autoStep = useMemo(() => deriveStep(movie, scenes, characters), [movie, scenes, characters]);
  const currentStep = stepOverride ?? autoStep;
  const stepIndex   = STEPS.findIndex((s) => s.key === currentStep);

  if (isLoading) return <div className="flex items-center justify-center h-full"><Loader2 className="size-10 animate-spin text-purple-500" /></div>;
  if (!movie) return <div className="flex flex-col items-center justify-center h-full gap-4"><p className="text-lg text-muted-foreground">Project not found</p><button onClick={() => router.push("/projects")} className="text-purple-400 hover:underline">Back to projects</button></div>;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-8 py-5 border-b border-border flex items-center gap-5">
        <button onClick={() => { useUIStore.getState().reset(); router.push("/projects"); }} className="p-2 rounded-xl hover:bg-muted transition-colors"><ChevronLeft className="size-5" /></button>
        <div className="flex-1 min-w-0"><h1 className="text-xl font-bold tracking-tight truncate">{movie.title}</h1><p className="text-sm text-muted-foreground mt-0.5">{movie.targetDurationMinutes} min • {movie.status.replace(/_/g, " ").toLowerCase()}</p></div>
      </div>

      {/* Stepper */}
      <div className="shrink-0 px-8 py-4 border-b border-border bg-card/30 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {STEPS.map((step, i) => {
            const isActive = step.key === currentStep;
            const isPast = i < stepIndex;
            return (
              <div key={step.key} className="flex items-center">
                <button onClick={() => setStepOverride(step.key)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : isPast ? "text-purple-400 hover:bg-purple-500/10" : "text-muted-foreground hover:bg-muted"}`}>
                  {isPast ? <CheckCircle className="size-4" /> : step.icon} {step.label}
                </button>
                {i < STEPS.length - 1 && <div className={`w-6 h-px mx-1 ${i < stepIndex ? "bg-purple-500/40" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content — server data passed as props, not from store */}
      <div className="flex-1 overflow-auto">
        {currentStep === "characters" && <CharactersStep movieId={movieId} />}
        {currentStep === "script"     && <ScriptStep movieId={movieId} />}
        {currentStep === "scenes"     && <ScenesStep movieId={movieId} />}
        {currentStep === "storyboard" && <StoryboardStep movieId={movieId} />}
        {currentStep === "video"      && <VideoStep movieId={movieId} />}
        {currentStep === "render"     && <RenderStep movieId={movieId} />}
      </div>
    </div>
  );
}
