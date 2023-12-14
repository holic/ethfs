import classNames from "classnames";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";

import { PendingIcon } from "./icons/PendingIcon";

const buttonClasses =
  "self-center transition text-white bg-sky-600 hover:bg-cyan-600 active:bg-cyan-700 peer-disabled:bg-slate-400 cursor-pointer peer-disabled:cursor-default px-6 py-3 rounded-lg text-xl flex";

type Props = {
  children: React.ReactNode;
  pending?: boolean;
};

type UploadButtonProps = Props &
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const UploadButton = ({
  pending,
  className,
  children,
  disabled,
  ...props
}: UploadButtonProps) => {
  return (
    <label>
      <input
        type="file"
        hidden
        disabled={disabled || pending}
        className="peer"
        {...props}
      />
      <span className={classNames(buttonClasses, className)}>
        {children}
        {pending ? (
          <span className="self-center ml-2 -mr-1">
            <PendingIcon />
          </span>
        ) : null}
      </span>
    </label>
  );
};
