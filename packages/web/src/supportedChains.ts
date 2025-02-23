import {
  base,
  baseSepolia,
  Chain,
  holesky,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
  shape,
  shapeSepolia,
  zora,
  zoraSepolia,
} from "wagmi/chains";

// TODO: combine with deploys

type SupportedChain = {
  readonly chain: Chain;
  readonly slug: string;
  readonly group: string;
  readonly rpcUrl: string;
};

export const supportedChains = [
  /* Ethereum */
  {
    chain: mainnet,
    slug: "mainnet",
    group: "Ethereum",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_1!,
  },
  {
    chain: sepolia,
    slug: "sepolia",
    group: "Ethereum",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_11155111!,
  },
  {
    chain: {
      ...holesky,
      // TODO: update viem to include this
      blockExplorers: {
        default: {
          name: "Etherscan",
          url: "https://holesky.etherscan.io",
        },
      },
    },
    slug: "holesky",
    group: "Ethereum",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_17000!,
  },
  /* Base */
  {
    chain: base,
    slug: "base",
    group: "Base",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_8453!,
  },
  {
    chain: baseSepolia,
    slug: "base-sepolia",
    group: "Base",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_84532!,
  },
  /* Optimism */
  {
    chain: optimism,
    slug: "optimism",
    group: "Optimism",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_10!,
  },
  {
    chain: optimismSepolia,
    slug: "optimism-sepolia",
    group: "Optimism",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_11155420!,
  },
  /* Shape */
  {
    chain: shape,
    slug: "shape",
    group: "Shape",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_360!,
  },
  {
    chain: shapeSepolia,
    slug: "shape-sepolia",
    group: "Shape",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_11011!,
  },
  /* Zora */
  {
    chain: zora,
    slug: "zora",
    group: "Zora",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_7777777!,
  },
  {
    chain: zoraSepolia,
    slug: "zora-sepolia",
    group: "Zora",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_999999999!,
  },

  /* Arbitrum */
  // {
  //   chain: arbitrum,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_42161!,
  // },
  // {
  //   chain: arbitrumSepolia,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_421614!,
  // },
  /* TODO: Arbitrum Nova? */
  /* Polygon */
  // {
  //   chain: polygon,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_137!,
  // },
  // {
  //   chain: polygonMumbai,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_80001!,
  // },
  // {
  //   chain: polygonZkEvm,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_1101!,
  // },
  // {
  //   chain: polygonZkEvmTestnet,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_1442!,
  // },
] as const satisfies readonly SupportedChain[];

export type SupportedChainIds = (typeof supportedChains)[number]["chain"]["id"];
