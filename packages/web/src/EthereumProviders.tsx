"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { ReactNode } from "react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

import { supportedChains } from "./supportedChains";
import { rpcs } from "./rpcs";

const { chains, publicClient } = configureChains(supportedChains, [
  jsonRpcProvider({
    rpc: (chain) => ({
      http: rpcs[chain.id],
    }),
  }),
  publicProvider(),
]);

const { connectors } = getDefaultWallets({
  appName: "EthFS",
  projectId: "bbc87dca59c4e2ac827da9083052f194",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export function EthereumProviders({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={lightTheme({
          borderRadius: "none",
          accentColor: "#57534e",
          fontStack: "system",
        })}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
