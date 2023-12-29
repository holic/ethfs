"use client";

import { createContext, ReactNode, useContext } from "react";
import { Chain } from "viem";

import { supportedChains } from "./supportedChains";

const ChainContext = createContext<Chain | null>(null);

export function ChainProvider({
  chainId,
  children,
}: {
  chainId: number;
  children: ReactNode;
}) {
  const chain = supportedChains
    .map((c) => c.chain)
    .find((c) => c.id === chainId);
  // TODO: improve this
  if (!chain) throw new Error("Unsupported chain");

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
