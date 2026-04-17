"use client";
import { useState } from "react";
import { useScenes } from "@/app/features/scenes/api";
import { useGenerateVideos, useGenerationJobs } from "../api";
import { useUIStore } from "@/app/store/ui-store";
import { Video, Loader2, CheckCircle, XCircle, Play } from "lucide-react";

export function VideoStep({ movieId }: { movieId: number }) {
  const { data: scenes = [], refetch } = useScenes(movieId);
  const { data: jobs = [] } = useGenerationJobs(movieId, true);
  const genVid = useGenerateVideos(movieId);
  const { setStepOverride } = useUIStore();
  const [busy, setBusy] = useState(false);

  const vidJobs = jobs.filter((j) => j.jobType === "SCENE_VIDEO");
  const allDone = scenes.length > 0 && scenes.every((s) => s.videoUrl);
  const pending = vidJobs.filter((j) => j.status === "PENDING" || j.status === "IN_PROGRESS");
  const working = busy || pending.length > 0;
  const done = scenes.filter((s) => s.videoUrl).length;

  const generate = async () => {
    setBusy(true);
    try {
      await genVid.mutateAsync();
      const poll = setInterval(async () => {
        const r = await refetch();
        if (r.data?.every((s) => s.videoUrl)) {
          clearInterval(poll);
          setBusy(false);
        }
      }, 10_000);
      setTimeout(() => { clearInterval(poll); setBusy(false); }, 600_000);
    } catch {
      setBusy(false);
    }
  };

  return (
    <div className="p-8 lg:p-10 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Video Generation</h2>
          <p className="text-base text-muted-foreground mt-1">
            {allDone
              ? "All videos generated! Proceed to final render."
              : working
              ? `Generating videos… ${done}/${scenes.length} complete`
              : "Generate videos with dialogue and sound for each scene"}
          </p>
        </div>
        <div className="flex gap-2">
          {!allDone && !working && (
            <button onClick={generate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold">
              <Video className="size-4" /> Generate All Videos
            </button>
          )}
          {allDone && (
            <button onClick={() => setStepOverride("render")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold">
              Next: Final Render →
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {working && (
        <div className="space-y-2">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${(done / Math.max(scenes.length, 1)) * 100}%` }} />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {done}/{scenes.length} rendered • ~{(scenes.length - done) * 50}s remaining
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {scenes.map((s) => {
          const j = vidJobs.find((x) => x.sceneId === s.id);
          const has = !!s.videoUrl;
          const ip = j?.status === "PENDING" || j?.status === "IN_PROGRESS";
          const failed = j?.status === "FAILED";

          return (
            <div key={s.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="aspect-video bg-muted relative">
                {has ? (
                  <video src={s.videoUrl!} controls preload="metadata"
                    className="w-full h-full object-cover" />
                ) : s.keyframeImageUrl ? (
                  <div className="relative w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.keyframeImageUrl} alt=""
                      className="w-full h-full object-cover opacity-40" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      {ip ? (
                        <>
                          <Loader2 className="size-8 animate-spin text-purple-500" />
                          <p className="text-xs text-muted-foreground">Rendering…</p>
                        </>
                      ) : failed ? (
                        <>
                          <XCircle className="size-8 text-red-500" />
                          <p className="text-xs text-red-400">Failed</p>
                        </>
                      ) : (
                        <Play className="size-8 text-muted-foreground/40" />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="size-8 text-muted-foreground/20" />
                  </div>
                )}
                <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/70 text-xs font-semibold">
                  Scene {s.sceneOrder}
                </span>
                {has && <CheckCircle className="absolute top-2 right-2 size-5 text-emerald-400" />}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm truncate">{s.title ?? `Scene ${s.sceneOrder}`}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {has ? "✓ Video ready" : ip ? "Generating…" : failed ? "Generation failed" : "Waiting…"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
