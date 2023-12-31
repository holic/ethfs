import { NextRequest, NextResponse } from "next/server";
import { goerli } from "viem/chains";

import { supportedChains } from "./supportedChains";

function isPathChainSpecific(pathname: string) {
  return pathname === "/" || /^\/api\//.test(pathname);
}

export function middleware(req: NextRequest) {
  if (isPathChainSpecific(req.nextUrl.pathname)) {
    // Next.js docs recommend `req.nextUrl.hostname` but this is `localhost` in Render
    const hostname = req.headers.get("host");
    const supportedChain = supportedChains.find((c) => c.hostname === hostname);
    // Default to Goerli if we don't find the hostname in our supported chains
    const chainId = supportedChain?.chain.id ?? goerli.id;
    const url = req.nextUrl.clone();
    url.pathname = `/${chainId}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
}
