"use client";

import { createContext, ReactNode, useContext } from "react";
import { Chain } from "viem";

const ChainContext = createContext<Chain | null>(null);

export function ChainProvider({
  chain,
  children,
}: {
  chain: Chain;
  children: ReactNode;
}) {
  return (
    <ChainContext.Provider value={chain}>{children}</ChainContext.Provider>
  );
}

export function useChain() {
  const chain = useContext(ChainContext);
  if (!chain) {
    throw new Error("useChain can only be used inside ChainProvider");
  }
  return chain;
}
