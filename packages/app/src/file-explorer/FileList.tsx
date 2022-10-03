import classNames from "classnames";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";

type DivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

type Props = DivProps;

export const FileListRow = ({ className, ...props }: Props) => (
  <div className={classNames("grid grid-cols-12", className)} {...props} />
);

export const FileName = ({ className, ...props }: Props) => (
  <div className={classNames("col-span-4 px-3 py-2", className)} {...props} />
);

export const FileType = ({ className, ...props }: Props) => (
  <div className={classNames("col-span-3 px-3 py-2", className)} {...props} />
);

export const FileSize = ({ className, ...props }: Props) => (
  <div className={classNames("col-span-2 px-3 py-2", className)} {...props} />
);

export const FileCreated = ({ className, ...props }: Props) => (
  <div className={classNames("col-span-3 px-3 py-2", className)} {...props} />
);
