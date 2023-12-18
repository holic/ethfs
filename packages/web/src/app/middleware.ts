import { NextRequest, NextResponse } from "next/server";

import { includes } from "../includes";

const hostnameToChainId = {
  "ethfs.xyz": 1,
  "goerli.ethfs.xyz": 5,
};

const hostnames = Object.keys(
  hostnameToChainId,
) as (keyof typeof hostnameToChainId)[];

export function middleware(req: NextRequest) {
  // Don't rewite Next build files
  if (req.nextUrl.pathname.includes("_next")) return;
  // Don't rewite public files
  if (/\.[^/]+$/.test(req.nextUrl.pathname)) return;
  // Don't rewrite requests to specific chain
  // This helps with e.g. API requests from chain-specific hostnames
  // TODO: make sure we add meta tags to point to the authoritative content source to avoid dupe content
  if (/^\/\d+\//.test(req.nextUrl.pathname)) return;

  if (includes(hostnames, req.nextUrl.hostname)) {
    const chainId = hostnameToChainId[req.nextUrl.hostname];
    const url = req.nextUrl.clone();
    url.pathname = `/${chainId}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
}
