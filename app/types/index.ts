/* ── Auth ──────────────────────────────────────────── */
export interface AuthResponse {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  issuedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface SessionUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

/* ── Movies ────────────────────────────────────────── */
export interface MovieProject {
  id: number;
  title: string;
  idea: string;
  status: MovieStatus;
  targetDurationMinutes: number;
  hasScript: boolean;
  scriptText?: string;
  createdAt: string;
  updatedAt: string;
}

export type MovieStatus =
  | "DRAFT"
  | "SCRIPT_GENERATED"
  | "SCENE_GENERATED"
  | "ASSEMBLING"
  | "COMPLETED"
  | "FAILED";

export interface CreateMovieRequest {
  title: string;
  idea: string;
  targetDurationMinutes: number;
}

/* ── Characters ────────────────────────────────────── */
export interface CharacterProfile {
  id: number;
  name: string;
  description?: string;
  hair?: string;
  eyes?: string;
  clothes?: string;
  style?: string;
  portraitUrl?: string;
}

export interface CreateCharacterRequest {
  name: string;
  description?: string;
  hair?: string;
  eyes?: string;
  clothes?: string;
  style?: string;
}

/* ── Scenes ────────────────────────────────────────── */
export interface Scene {
  id: number;
  sceneOrder: number;
  title?: string;
  description?: string;
  durationSeconds: number;
  status: SceneStatus;
  keyframeImageUrl?: string;
  videoUrl?: string;
  dialogue: DialogueLine[];
}

export type SceneStatus = "DRAFT" | "GENERATED" | "FINALIZED";

export interface DialogueLine {
  id?: number;
  lineOrder: number;
  characterId?: number;
  characterName?: string;
  dialogueText: string;
  direction?: string;
}

export interface UpdateSceneRequest {
  title?: string;
  description?: string;
  durationSeconds?: number;
}

/* ── Generation Jobs ───────────────────────────────── */
export interface GenerationJob {
  id: number;
  movieProjectId: number;
  jobType: GenerationJobType;
  status: JobStatus;
  sceneId?: number;
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export type GenerationJobType =
  | "CHARACTER_SUGGESTION" | "SCRIPT" | "SCENES"
  | "CHARACTER_PORTRAIT" | "KEYFRAME"
  | "SCENE_VIDEO" | "VOICE" | "MUSIC"
  | "FINAL_RENDER";

export type JobStatus =
  | "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface FinalMovie {
  movieProjectId: number;
  videoUrl?: string;
  status: string;
  durationSeconds?: number;
}

/* ── Pipeline UI ───────────────────────────────────── */
export type PipelineStep =
  | "characters" | "script" | "scenes"
  | "storyboard" | "video" | "render";
