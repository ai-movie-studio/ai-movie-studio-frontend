import type { MovieProject, Scene, CharacterProfile, PipelineStep } from "@/app/types";

/**
 * Pure function that derives the current pipeline step from server state.
 * No side-effects, trivially testable.
 */
export function deriveStep(
  movie: MovieProject | undefined,
  scenes: Scene[] | undefined,
  characters: CharacterProfile[] | undefined,
): PipelineStep {
  if (!movie) return "characters";
  if (movie.status === "COMPLETED") return "render";
  if (scenes?.some((s) => s.videoUrl)) return "video";
  if (scenes?.some((s) => s.keyframeImageUrl)) return "storyboard";
  if (scenes?.length) return "scenes";
  if (movie.hasScript || movie.status === "SCRIPT_GENERATED") return "script";
  return "characters";
}
