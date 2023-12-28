import { useEffect, useMemo } from "react";
import { create } from "zustand";

type Store = {
  windowStack: string[];
  focusWindow: (id: string) => void;
};

export const useStore = create<Store>((set, get) => ({
  windowStack: [],
  focusWindow: (id) => {
    const { windowStack } = get();
    const lastWindow = windowStack[windowStack.length - 1];
    if (lastWindow === id) return;
    set((state) => ({
      windowStack: [...state.windowStack.filter((x) => x !== id), id],
    }));
  },
}));

export function useWindowStack(id: string) {
  const windowStack = useStore((state) => state.windowStack);
  const focusWindow = useStore((state) => state.focusWindow);
  useEffect(() => {
    focusWindow(id);
  }, [focusWindow, id]);
  return useMemo(
    () => ({
      focus: () => focusWindow(id),
      zIndex: windowStack.indexOf(id),
    }),
    [id, focusWindow, windowStack],
  );
}
