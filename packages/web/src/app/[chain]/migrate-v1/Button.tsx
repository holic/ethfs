import { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { PendingIcon } from "../../../icons/PendingIcon";

type ButtonProps = Omit<ComponentProps<"button">, "children">;

type Props = ButtonProps & {
  label: ReactNode;
  hoverLabel?: ReactNode;
};

export function Button({
  label,
  hoverLabel,
  className,
  ...buttonProps
}: Props) {
  return (
    <button
      className={twMerge(
        "group bg-lime-600 text-white",
        "transition hover:brightness-125",
        "aria-busy:cursor-default",
        "aria-disabled:cursor-not-allowed aria-disabled:bg-stone-400 aria-disabled:text-white/60",
        className,
      )}
      {...buttonProps}
    >
      <span className="pointer-events-none inline-grid place-items-center overflow-hidden px-[.75em] py-[0.5em]">
        <span
          className={twMerge(
            "col-start-1 row-start-1 leading-none",
            "transition translate-y-0 opacity-100",
            hoverLabel
              ? "group-hover:-translate-y-3 group-hover:opacity-0"
              : null,
            "group-aria-busy:-translate-y-3 group-aria-busy:opacity-0",
          )}
        >
          {label}
        </span>
        {hoverLabel ? (
          <span
            aria-hidden
            className={twMerge(
              "col-start-1 row-start-1 leading-none",
              "transition translate-y-3 opacity-0",
              "group-hover:translate-y-0 group-hover:opacity-100",
              "group-aria-busy:-translate-y-3 group-aria-busy:opacity-0",
            )}
          >
            {hoverLabel}
          </span>
        ) : null}
        <span
          aria-hidden
          className={twMerge(
            "col-start-1 row-start-1 leading-none",
            "transition translate-y-3 opacity-0",
            "group-aria-busy:translate-y-0 group-aria-busy:opacity-100",
          )}
        >
          <PendingIcon />
        </span>
      </span>
    </button>
  );
}
