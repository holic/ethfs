import { NextRequest, NextResponse } from "next/server";
import { goerli } from "viem/chains";

import { supportedChains } from "./supportedChains";

function isPathChainSpecific(pathname: string) {
  return pathname === "/" || /^\/api\//.test(pathname);
}

export function middleware(req: NextRequest) {
  if (isPathChainSpecific(req.nextUrl.pathname)) {
    const supportedChain = supportedChains.find(
      (c) => c.hostname === req.nextUrl.hostname,
    );
    let chainId = supportedChain?.chain.id;
    // Default to Goerli if we don't find the hostname in our supported chains
    if (!chainId) {
      console.log(
        "middleware: no chain found for hostname",
        req.nextUrl.hostname,
      );
      chainId = goerli.id;
    }
    const url = req.nextUrl.clone();
    url.pathname = `/${chainId}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
}
