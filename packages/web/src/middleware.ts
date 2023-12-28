import { NextRequest, NextResponse } from "next/server";

import { includes } from "./includes";

const hostnameToChainId = {
  "ethfs.xyz": 1,
  "goerli.ethfs.xyz": 5,
};

const hostnames = Object.keys(
  hostnameToChainId,
) as (keyof typeof hostnameToChainId)[];

function isPathChainSpecific(pathname: string) {
  return pathname === "/" || /^\/api\//.test(pathname);
}

export function middleware(req: NextRequest) {
  if (isPathChainSpecific(req.nextUrl.pathname)) {
    const chainId = includes(hostnames, req.nextUrl.hostname)
      ? hostnameToChainId[req.nextUrl.hostname]
      : 5;
    const url = req.nextUrl.clone();
    url.pathname = `/${chainId}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
}
