import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api-client";
import { queryKeys } from "@/app/lib/query-keys";
import { endpoints } from "@/app/lib/endpoints";
import type { CharacterProfile, CreateCharacterRequest } from "@/app/types";

export function useCharacters(movieId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.characters.list(movieId!),
    queryFn: async () =>
      (await apiClient.get<CharacterProfile[]>(endpoints.characters.list(movieId!))).data,
    enabled: !!movieId,
  });
}

export function useUpdateCharacter(movieId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ charId, data }: { charId: number; data: CreateCharacterRequest }) =>
      (await apiClient.put<CharacterProfile>(endpoints.characters.detail(movieId, charId), data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.characters.list(movieId) }),
  });
}

export function useDeleteCharacter(movieId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (charId: number) => {
      await apiClient.delete(endpoints.characters.detail(movieId, charId));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.characters.list(movieId) }),
  });
}
