// deploy.ts

import "dotenv/config";

import { createWalletClient, http, isHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { z } from "zod";
import * as allChains from "viem/chains";

import { deploy, VerifierConfig } from "../src/deploy";
import { parseEnv } from "./parseEnv";
import { writeDeploysJson } from "../src/writeDeploysJson";

// Define the schema for environment variables using Zod
const envSchema = z.object({
  // RPC URL for the target chain
  RPC_HTTP_URL: z.string().url({
    message: "RPC_HTTP_URL must be a valid URL.",
  }),

  // Name of the chain to deploy to (e.g., "mainnet", "sepolia", "shape", etc.)
  CHAIN_NAME: z.string({
    required_error: "CHAIN_NAME is required.",
    invalid_type_error: "CHAIN_NAME must be a string.",
  }),

  // Deployer's private key in hexadecimal format
  DEPLOYER_PRIVATE_KEY: z
    .string({
      required_error: "DEPLOYER_PRIVATE_KEY is required.",
      invalid_type_error: "DEPLOYER_PRIVATE_KEY must be a string.",
    })
    .refine(isHex, {
      message: "DEPLOYER_PRIVATE_KEY must be a valid hex string.",
    }),

  // Type of verifier to use: "blockscout" or "etherscan"
  VERIFIER: z.enum(["blockscout", "etherscan"], {
    required_error: "VERIFIER is required.",
    invalid_type_error: 'VERIFIER must be either "blockscout" or "etherscan".',
  }),

  // API key for the chosen verifier
  VERIFIER_API_KEY: z.string({
    required_error: "VERIFIER_API_KEY is required.",
    invalid_type_error: "VERIFIER_API_KEY must be a string.",
  }),

  // Verifier URL, required only if VERIFIER is "blockscout"
  VERIFIER_URL: z
    .string({
      invalid_type_error: "VERIFIER_URL must be a string.",
    })
    .url({
      message: "VERIFIER_URL must be a valid URL.",
    })
    .optional(),
});

// Parse and validate environment variables
const env = parseEnv(envSchema);

// Convert CHAIN_NAME to lowercase for case-insensitive matching
const targetChainName = env.CHAIN_NAME.toLowerCase();

// Dynamically find the target chain from allChains based on CHAIN_NAME
const targetChain = Object.values(allChains).find(
  (chain) => chain.name.toLowerCase() === targetChainName
);

// If the target chain is not supported, exit with an error
if (!targetChain) {
  console.error(
    `Unsupported CHAIN_NAME: "${env.CHAIN_NAME}". Please check your .env file for a valid chain name.`
  );
  process.exit(1);
}

const rpcUrl = env.RPC_HTTP_URL;

// If RPC_HTTP_URL_{chain.id} is not set, exit with an error
if (!rpcUrl) {
  console.error(
    `RPC URL for chain "${targetChain.name}" (ID: ${targetChain.id}) is not set. Please define RPC_HTTP_URL in your .env file.`
  );
  process.exit(1);
}

// Initialize the deployer's account using the private key
const account = privateKeyToAccount(env.DEPLOYER_PRIVATE_KEY);

// Create a wallet client for the target chain
const client = createWalletClient({
  chain: targetChain,
  transport: http(rpcUrl),
  account,
});

// Determine the appropriate VerifierConfig based on VERIFIER
let verifierConfig: VerifierConfig;

if (env.VERIFIER === "blockscout") {
  // Ensure VERIFIER_URL is provided for Blockscout
  if (!env.VERIFIER_URL) {
    console.error(
      "VERIFIER_URL is required for Blockscout verification but is not set in the .env file."
    );
    process.exit(1);
  }

  verifierConfig = {
    type: "blockscout",
    url: env.VERIFIER_URL,
    apiKey: env.VERIFIER_API_KEY,
  };

  console.log("Using Blockscout for verification.");
} else if (env.VERIFIER === "etherscan") {
  verifierConfig = {
    type: "etherscan",
    apiKey: env.VERIFIER_API_KEY,
  };

  console.log("Using Etherscan for verification.");
} else {
  // This block should never be reached due to Zod's enum validation
  console.error(
    `Unsupported VERIFIER type: "${env.VERIFIER}". Supported types are "blockscout" and "etherscan".`
  );
  process.exit(1);
}

// Execute the deployment process
deploy(client, verifierConfig)
  .then(async (deployResult) => {
    console.log("Deployment successful!");
    // Write the deployment result to deploys.json
    await writeDeploysJson(deployResult);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
