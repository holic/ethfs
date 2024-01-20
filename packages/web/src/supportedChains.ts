import {
  base,
  baseGoerli,
  baseSepolia,
  Chain,
  goerli,
  holesky,
  mainnet,
  optimism,
  optimismGoerli,
  optimismSepolia,
  sepolia,
} from "viem/chains";

// TODO: combine with deploys

type SupportedChain = {
  readonly chain: Chain;
  readonly slug: string;
  readonly rpcUrl: string;
};

export const supportedChains = [
  /* Ethereum */
  {
    chain: mainnet,
    slug: "mainnet",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_1!,
  },
  {
    chain: goerli,
    slug: "goerli",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_5!,
  },
  {
    chain: sepolia,
    slug: "sepolia",
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
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_17000!,
  },
  /* Base */
  {
    chain: base,
    slug: "base",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_8453!,
  },
  {
    chain: baseGoerli,
    slug: "base-goerli",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_84531!,
  },
  {
    chain: baseSepolia,
    slug: "base-sepolia",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_84532!,
  },
  /* Optimism */
  {
    chain: optimism,
    slug: "optimism",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_10!,
  },
  {
    chain: optimismGoerli,
    slug: "optimism-goerli",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_420!,
  },
  {
    chain: optimismSepolia,
    slug: "optimism-sepolia",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_11155420!,
  },
  /* Arbitrum */
  // {
  //   chain: arbitrum,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_42161!,
  // },
  // {
  //   chain: arbitrumGoerli,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_421613!,
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
