"use client";
import { useState } from "react";
import { useScenes, useUpdateScene } from "../api";
import { useGenerateKeyframes } from "@/app/features/generation/api";
import { useUIStore } from "@/app/store/ui-store";
import {
  Sparkles, Loader2, RefreshCw, AlertTriangle, Pencil,
  Check, X, RotateCw, ZoomIn, Image as ImageIcon,
} from "lucide-react";
import type { Scene } from "@/app/types";

export function StoryboardStep({ movieId }: { movieId: number }) {
  const { data: scenes = [], isLoading, refetch } = useScenes(movieId);
  const genKf = useGenerateKeyframes(movieId);
  const { setStepOverride, previewImageUrl, setPreviewImageUrl, editingSceneId, setEditingSceneId } = useUIStore();
  const [busy, setBusy] = useState(false);

  const kfCount = scenes.filter((s) => s.keyframeImageUrl).length;
  const hasKf = kfCount > 0;
  const allKf = scenes.length > 0 && kfCount === scenes.length;

  const generate = async () => {
    setBusy(true);
    try {
      await genKf.mutateAsync();
      // Poll every 4s — show images progressively as they arrive
      const poll = setInterval(async () => {
        const res = await refetch();
        if (res.data?.every((s) => s.keyframeImageUrl)) {
          clearInterval(poll);
          setBusy(false);
        }
      }, 4000);
      setTimeout(() => { clearInterval(poll); setBusy(false); }, 300_000);
    } catch {
      setBusy(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 lg:p-10 max-w-6xl mx-auto">
        <div className="flex flex-col items-center py-20 gap-4">
          <Loader2 className="size-10 animate-spin text-purple-500" />
          <p className="text-lg font-medium">Loading storyboard…</p>
        </div>
      </div>
    );
  }

  if (scenes.length === 0) {
    return (
      <div className="p-8 lg:p-10 max-w-6xl mx-auto">
        <div className="flex flex-col items-center py-20 gap-4 text-center">
          <ImageIcon className="size-14 text-muted-foreground/20" />
          <p className="text-lg text-muted-foreground">No scenes to storyboard</p>
          <button onClick={() => setStepOverride("scenes")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm hover:bg-muted">
            ← Back to Scenes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-10 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Storyboard Preview</h2>
          <p className="text-base text-muted-foreground mt-1">
            {busy
              ? `Generating keyframes… ${kfCount}/${scenes.length} ready`
              : hasKf
              ? "Edit descriptions and regenerate until happy. Images are cheap!"
              : "Generate keyframe images for each scene"
            }
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={generate} disabled={busy}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted disabled:opacity-50">
            {busy ? <Loader2 className="size-4 animate-spin" /> : hasKf ? <RefreshCw className="size-4" /> : <Sparkles className="size-4" />}
            {busy ? "Generating…" : hasKf ? "Regenerate All" : "Generate Storyboard"}
          </button>
          {allKf && (
            <button onClick={() => setStepOverride("video")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold">
              Approve & Generate Videos →
            </button>
          )}
        </div>
      </div>

      {/* Progress bar during generation */}
      {busy && (
        <div className="space-y-2">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${(kfCount / Math.max(scenes.length, 1)) * 100}%` }} />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {kfCount}/{scenes.length} keyframes generated
          </p>
        </div>
      )}

      {/* Cost warning */}
      {allKf && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm">
          <AlertTriangle className="size-5 text-amber-500 shrink-0" />
          <span className="text-amber-200">
            <strong>Iterate here — it&apos;s cheap!</strong> Keyframe images cost ~$0.02 each.
            Video generation costs ~$0.07/second — much more expensive. Make sure every scene looks right first.
          </span>
        </div>
      )}

      {/* Storyboard grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {scenes.map((s) =>
          editingSceneId === s.id ? (
            <KfEditor key={s.id} scene={s} movieId={movieId}
              onClose={() => { setEditingSceneId(null); refetch(); }}
              onRegen={() => { setEditingSceneId(null); generate(); }} />
          ) : (
            <KfCard key={s.id} scene={s} busy={busy}
              onPreview={() => s.keyframeImageUrl && setPreviewImageUrl(s.keyframeImageUrl)}
              onEdit={() => setEditingSceneId(s.id)} />
          )
        )}
      </div>

      {/* Full-size image preview modal */}
      {previewImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
          onClick={() => setPreviewImageUrl(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewImageUrl} alt="Scene preview"
            className="rounded-xl max-w-[90vw] max-h-[90vh] object-contain" />
        </div>
      )}
    </div>
  );
}

/* ── Keyframe Card ───────────────────────────────── */
function KfCard({ scene: s, busy, onPreview, onEdit }: {
  scene: Scene; busy: boolean; onPreview: () => void; onEdit: () => void;
}) {
  return (
    <div className="group rounded-xl border border-border bg-card overflow-hidden hover:border-purple-500/30 transition-all">
      {/* Image area */}
      <div className="aspect-video bg-muted relative">
        {s.keyframeImageUrl ? (
          <div className="w-full h-full cursor-pointer" onClick={onPreview}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.keyframeImageUrl}
              alt={s.title ?? `Scene ${s.sceneOrder}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="size-6 text-white opacity-0 group-hover:opacity-80 transition-opacity" />
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            {busy ? (
              <>
                <Loader2 className="size-6 animate-spin text-purple-500" />
                <p className="text-xs text-muted-foreground">Generating…</p>
              </>
            ) : (
              <ImageIcon className="size-8 text-muted-foreground/20" />
            )}
          </div>
        )}
        <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/70 text-xs font-semibold">
          {s.sceneOrder} • {s.durationSeconds}s
        </span>
      </div>

      {/* Info */}
      <div className="p-3 flex items-center justify-between">
        <h3 className="font-medium text-sm truncate flex-1">
          {s.title ?? `Scene ${s.sceneOrder}`}
        </h3>
        <button onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="p-1.5 rounded-lg hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
          title="Edit description & regenerate">
          <Pencil className="size-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

/* ── Keyframe Editor (inline) ────────────────────── */
function KfEditor({ scene: s, movieId, onClose, onRegen }: {
  scene: Scene; movieId: number; onClose: () => void; onRegen: () => void;
}) {
  const update = useUpdateScene(movieId);
  const [title, setTitle] = useState(s.title ?? "");
  const [desc, setDesc] = useState(s.description ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await update.mutateAsync({ sceneId: s.id, data: { title, description: desc } });
      onClose();
    } finally { setSaving(false); }
  };

  const handleSaveAndRegen = async () => {
    setSaving(true);
    try {
      await update.mutateAsync({ sceneId: s.id, data: { title, description: desc } });
      onRegen();
    } finally { setSaving(false); }
  };

  return (
    <div className="rounded-xl border border-purple-500/50 bg-card overflow-hidden">
      {/* Current keyframe preview (dimmed) */}
      {s.keyframeImageUrl && (
        <div className="aspect-video relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.keyframeImageUrl} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full bg-black/60 text-xs font-semibold text-purple-300">
              Editing Scene {s.sceneOrder}
            </span>
          </div>
        </div>
      )}

      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            placeholder="Scene title" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Visual Description <span className="text-purple-400">(this drives the keyframe image)</span>
          </label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none"
            placeholder="What does the camera see? Setting, lighting, mood, character positions…" />
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted disabled:opacity-50">
            <Check className="size-3.5" /> Save Only
          </button>
          <button onClick={handleSaveAndRegen} disabled={saving}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium disabled:opacity-50">
            <RotateCw className="size-3.5" /> Save & Regenerate
          </button>
          <button onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted">
            <X className="size-3.5" /> Cancel
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          💡 Edit the description, then click &quot;Save & Regenerate&quot; to get a new keyframe. Only ~$0.02 per image.
        </p>
      </div>
    </div>
  );
}
