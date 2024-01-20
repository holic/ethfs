import {
  base,
  baseGoerli,
  baseSepolia,
  goerli,
  holesky,
  mainnet,
  optimism,
  optimismGoerli,
  optimismSepolia,
  sepolia,
} from "viem/chains";

import { ChainConstants, toChainConstants } from "./common";

// TODO: combine with deploys

type SupportedChain = {
  readonly chain: ChainConstants;
  readonly slug: string;
  readonly rpcUrl: string;
};

export const supportedChains = [
  /* Ethereum */
  {
    chain: toChainConstants(mainnet),
    slug: "mainnet",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_1!,
  },
  {
    chain: toChainConstants(goerli),
    slug: "goerli",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_5!,
  },
  {
    chain: toChainConstants(sepolia),
    slug: "sepolia",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_11155111!,
  },
  {
    chain: toChainConstants(holesky),
    slug: "holesky",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_17000!,
  },
  /* Base */
  {
    chain: toChainConstants(base),
    slug: "base",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_8453!,
  },
  {
    chain: toChainConstants(baseGoerli),
    slug: "base-goerli",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_84531!,
  },
  {
    chain: toChainConstants(baseSepolia),
    slug: "base-sepolia",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_84532!,
  },
  /* Optimism */
  {
    chain: toChainConstants(optimism),
    slug: "optimism",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_10!,
  },
  {
    chain: toChainConstants(optimismGoerli),
    slug: "optimism-goerli",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_420!,
  },
  {
    chain: toChainConstants(optimismSepolia),
    slug: "optimism-sepolia",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_11155420!,
  },
  /* Arbitrum */
  // {
  //   chain: toChainConstants(arbitrum),
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_42161!,
  // },
  // {
  //   chain: toChainConstants(arbitrumGoerli),
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_421613!,
  // },
  // {
  //   chain: toChainConstants(arbitrumSepolia),
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_421614!,
  // },
  /* TODO: Arbitrum Nova? */
  /* Polygon */
  // {
  //   chain: toChainConstants(polygon),
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_137!,
  // },
  // {
  //   chain: toChainConstants(polygonMumbai),
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_80001!,
  // },
  // {
  //   chain: toChainConstants(polygonZkEvm),
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_1101!,
  // },
  // {
  //   chain: toChainConstants(polygonZkEvmTestnet),
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_1442!,
  // },
] as const satisfies readonly SupportedChain[];
