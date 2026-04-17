import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api-client";
import { queryKeys } from "@/app/lib/query-keys";
import { endpoints } from "@/app/lib/endpoints";
import type { MovieProject, CreateMovieRequest, FinalMovie } from "@/app/types";

export function useMovies() {
  return useQuery({
    queryKey: queryKeys.movies.all,
    queryFn: async () => (await apiClient.get<MovieProject[]>(endpoints.movies.list)).data,
  });
}

export function useMovie(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.movies.detail(id!),
    queryFn: async () => (await apiClient.get<MovieProject>(endpoints.movies.detail(id!))).data,
    enabled: !!id,
  });
}

export function useMovieScript(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.movies.script(id!),
    queryFn: async () =>
      (await apiClient.get<{ movieProjectId: number; scriptText: string }>(endpoints.movies.script(id!))).data,
    enabled: !!id,
  });
}

export function useFinalMovie(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.movies.final(id!),
    queryFn: async () => (await apiClient.get<FinalMovie>(endpoints.movies.final(id!))).data,
    enabled: !!id,
    retry: false,
  });
}

export function useCreateMovie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateMovieRequest) =>
      (await apiClient.post<MovieProject>(endpoints.movies.list, data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.movies.all }),
  });
}

export function useDeleteMovie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => { await apiClient.delete(endpoints.movies.detail(id)); },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.movies.all }),
  });
}
