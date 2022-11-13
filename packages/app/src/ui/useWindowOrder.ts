import { useEffect, useMemo } from "react";
import createStore from "zustand";

type Store = {
  windowOrder: string[];
  focusWindow: (id: string) => void;
};

export const useStore = createStore<Store>((set, get) => ({
  windowOrder: [],
  focusWindow: (id) => {
    const { windowOrder } = get();
    const lastWindow = windowOrder[windowOrder.length - 1];
    if (lastWindow === id) return;
    set((state) => ({
      windowOrder: [...state.windowOrder.filter((x) => x !== id), id],
    }));
  },
}));

export const useWindowOrder = (id: string) => {
  const windowOrder = useStore((state) => state.windowOrder);
  const focusWindow = useStore((state) => state.focusWindow);
  useEffect(() => {
    focusWindow(id);
  }, [focusWindow, id]);
  return useMemo(
    () => ({
      focus: () => focusWindow(id),
      zIndex: windowOrder.indexOf(id),
    }),
    [id, focusWindow, windowOrder]
  );
};
