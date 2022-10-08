import { useEffect, useRef, useState } from "react";

export type Position = { x: number; y: number };

export const useDraggable = <T extends HTMLElement>(
  initialPosition: Position = { x: 0, y: 0 }
) => {
  const ref = useRef<T | null>(null);
  const dragStart = useRef<Position | null>(null);
  const [{ x, y }, setPosition] = useState<Position>(initialPosition);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if (!ref.current) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!ref.current.contains(target)) return;
      if (!target.matches("[data-draggable-handle]")) return;

      dragStart.current = { x: event.x - x, y: event.y - y };
    };
    const onPointerUp = () => {
      dragStart.current = null;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (ref.current && dragStart.current) {
        setPosition({
          x: event.x - dragStart.current.x,
          y: event.y - dragStart.current.y,
        });
      }
    };
    const onTouchMove = (event: Event) => {
      if (dragStart.current) {
        event.preventDefault();
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [x, y]);

  return { ref, x, y };
};
