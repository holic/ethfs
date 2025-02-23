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

// Prepare chains and transports as before
const chains = supportedChains.map((c) => c.chain) as unknown as [
  Chain,
  ...Chain[],
];
const transports = supportedChains.reduce<
  Record<number, ReturnType<typeof http>>
>((acc, supportedChain) => {
  acc[supportedChain.chain.id] = http(supportedChain.rpcUrl);
  return acc;
}, {});

const { connectors } = getDefaultWallets({
  appName: "EthFS",
  projectId: "bbc87dca59c4e2ac827da9083052f194",
});

// Create Wagmi config (no need to pass the React Query client here)
export const config = createConfig({
  chains,
  transports,
  connectors,
});

export const queryClient = new QueryClient();

export function EthereumProviders({ children }: { children: ReactNode }) {
  return (
    // Wrap the whole provider tree in QueryClientProvider:
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider
          initialChain={chains[0]}
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
