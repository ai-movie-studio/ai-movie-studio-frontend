"use client";
import { useState } from "react";
import { useMovie, useMovieScript } from "@/app/features/movies/api";
import { useScenes } from "@/app/features/scenes/api";
import { useGenerateScript, useGenerateScenes } from "@/app/features/generation/api";
import { useUIStore } from "@/app/store/ui-store";
import { Sparkles, Loader2, FileText, ArrowRight } from "lucide-react";

export function ScriptStep({ movieId }: { movieId: number }) {
  const { refetch: refetchMovie } = useMovie(movieId);
  const { data: scriptData, refetch: refetchScript } = useMovieScript(movieId);
  const { refetch: refetchScenes } = useScenes(movieId);
  const genScript = useGenerateScript(movieId);
  const genScenes = useGenerateScenes(movieId);
  const { setStepOverride } = useUIStore();
  const [busy, setBusy] = useState(false);
  const [label, setLabel] = useState("");
  const hasScript = !!scriptData?.scriptText;

  const handleGenerateScript = async () => {
    setBusy(true);
    setLabel("Writing screenplay…");
    try {
      await genScript.mutateAsync();
      const poll = setInterval(async () => {
        const res = await refetchScript();
        if (res.data?.scriptText) {
          clearInterval(poll);
          setBusy(false);
        }
      }, 3000);
      setTimeout(() => { clearInterval(poll); setBusy(false); }, 120_000);
    } catch {
      setBusy(false);
    }
  };

  const handleGenerateScenes = async () => {
    setBusy(true);
    setLabel("Breaking script into scenes…");
    try {
      await genScenes.mutateAsync();
      // Poll the SCENES endpoint — not the script endpoint
      const poll = setInterval(async () => {
        const scenesRes = await refetchScenes();
        await refetchMovie();
        if (scenesRes.data && scenesRes.data.length > 0) {
          clearInterval(poll);
          setBusy(false);
          setStepOverride("scenes");
        }
      }, 3000);
      setTimeout(() => { clearInterval(poll); setBusy(false); }, 120_000);
    } catch {
      setBusy(false);
    }
  };

  return (
    <div className="p-8 lg:p-10 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Screenplay</h2>
          <p className="text-base text-muted-foreground mt-1">
            {hasScript ? "Review the AI screenplay" : "Generate a screenplay from your idea"}
          </p>
        </div>
        <div className="flex gap-2">
          {!hasScript ? (
            <button onClick={handleGenerateScript} disabled={busy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold disabled:opacity-50">
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {busy ? label : "Generate Script"}
            </button>
          ) : (
            <>
              <button onClick={handleGenerateScript} disabled={busy}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm hover:bg-muted disabled:opacity-50">
                <Sparkles className="size-4" /> Regenerate
              </button>
              <button onClick={handleGenerateScenes} disabled={busy}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold disabled:opacity-50">
                {busy ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                {busy ? label : "Generate Scenes →"}
              </button>
            </>
          )}
        </div>
      </div>

      {busy ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <Loader2 className="size-10 animate-spin text-purple-500" />
          <p className="text-lg font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">This can take 30-60 seconds…</p>
        </div>
      ) : hasScript ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-foreground/90">
            {scriptData.scriptText}
          </pre>
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 gap-3 text-center">
          <FileText className="size-14 text-muted-foreground/20" />
          <p className="text-lg text-muted-foreground">No screenplay yet</p>
          <p className="text-sm text-muted-foreground max-w-md">
            The AI will write a complete screenplay based on your movie idea and characters
          </p>
        </div>
      )}
    </div>
  );
}
