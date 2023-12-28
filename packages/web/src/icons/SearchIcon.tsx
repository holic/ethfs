import { IconSVG, Props } from "./IconSVG";

export function SearchIcon(props: Props) {
  return (
    <IconSVG fill="none" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </IconSVG>
  );
}
