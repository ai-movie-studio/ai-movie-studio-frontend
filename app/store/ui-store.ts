import { create } from "zustand";
import type { PipelineStep } from "@/app/types";

/**
 * UI-only state. Server data lives in React Query.
 * This store holds things that have no backend equivalent.
 */
interface UIState {
  /** Manually overridden pipeline step (null = use auto-detected) */
  stepOverride: PipelineStep | null;
  setStepOverride: (step: PipelineStep | null) => void;

  /** Scene currently being edited inline */
  editingSceneId: number | null;
  setEditingSceneId: (id: number | null) => void;

  /** Expanded scene in the scenes list */
  expandedSceneId: number | null;
  setExpandedSceneId: (id: number | null) => void;

  /** Image preview modal */
  previewImageUrl: string | null;
  setPreviewImageUrl: (url: string | null) => void;

  reset: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  stepOverride: null,
  setStepOverride: (step) => set({ stepOverride: step }),

  editingSceneId: null,
  setEditingSceneId: (id) => set({ editingSceneId: id }),

  expandedSceneId: null,
  setExpandedSceneId: (id) => set({ expandedSceneId: id }),

  previewImageUrl: null,
  setPreviewImageUrl: (url) => set({ previewImageUrl: url }),

  reset: () =>
    set({
      stepOverride: null,
      editingSceneId: null,
      expandedSceneId: null,
      previewImageUrl: null,
    }),
}));
