"use client";
import { useState } from "react";
import { useFinalMovie } from "@/app/features/movies/api";
import { useScenes } from "@/app/features/scenes/api";
import { useGenerateFinalRender, useGenerationJobs } from "../api";
import { Download, Loader2, Film, Play } from "lucide-react";

export function RenderStep({ movieId }: { movieId: number }) {
  const { data: scenes = [] } = useScenes(movieId);
  const { data: final, refetch } = useFinalMovie(movieId);
  const { data: jobs = [] } = useGenerationJobs(movieId, true);
  const genRender = useGenerateFinalRender(movieId);
  const [busy, setBusy] = useState(false);
  const rj = jobs.find((j) => j.jobType === "FINAL_RENDER");
  const working = busy || rj?.status === "PENDING" || rj?.status === "IN_PROGRESS";
  const done = !!final?.videoUrl;
  const ready = scenes.every((s) => s.videoUrl);

  const render = async () => {
    setBusy(true);
    try { await genRender.mutateAsync(); const p = setInterval(async () => { const r = await refetch(); if (r.data?.videoUrl) { clearInterval(p); setBusy(false); } }, 5000); setTimeout(() => { clearInterval(p); setBusy(false); }, 300_000); } catch { setBusy(false); }
  };

  return (
    <div className="p-8 lg:p-10 max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{done ? "Your Movie is Ready! 🎬" : "Final Assembly"}</h2>
        <p className="text-base text-muted-foreground">{done ? "Watch, download, and share your movie" : "Assemble all scenes into the final film"}</p>
      </div>
      {done ? (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden border border-border bg-black"><video src={final!.videoUrl!} controls className="w-full max-h-[500px]" preload="metadata" /></div>
          <div className="flex justify-center gap-3">
            <a href={final!.videoUrl!} download target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-500/20"><Download className="size-4" /> Download Movie</a>
          </div>
          {final?.durationSeconds && <p className="text-center text-sm text-muted-foreground">{Math.floor(final.durationSeconds / 60)}m {final.durationSeconds % 60}s</p>}
        </div>
      ) : working ? (
        <div className="flex flex-col items-center py-16 gap-4"><Film className="size-16 text-purple-500/30" /><Loader2 className="size-8 animate-spin text-purple-500" /><p className="text-base text-muted-foreground">Assembling {scenes.length} scenes…</p></div>
      ) : (
        <div className="flex flex-col items-center py-16 gap-4">
          <Film className="size-16 text-muted-foreground/20" />
          {!ready ? <p className="text-base text-muted-foreground">Some scenes don&apos;t have videos yet. Go back to Video step.</p> : (
            <button onClick={render} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-500/20"><Play className="size-5" /> Render Final Movie</button>
          )}
        </div>
      )}
    </div>
  );
}
