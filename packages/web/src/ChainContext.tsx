"use client";

import { createContext, ReactNode, useContext } from "react";
import { extractChain } from "viem";

import { SupportedChainIds, supportedChains } from "./supportedChains";

const ChainContext = createContext<SupportedChainIds | null>(null);

export function ChainProvider({
  chainId,
  children,
}: {
  chainId: SupportedChainIds;
  children: ReactNode;
}) {
  return (
    <ChainContext.Provider value={chainId}>{children}</ChainContext.Provider>
  );
}

export function useChain() {
  const chainId = useContext(ChainContext);
  if (!chainId) {
    throw new Error("useChain can only be used inside ChainProvider");
  }
  return extractChain({
    chains: supportedChains.map((c) => c.chain),
    id: chainId,
  });
}
