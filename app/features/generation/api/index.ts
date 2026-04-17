import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api-client";
import { queryKeys } from "@/app/lib/query-keys";
import { endpoints } from "@/app/lib/endpoints";
import type { GenerationJob, JobStatus } from "@/app/types";

/* ── Trigger mutations ───────────────────────────── */
function useGenMutation(movieId: number, endpointFn: (id: number) => string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      (await apiClient.post(endpointFn(movieId))).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.jobs.list(movieId) });
      qc.invalidateQueries({ queryKey: queryKeys.movies.detail(movieId) });
    },
  });
}

export const useGenerateCharacters = (id: number) => useGenMutation(id, endpoints.generation.characters);
export const useGenerateScript     = (id: number) => useGenMutation(id, endpoints.generation.script);
export const useGenerateScenes     = (id: number) => useGenMutation(id, endpoints.generation.scenes);
export const useGeneratePortraits  = (id: number) => useGenMutation(id, endpoints.generation.portraits);
export const useGenerateKeyframes  = (id: number) => useGenMutation(id, endpoints.generation.keyframes);
export const useGenerateVideos     = (id: number) => useGenMutation(id, endpoints.generation.video);
export const useGenerateFinalRender= (id: number) => useGenMutation(id, endpoints.generation.finalRender);

/* ── Poll jobs — auto-stops when all terminal ────── */
const TERMINAL: JobStatus[] = ["COMPLETED", "FAILED", "CANCELLED"];

export function useGenerationJobs(movieId: number | undefined, polling = false) {
  return useQuery({
    queryKey: queryKeys.jobs.list(movieId!),
    queryFn: async () =>
      (await apiClient.get<GenerationJob[]>(endpoints.generation.jobs(movieId!))).data,
    enabled: !!movieId,
    refetchInterval: (query) => {
      if (!polling) return false;
      const jobs = query.state.data;
      if (jobs && jobs.length > 0 && jobs.every((j) => TERMINAL.includes(j.status))) return false;
      return 4000;
    },
  });
}
