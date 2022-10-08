import React from "react";

import { useDraggable } from "./useDraggable";

type Props = {
  titleBar: React.ReactNode;
  statusBar: React.ReactNode;
  children: React.ReactNode;
  initialX?: number;
  initialY?: number;
  initialWidth?: number;
  initialHeight?: number;
};

// UIWindow instead of Window to avoid clashing with the built-in Window type
export const UIWindow = ({
  titleBar,
  statusBar,
  children,
  initialX = 0,
  initialY = 0,
  initialWidth = 600,
  initialHeight = 400,
}: Props) => {
  const { ref, x, y } = useDraggable<HTMLDivElement>({
    x: initialX,
    y: initialY,
  });
  return (
    <div
      ref={ref}
      className="absolute flex flex-col gap-1 p-1 bg-stone-600 text-white shadow-hard"
      style={{ left: x, top: y, width: initialWidth, height: initialHeight }}
    >
      <div
        className="p-3 flex justify-between items-center font-bold text-xl leading-none select-none cursor-move"
        data-draggable-handle
      >
        {titleBar}
      </div>

      <div className="flex-grow flex flex-col bg-white text-black">
        <div className="flex-grow flex flex-col relative">
          <div className="absolute inset-0 overflow-auto">{children}</div>
        </div>
        <div className="flex justify-between items-center border-t-2 border-stone-400 bg-stone-200 text-stone-500 text-base leading-none px-3 py-1">
          {statusBar}
        </div>
      </div>
    </div>
  );
};
