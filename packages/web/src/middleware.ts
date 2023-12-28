import { NextRequest, NextResponse } from "next/server";

import { includes } from "./includes";

const hostnameToChainId = {
  "ethfs.xyz": 1,
  "goerli.ethfs.xyz": 5,
  localhost: 5,
  "ethfs.vercel.app": 5,
};

const hostnames = Object.keys(
  hostnameToChainId,
) as (keyof typeof hostnameToChainId)[];

function isPathChainSpecific(pathname: string) {
  return pathname === "/" || /^\/api\//.test(pathname);
}

export function middleware(req: NextRequest) {
  if (
    includes(hostnames, req.nextUrl.hostname) &&
    isPathChainSpecific(req.nextUrl.pathname)
  ) {
    const chainId = hostnameToChainId[req.nextUrl.hostname];
    const url = req.nextUrl.clone();
    url.pathname = `/${chainId}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
}
