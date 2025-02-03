import "dotenv/config";

import { createWalletClient, http, isHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  // arbitrum,
  // arbitrumSepolia,
  base,
  baseSepolia,
  holesky,
  mainnet,
  optimism,
  optimismSepolia,
  // polygon,
  // polygonMumbai,
  // polygonZkEvm,
  // polygonZkEvmTestnet,
  sepolia,
  shape,
  shapeSepolia,
  zora,
  zoraSepolia,
} from "viem/chains";
import { z } from "zod";

import { deploy, VerifierConfig } from "../src/deploy";
import { parseEnv } from "./parseEnv";

const envSchema = z.object({
  DEPLOYER_PRIVATE_KEY: z.string().refine(isHex),
  ETHERSCAN_API_KEY: z.string(),
  BASESCAN_API_KEY: z.string(),
  OPTIMISM_ETHERSCAN_API_KEY: z.string(),
  SHAPE_VERIFIER_URL: z.string().optional(),
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
  shape,
  shapeSepolia,
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

    // Determine the appropriate VerifierConfig based on the chain ID
    let verifierConfig: VerifierConfig;

    if (chain.id === shape.id || chain.id === shapeSepolia.id) {
      // Shape chain ID
      verifierConfig = {
        type: "blockscout",
        url: env.SHAPE_VERIFIER_URL!,
      };
    } else if (chain.id === base.id || chain.id === baseSepolia.id) {
      // Base chains
      verifierConfig = {
        type: "etherscan",
        apiKey: env.BASESCAN_API_KEY!,
      };
    } else if (chain.id === optimism.id || chain.id === optimismSepolia.id) {
      // Optimism chains
      verifierConfig = {
        type: "etherscan",
        apiKey: env.OPTIMISM_ETHERSCAN_API_KEY!,
      };
    } else {
      // Default Etherscan
      verifierConfig = {
        type: "etherscan",
        apiKey: env.ETHERSCAN_API_KEY!,
      };
    }

    try {
      await deploy(client, verifierConfig);
      console.log(`Successfully deployed to chain ${chain.id} (${chain.name})`);
    } catch (error) {
      console.error(
        `Failed to deploy to chain ${chain.id} (${chain.name}):`,
        error,
      );
    }
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
