import { create } from "zustand";

interface UIStore {
    isLoading: boolean
    setLoading: (value: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
    isLoading: false,
    setLoading: (value) => set({ isLoading: value }),
}))