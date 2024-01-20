import { Chain } from "viem/chains";

export type ChainConstants = Pick<
  Chain,
  "id" | "name" | "network" | "nativeCurrency" | "rpcUrls"
>;

export function toChainConstants(chain: Chain): ChainConstants {
  const { id, name, network, nativeCurrency, rpcUrls } = chain;
  return { id, name, network, nativeCurrency, rpcUrls };
}

export type OnchainFile = {
  chainId: number;
  filename: string;
  createdAt: number;
  size: number;
  type: string | null;
  encoding: string | null;
  compression: string | null;
  license: string | null;
};
