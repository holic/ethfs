import "dotenv/config";

import { createWalletClient, http, isHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { z } from "zod";

import { deploy } from "../src/deploy";
import { parseEnv } from "./parseEnv";

const envSchema = z.object({
  RPC_HTTP_URL: z.string(),
  DEPLOYER_PRIVATE_KEY: z.string().refine(isHex),
  ETHERSCAN_API_KEY: z.string(),
});

const env = parseEnv(envSchema);

const client = createWalletClient({
  transport: http(env.RPC_HTTP_URL),
  account: privateKeyToAccount(env.DEPLOYER_PRIVATE_KEY),
});

deploy(client, env.ETHERSCAN_API_KEY).then(
  () => {
    console.log("done!");
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
