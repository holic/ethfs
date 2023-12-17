import React, { DetailedHTMLProps, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type DivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

type Props = DivProps;

export function FileListRow({ className, ...props }: Props) {
  return <div className={twMerge("grid grid-cols-12", className)} {...props} />;
}

export function FileName({ className, ...props }: Props) {
  return (
    <div className={twMerge("col-span-4 px-3 py-2", className)} {...props} />
  );
}

export function FileType({ className, ...props }: Props) {
  return (
    <div className={twMerge("col-span-3 px-3 py-2", className)} {...props} />
  );
}

export function FileSize({ className, ...props }: Props) {
  return (
    <div className={twMerge("col-span-2 px-3 py-2", className)} {...props} />
  );
}

export function FileCreated({ className, ...props }: Props) {
  return (
    <div className={twMerge("col-span-3 px-3 py-2", className)} {...props} />
  );
}
