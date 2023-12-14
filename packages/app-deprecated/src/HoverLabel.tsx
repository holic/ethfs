import { ReactNode } from "react";

type Props = {
  label: ReactNode;
  labelHover: ReactNode;
};

export const HoverLabel = ({ label, labelHover }: Props) => (
  <span className="inline-grid pointer-events-none overflow-hidden">
    <span className="row-start-1 col-start-1 transition opacity-100 translate-y-0 group-hover:-translate-y-3 group-hover:opacity-0">
      {label}
    </span>
    <span
      className="row-start-1 col-start-1 transition opacity-0 translate-y-3 group-hover:translate-y-0 group-hover:opacity-100"
      aria-hidden
    >
      {labelHover}
    </span>
  </span>
);
