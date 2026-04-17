/**
 * Central query-key factory.
 * Every useQuery/invalidateQueries references this — no magic strings elsewhere.
 */
export const queryKeys = {
  movies: {
    all: ["movies"] as const,
    detail: (id: number) => ["movies", id] as const,
    script: (id: number) => ["movies", id, "script"] as const,
    final: (id: number) => ["movies", id, "final"] as const,
  },
  characters: {
    list: (movieId: number) => ["movies", movieId, "characters"] as const,
  },
  scenes: {
    list: (movieId: number) => ["movies", movieId, "scenes"] as const,
  },
  jobs: {
    list: (movieId: number) => ["movies", movieId, "jobs"] as const,
  },
} as const;
