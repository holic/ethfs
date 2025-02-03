import { createConfig } from "ponder";
import { http } from "viem";

import { FileStoreAbi } from "./abis/FileStoreAbi";

export default createConfig({
  networks: {
    mainnet: {
      chainId: 1,
      transport: http(process.env.RPC_HTTP_URL_1),
      pollingInterval: 12_000,
    },
    sepolia: {
      chainId: 11155111,
      transport: http(process.env.RPC_HTTP_URL_11155111),
      pollingInterval: 12_000,
    },
    holesky: {
      chainId: 17000,
      transport: http(process.env.RPC_HTTP_URL_17000),
      pollingInterval: 12_000,
    },
    base: {
      chainId: 8453,
      transport: http(process.env.RPC_HTTP_URL_8453),
      pollingInterval: 2_000,
    },
    baseSepolia: {
      chainId: 84532,
      transport: http(process.env.RPC_HTTP_URL_84532),
      pollingInterval: 2_000,
    },
    optimism: {
      chainId: 10,
      transport: http(process.env.RPC_HTTP_URL_10),
      pollingInterval: 2_000,
    },
    optimismSepolia: {
      chainId: 11155420,
      transport: http(process.env.RPC_HTTP_URL_11155420),
      pollingInterval: 2_000,
    },
    shape: {
      chainId: 360,
      transport: http(process.env.RPC_HTTP_URL_360),
      pollingInterval: 2_000,
    },
    shapeSepolia: {
      chainId: 11011,
      transport: http(process.env.RPC_HTTP_URL_11011),
      pollingInterval: 2_000,
    },
    zora: {
      chainId: 7777777,
      transport: http(process.env.RPC_HTTP_URL_7777777),
      pollingInterval: 2_000,
    },
    zoraSepolia: {
      chainId: 999999999,
      transport: http(process.env.RPC_HTTP_URL_999999999),
      pollingInterval: 2_000,
    },
  },
  contracts: {
    FileStore: {
      address: "0xFe1411d6864592549AdE050215482e4385dFa0FB",
      abi: FileStoreAbi,
      network: {
        mainnet: { startBlock: 18898263 },
        sepolia: { startBlock: 4986686 },
        holesky: { startBlock: 634049 },
        base: { startBlock: 8575423 },
        baseSepolia: { startBlock: 4384018 },
        optimism: { startBlock: 114171031 },
        optimismSepolia: { startBlock: 6069158 },
        shape: {startBlock: 8263268},
        shapeSepolia: {startBlock: 9670055},
        zora: { startBlock: 9623739 },
        zoraSepolia: { startBlock: 3930816 },
      },
    },
  },
});
