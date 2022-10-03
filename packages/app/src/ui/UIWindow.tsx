import React from "react";

type Props = {
  titleBar: React.ReactNode;
  statusBar: React.ReactNode;
  children: React.ReactNode;
};

// UIWindow instead of Window to avoid clashing with the built-in Window type
export const UIWindow = ({ titleBar, statusBar, children }: Props) => {
  return (
    <div className="w-full h-full flex-grow flex flex-col gap-1 p-1 bg-stone-600 text-white shadow-hard">
      <div className="p-3 flex justify-between items-center font-bold text-xl leading-none">
        {titleBar}
      </div>

      <div className="flex-grow flex flex-col bg-white text-black">
        <div className="flex-grow flex flex-col">{children}</div>
        <div className="flex justify-between items-center border-t-2 border-stone-400 bg-stone-200 text-stone-500 text-base leading-none px-3 py-1">
          {statusBar}
        </div>
      </div>
    </div>
  );
};
