import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api-client";
import { queryKeys } from "@/app/lib/query-keys";
import { endpoints } from "@/app/lib/endpoints";
import type { Scene, UpdateSceneRequest } from "@/app/types";

export function useScenes(movieId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.scenes.list(movieId!),
    queryFn: async () =>
      (await apiClient.get<Scene[]>(endpoints.scenes.list(movieId!))).data,
    enabled: !!movieId,
  });
}

export function useUpdateScene(movieId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sceneId, data }: { sceneId: number; data: UpdateSceneRequest }) =>
      (await apiClient.patch<Scene>(endpoints.scenes.detail(movieId, sceneId), data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.scenes.list(movieId) }),
  });
}

export function useFinalizeScene(movieId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sceneId: number) =>
      (await apiClient.post<Scene>(endpoints.scenes.finalize(movieId, sceneId))).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.scenes.list(movieId) }),
  });
}
