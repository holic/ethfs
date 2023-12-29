import {
  arbitrum,
  arbitrumGoerli,
  arbitrumSepolia,
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
  polygon,
  polygonMumbai,
  polygonZkEvm,
  polygonZkEvmTestnet,
  sepolia,
} from "wagmi/chains";

// TODO: combine with deploys

type SupportedChain = {
  readonly chain: Chain;
  readonly hostname: string;
  readonly rpcUrl: string;
};

export const supportedChains = [
  /* Ethereum */
  // {
  //   hostname: "ethfs.xyz",
  //   chain: mainnet,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_1!,
  // },
  {
    hostname: "goerli.ethfs.xyz",
    chain: goerli,
    rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_5!,
  },
  // {
  //   hostname: "sepolia.ethfs.xyz",
  //   chain: sepolia,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_11155111!,
  // },
  // {
  //   hostname: "holesky.ethfs.xyz",
  //   chain: holesky,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_17000!,
  // },
  /* Base */
  // {
  //   hostname: "base.ethfs.xyz",
  //   chain: base,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_8453!,
  // },
  // {
  //   hostname: "base-goerli.ethfs.xyz",
  //   chain: baseGoerli,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_84531!,
  // },
  // {
  //   hostname: "base-sepolia.ethfs.xyz",
  //   chain: baseSepolia,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_84532!,
  // },
  /* Optimism */
  // {
  //   hostname: "optimism.ethfs.xyz",
  //   chain: optimism,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_10!,
  // },
  // {
  //   hostname: "optimism-goerli.ethfs.xyz",
  //   chain: optimismGoerli,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_420!,
  // },
  // {
  //   hostname: "optimism-sepolia.ethfs.xyz",
  //   chain: optimismSepolia,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_11155420!,
  // },
  /* Arbitrum */
  // {
  //   hostname: "arbitrum.ethfs.xyz",
  //   chain: arbitrum,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_42161!,
  // },
  // {
  //   hostname: "arbitrum-goerli.ethfs.xyz",
  //   chain: arbitrumGoerli,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_421613!,
  // },
  // {
  //   hostname: "arbitrum-sepolia.ethfs.xyz",
  //   chain: arbitrumSepolia,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_421614!,
  // },
  /* TODO: Arbitrum Nova? */
  /* Polygon */
  // {
  //   hostname: "polygon.ethfs.xyz",
  //   chain: polygon,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_137!,
  // },
  // {
  //   hostname: "polygon-mumbai.ethfs.xyz",
  //   chain: polygonMumbai,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_80001!,
  // },
  // {
  //   hostname: "polygon-zkevm.ethfs.xyz",
  //   chain: polygonZkEvm,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_1101!,
  // },
  // {
  //   hostname: "polygon-zkevm-testnet.ethfs.xyz",
  //   chain: polygonZkEvmTestnet,
  //   rpcUrl: process.env.NEXT_PUBLIC_RPC_HTTP_URL_1442!,
  // },
] as const satisfies readonly SupportedChain[];
