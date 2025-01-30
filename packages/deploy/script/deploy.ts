import "dotenv/config";

import { createClient, http, isHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { z } from "zod";

import { deploy } from "../src/deploy";
import { verifierEnvSchema } from "../src/verifier";
import { parseEnv } from "./parseEnv";

const envSchema = z.intersection(
  z.object({
    RPC_HTTP_URL: z.string().url(),
    DEPLOYER_PRIVATE_KEY: z.string().refine(isHex),
  }),
  verifierEnvSchema,
);

// Parse and validate environment variables
const env = parseEnv(envSchema);

const account = privateKeyToAccount(env.DEPLOYER_PRIVATE_KEY);

const client = createClient({
  transport: http(env.RPC_HTTP_URL),
  account,
});

const verifierConfig =
  env.VERIFIER === "etherscan"
    ? {
        type: env.VERIFIER,
        url: env.VERIFIER_URL,
        apiKey: env.VERIFIER_API_KEY,
      }
    : {
        type: env.VERIFIER,
        url: env.VERIFIER_URL,
        apiKey: env.VERIFIER_API_KEY,
      };

// Execute the deployment process
deploy(client, verifierConfig)
  .then(() => {
    console.log("Deployment successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
