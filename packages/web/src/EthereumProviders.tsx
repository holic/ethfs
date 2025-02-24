"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Chain } from "viem";
import { createConfig, http, WagmiProvider } from "wagmi";

import { supportedChains } from "./supportedChains";

const chains = supportedChains.map((c) => c.chain) as unknown as readonly [
  Chain,
  ...Chain[],
];

const transports = Object.fromEntries(
  supportedChains.map((c) => [c.chain.id, http(c.rpcUrl)]),
);

const { connectors } = getDefaultWallets({
  appName: "EthFS",
  projectId: "bbc87dca59c4e2ac827da9083052f194",
});

export const wagmiConfig = createConfig({
  chains,
  transports,
  connectors,
});

const queryClient = new QueryClient();

export function EthereumProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider
          theme={lightTheme({
            borderRadius: "none",
            accentColor: "#57534e",
            fontStack: "system",
          })}
        >
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
