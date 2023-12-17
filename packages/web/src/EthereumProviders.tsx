"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { ReactNode } from "react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

const rpcs: { readonly [chainId: number]: string } = {
  [goerli.id]: process.env.NEXT_PUBLIC_RPC_HTTP_URL_5!,
};

const { chains, publicClient } = configureChains(
  [goerli],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: rpcs[chain.id],
      }),
    }),
    publicProvider(),
  ],
);

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
