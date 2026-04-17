const m = (id: number) => `/v1/movies/${id}`;

export const endpoints = {
  auth: {
    login:    "/v1/auth/login",
    register: "/v1/auth/register",
    refresh:  "/v1/auth/refresh",
    me:       "/v1/auth/me",
    logout:   "/v1/auth/logout",
  },
  movies: {
    list:   "/v1/movies",
    detail: (id: number) => m(id),
    script: (id: number) => `${m(id)}/script`,
    final:  (id: number) => `${m(id)}/final-movie`,
  },
  characters: {
    list:   (mid: number) => `${m(mid)}/characters`,
    detail: (mid: number, cid: number) => `${m(mid)}/characters/${cid}`,
  },
  scenes: {
    list:     (mid: number) => `${m(mid)}/scenes`,
    detail:   (mid: number, sid: number) => `${m(mid)}/scenes/${sid}`,
    finalize: (mid: number, sid: number) => `${m(mid)}/scenes/${sid}/finalize`,
  },
  generation: {
    jobs:        (mid: number) => `${m(mid)}/generation-jobs`,
    characters:  (mid: number) => `${m(mid)}/generation-jobs/characters`,
    script:      (mid: number) => `${m(mid)}/generation-jobs/script`,
    scenes:      (mid: number) => `${m(mid)}/generation-jobs/scenes`,
    portraits:   (mid: number) => `${m(mid)}/generation-jobs/portraits`,
    keyframes:   (mid: number) => `${m(mid)}/generation-jobs/keyframes`,
    video:       (mid: number) => `${m(mid)}/generation-jobs/video`,
    finalRender: (mid: number) => `${m(mid)}/generation-jobs/final-render`,
  },
} as const;
