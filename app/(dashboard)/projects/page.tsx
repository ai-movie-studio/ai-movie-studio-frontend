"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMovies,
  useCreateMovie,
  useDeleteMovie,
} from "@/app/features/movies/api";
import { createMovieSchema, type CreateMovieValues } from "@/app/lib/schemas";
import {
  Plus,
  Film,
  Trash2,
  Loader2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import type { MovieProject, MovieStatus } from "@/app/types";

const STATUS: Record<
  MovieStatus,
  { label: string; color: string; bg: string }
> = {
  DRAFT: { label: "Draft", color: "text-gray-400", bg: "bg-gray-500/10" },
  SCRIPT_GENERATED: {
    label: "Script Ready",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  SCENE_GENERATED: {
    label: "Scenes Ready",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  ASSEMBLING: {
    label: "Rendering…",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  FAILED: { label: "Failed", color: "text-red-400", bg: "bg-red-500/10" },
};

export default function ProjectsPage() {
  const { data: movies, isLoading } = useMovies();
  const deleteMovie = useDeleteMovie();
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-10">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
          <p className="text-base text-muted-foreground">
            Create and manage your AI-generated movies
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-lg shadow-purple-500/20"
        >
          <Plus className="size-4" /> New Movie
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="size-10 animate-spin text-purple-500" />
        </div>
      ) : !movies?.length ? (
        <div className="flex flex-col items-center py-24 text-center space-y-6">
          <div className="p-5 rounded-2xl bg-purple-500/10">
            <Film className="size-12 text-purple-500" />
          </div>
          <h2 className="text-xl font-semibold">No projects yet</h2>
          <p className="text-base text-muted-foreground max-w-md">
            Create your first AI movie project.
          </p>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-500/20"
          >
            <Plus className="size-5" /> Create your first movie
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {movies.map((m) => {
            const s = STATUS[m.status];
            return (
              <div
                key={m.id}
                onClick={() => router.push(`/projects/${m.id}`)}
                className="group relative p-6 rounded-2xl border border-border bg-card hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 transition-all cursor-pointer"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("Delete?")) deleteMovie.mutate(m.id);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 className="size-4" />
                </button>
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-2.5 rounded-xl bg-purple-500/10">
                    <Film className="size-6 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">
                      {m.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {m.targetDurationMinutes} min
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-5 leading-relaxed">
                  {m.idea}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${s.color} ${s.bg}`}
                  >
                    {s.label}
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground/40 group-hover:text-purple-500 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showNew && (
        <NewMovieDialog
          onClose={() => setShowNew(false)}
          onCreate={(m) => router.push(`/projects/${m.id}`)}
        />
      )}
    </div>
  );
}

function NewMovieDialog({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (m: MovieProject) => void;
}) {
  const create = useCreateMovie();
  const [createdMovie, setCreatedMovie] = useState<MovieProject | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateMovieValues>({
    resolver: zodResolver(createMovieSchema),
    defaultValues: { targetDurationMinutes: 2 },
  });

  const dur = watch("targetDurationMinutes");

  const onSubmit = async (v: CreateMovieValues) => {
    const movie = await create.mutateAsync(v);
    setCreatedMovie(movie);
  };

  const handleContinue = () => {
    if (!createdMovie) return;
    onCreate(createdMovie);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg mx-4 p-8 rounded-2xl bg-card border border-border shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {createdMovie ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="size-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="size-8 text-emerald-400" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">
                  Project created successfully
                </h2>
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {createdMovie.title}
                  </span>{" "}
                  is ready. You can continue to generate and edit characters
                  next.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background/60 p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Title</span>
                <span className="font-medium text-right">
                  {createdMovie.title}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">
                  {createdMovie.targetDurationMinutes} min
                </span>
              </div>
              <div className="flex items-start justify-between gap-4 text-sm">
                <span className="text-muted-foreground shrink-0">Idea</span>
                <span className="font-medium text-right line-clamp-3">
                  {createdMovie.idea}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-border text-base font-medium hover:bg-muted"
              >
                Stay here
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-base font-semibold shadow-lg shadow-purple-500/20"
              >
                Continue to Characters
              </button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-bold">New Movie</h2>
              <p className="text-base text-muted-foreground">
                Describe your idea and AI will bring it to life
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Title</label>
                <input
                  {...register("title")}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-base focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  placeholder="e.g. Before the Echo"
                />
                {errors.title && (
                  <p className="text-sm text-red-400">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Your Movie Idea</label>
                <textarea
                  {...register("idea")}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-base focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none leading-relaxed"
                  placeholder="Describe the story, characters, themes…"
                />
                {errors.idea && (
                  <p className="text-sm text-red-400">{errors.idea.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">Duration</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 5].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setValue("targetDurationMinutes", d)}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                        dur === d
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {d} min
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-border text-base font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={create.isPending}
                  className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-base font-semibold disabled:opacity-50 shadow-lg shadow-purple-500/20"
                >
                  {create.isPending ? "Creating…" : "Create Project"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
