"use client";
import { useState } from "react";
import { useCharacters, useUpdateCharacter, useDeleteCharacter } from "../api";
import { useGenerateCharacters, useGeneratePortraits } from "@/app/features/generation/api";
import { useUIStore } from "@/app/store/ui-store";
import { Sparkles, Loader2, Pencil, Trash2, Camera, X, Check, User } from "lucide-react";
import type { CharacterProfile } from "@/app/types";


export function CharactersStep({ movieId }: { movieId: number }) {
  const { data: characters = [], isLoading, refetch } = useCharacters(movieId);
  const genChars = useGenerateCharacters(movieId);
  const genPortraits = useGeneratePortraits(movieId);
  const { setStepOverride } = useUIStore();
  const [busy, setBusy] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const runAndPoll = async (fn: () => Promise<unknown>, check: (chars: CharacterProfile[]) => boolean) => {
    setBusy(true);
    try {
      await fn();
      const poll = setInterval(async () => {
        const r = await refetch();
        if (r.data && check(r.data)) { clearInterval(poll); setBusy(false); }
      }, 4000);
      setTimeout(() => { clearInterval(poll); setBusy(false); }, 120_000);
    } catch { setBusy(false); }
  };

  return (
    <div className="p-8 lg:p-10 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold tracking-tight">Characters</h2>
          <p className="text-base text-muted-foreground mt-1">{characters.length === 0 ? "Let AI create characters for your movie" : "Review and edit. Generate portraits when ready."}</p></div>
        <div className="flex gap-2">
          {characters.length === 0 ? (
            <button onClick={() => runAndPoll(() => genChars.mutateAsync(), (c) => c.length > 0)} disabled={busy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold disabled:opacity-50">
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} {busy ? "Generating…" : "AI Generate Characters"}
            </button>
          ) : (
            <>
              {!characters.some((c) => c.portraitUrl) && (
                <button onClick={() => runAndPoll(() => genPortraits.mutateAsync(), (c) => c.some((x) => x.portraitUrl))} disabled={busy}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm hover:bg-muted disabled:opacity-50">
                  {busy ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />} Portraits
                </button>
              )}
              <button onClick={() => setStepOverride("script")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold">
                Next: Script →
              </button>
            </>
          )}
        </div>
      </div>

      {isLoading || (busy && characters.length === 0) ? (
        <div className="flex flex-col items-center py-16 gap-3"><Loader2 className="size-8 animate-spin text-purple-500" /><p className="text-base text-muted-foreground">{busy ? "AI is crafting characters…" : "Loading…"}</p></div>
      ) : characters.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3 text-center"><User className="size-12 text-muted-foreground/30" /><p className="text-base text-muted-foreground">No characters yet. Click "AI Generate Characters" above.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {characters.map((c) => (
            <CharCard key={c.id} char={c} movieId={movieId} editing={editId === c.id}
              onEdit={() => setEditId(c.id)} onClose={() => { setEditId(null); refetch(); }} />
          ))}
        </div>
      )}
    </div>
  );
}

function CharCard({ char: c, movieId, editing, onEdit, onClose }: {
  char: CharacterProfile; movieId: number; editing: boolean; onEdit: () => void; onClose: () => void;
}) {
  const update = useUpdateCharacter(movieId);
  const remove = useDeleteCharacter(movieId);
  const [f, setF] = useState(c);

  if (editing) {
    return (
      <div className="p-4 rounded-xl border border-purple-500/50 bg-card space-y-3">
        <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Name" />
        <textarea value={f.description ?? ""} onChange={(e) => setF({ ...f, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none" rows={2} placeholder="Description" />
        <div className="grid grid-cols-2 gap-2">
          <input value={f.hair ?? ""} onChange={(e) => setF({ ...f, hair: e.target.value })} className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Hair" />
          <input value={f.eyes ?? ""} onChange={(e) => setF({ ...f, eyes: e.target.value })} className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Eyes" />
        </div>
        <div className="flex gap-2">
          <button onClick={async () => { await update.mutateAsync({ charId: c.id, data: { name: f.name, description: f.description, hair: f.hair, eyes: f.eyes, clothes: f.clothes, style: f.style } }); onClose(); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-sm"><Check className="size-3.5" /> Save</button>
          <button onClick={onClose} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm"><X className="size-3.5" /> Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="group p-4 rounded-xl border border-border bg-card hover:border-purple-500/30 transition-colors">
      <div className="flex gap-4">
        {c.portraitUrl ? (
          <img src={c.portraitUrl} alt={c.name} className="size-20 rounded-lg object-cover shrink-0" />
        ) : (
          <div className="size-20 rounded-lg bg-muted flex items-center justify-center shrink-0"><User className="size-8 text-muted-foreground/40" /></div>
        )}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{c.name}</h3>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={onEdit} className="p-1 rounded hover:bg-muted"><Pencil className="size-3.5" /></button>
              <button onClick={() => remove.mutate(c.id)} className="p-1 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="size-3.5" /></button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
        </div>
      </div>
    </div>
  );
}
