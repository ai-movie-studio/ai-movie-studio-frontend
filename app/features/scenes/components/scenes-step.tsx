"use client";
import { useScenes, useUpdateScene } from "../api";
import { useGenerationJobs } from "@/app/features/generation/api";
import { useUIStore } from "@/app/store/ui-store";
import {
  Clock, MessageSquare, Pencil, Check, X,
  ChevronDown, ChevronUp, Loader2, Clapperboard,
} from "lucide-react";
import { useState } from "react";
import type { Scene } from "@/app/types";

export function ScenesStep({ movieId }: { movieId: number }) {
  const { data: scenes = [], isLoading } = useScenes(movieId);
  const { data: jobs = [] } = useGenerationJobs(movieId, true);
  const { setStepOverride, editingSceneId, setEditingSceneId, expandedSceneId, setExpandedSceneId } = useUIStore();

  const total = scenes.reduce((s, x) => s + x.durationSeconds, 0);
  const sceneJobs = jobs.filter((j) => j.jobType === "SCENES");
  const isGenerating = sceneJobs.some((j) => j.status === "PENDING" || j.status === "IN_PROGRESS");

  // Show loading if scenes are being generated or data hasn't loaded
  if (isLoading || (scenes.length === 0 && isGenerating)) {
    return (
      <div className="p-8 lg:p-10 max-w-5xl mx-auto">
        <div className="flex flex-col items-center py-20 gap-4">
          <Loader2 className="size-10 animate-spin text-purple-500" />
          <p className="text-lg font-medium">
            {isGenerating ? "Generating scenes & dialogue…" : "Loading scenes…"}
          </p>
          <p className="text-sm text-muted-foreground">
            AI is breaking your screenplay into individual scenes with dialogue
          </p>
        </div>
      </div>
    );
  }

  if (scenes.length === 0) {
    return (
      <div className="p-8 lg:p-10 max-w-5xl mx-auto">
        <div className="flex flex-col items-center py-20 gap-4 text-center">
          <Clapperboard className="size-14 text-muted-foreground/20" />
          <p className="text-lg text-muted-foreground">No scenes yet</p>
          <p className="text-sm text-muted-foreground max-w-md">
            Go back to the Script step and click &quot;Generate Scenes&quot; to create scenes from your screenplay
          </p>
          <button onClick={() => setStepOverride("script")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm hover:bg-muted">
            ← Back to Script
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-10 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Scenes & Dialogue</h2>
          <p className="text-base text-muted-foreground mt-1">
            {scenes.length} scenes • {Math.floor(total / 60)}m {total % 60}s total — click to expand, pencil to edit
          </p>
        </div>
        <button onClick={() => setStepOverride("storyboard")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold">
          Next: Storyboard →
        </button>
      </div>

      <div className="space-y-3">
        {scenes.map((scene) =>
          editingSceneId === scene.id ? (
            <SceneEditor key={scene.id} scene={scene} movieId={movieId}
              onClose={() => setEditingSceneId(null)} />
          ) : (
            <SceneCard key={scene.id} scene={scene}
              expanded={expandedSceneId === scene.id}
              onToggle={() => setExpandedSceneId(expandedSceneId === scene.id ? null : scene.id)}
              onEdit={() => setEditingSceneId(scene.id)} />
          )
        )}
      </div>
    </div>
  );
}

function SceneCard({ scene, expanded, onToggle, onEdit }: {
  scene: Scene; expanded: boolean; onToggle: () => void; onEdit: () => void;
}) {
  return (
    <div className="group rounded-xl border border-border bg-card overflow-hidden hover:border-purple-500/30 transition-colors">
      <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={onToggle}>
        <span className="flex items-center justify-center size-9 rounded-lg bg-purple-500/10 text-purple-400 text-sm font-bold shrink-0">
          {scene.sceneOrder}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{scene.title || `Scene ${scene.sceneOrder}`}</h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            <span className="flex items-center gap-1"><Clock className="size-3" /> {scene.durationSeconds}s</span>
            {scene.dialogue?.length > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare className="size-3" /> {scene.dialogue.length} lines
              </span>
            )}
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
          <Pencil className="size-4 text-muted-foreground" />
        </button>
        {expanded
          ? <ChevronUp className="size-4 text-muted-foreground" />
          : <ChevronDown className="size-4 text-muted-foreground" />
        }
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          <p className="text-sm text-muted-foreground leading-relaxed">{scene.description}</p>
          {scene.dialogue?.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Dialogue</p>
              {scene.dialogue.map((l, i) => (
                <div key={i} className="pl-4 border-l-2 border-purple-500/30">
                  <p className="text-xs font-semibold text-purple-400">
                    {l.characterName}
                    {l.direction && (
                      <span className="text-muted-foreground font-normal"> ({l.direction})</span>
                    )}
                  </p>
                  <p className="text-sm leading-relaxed">&ldquo;{l.dialogueText}&rdquo;</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SceneEditor({ scene, movieId, onClose }: {
  scene: Scene; movieId: number; onClose: () => void;
}) {
  const update = useUpdateScene(movieId);
  const [title, setTitle] = useState(scene.title ?? "");
  const [desc, setDesc] = useState(scene.description ?? "");
  const [dur, setDur] = useState(scene.durationSeconds);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await update.mutateAsync({
        sceneId: scene.id,
        data: { title, description: desc, durationSeconds: dur },
      });
      onClose();
    } catch {
      /* error handled by normalizer */
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-purple-500/50 bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-purple-400">Editing Scene {scene.sceneOrder}</span>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium disabled:opacity-50">
            <Check className="size-3.5" /> {saving ? "Saving…" : "Save"}
          </button>
          <button onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted">
            <X className="size-3.5" /> Cancel
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            placeholder="Scene title" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Visual Description</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none"
            placeholder="What does the camera see? Setting, lighting, mood…" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Duration: {dur}s</label>
          <input type="range" min={5} max={15} value={dur}
            onChange={(e) => setDur(+e.target.value)}
            className="w-full accent-purple-500" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5s</span><span>15s</span>
          </div>
        </div>
      </div>

      {scene.dialogue?.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground">Dialogue (from screenplay)</p>
          {scene.dialogue.map((l, i) => (
            <div key={i} className="pl-3 border-l-2 border-purple-500/20 text-xs">
              <span className="font-semibold text-purple-400">{l.characterName}: </span>
              <span className="text-muted-foreground">&ldquo;{l.dialogueText}&rdquo;</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
