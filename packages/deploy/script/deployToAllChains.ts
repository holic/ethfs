import "dotenv/config";

import { createWalletClient, http, isHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  holesky,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  polygonMumbai,
  polygonZkEvm,
  polygonZkEvmTestnet,
  sepolia,
  zora,
  zoraSepolia,
} from "viem/chains";
import { z } from "zod";

import { deploy } from "../src/deploy";
import { writeDeploysJson } from "../src/writeDeploysJson";
import { parseEnv } from "./parseEnv";

const envSchema = z.object({
  DEPLOYER_PRIVATE_KEY: z.string().refine(isHex),
  ETHERSCAN_API_KEY: z.string(),
  BASESCAN_API_KEY: z.string(),
  OPTIMISM_ETHERSCAN_API_KEY: z.string(),
});

const env = parseEnv(envSchema);

const chains = [
  mainnet,
  sepolia,
  holesky, // TODO: fix verification
  base,
  baseSepolia,
  optimism,
  optimismSepolia,
  zora,
  zoraSepolia,
  // arbitrum,
  // arbitrumSepolia,
  // polygon,
  // polygonMumbai,
  // polygonZkEvm,
  // polygonZkEvmTestnet,
  // TODO: redstone
];
const account = privateKeyToAccount(env.DEPLOYER_PRIVATE_KEY);

async function deployToAllChains() {
  for (const chain of chains) {
    const rpc = process.env[`RPC_HTTP_URL_${chain.id}`];
    const client = createWalletClient({
      chain,
      transport: rpc ? http(rpc) : http(),
      account,
    });
    console.log(`deploying to chain ${chain.id} (${chain.name})`);
    const deployResult = await deploy(
      client,
      (chain.id == 8453 || chain.id == 84532)
        ? env.BASESCAN_API_KEY
        : (chain.id == 10 || chain.id == 11155420)
          ? env.OPTIMISM_ETHERSCAN_API_KEY
          : env.ETHERSCAN_API_KEY,
    );
    await writeDeploysJson(deployResult);
  }
}

deployToAllChains().then(
  () => {
    console.log("done!");
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
