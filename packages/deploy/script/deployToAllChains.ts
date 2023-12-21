import "dotenv/config";

import { createWalletClient, http, isHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { goerli, sepolia } from "viem/chains";
import { z } from "zod";

import { deploy } from "../src/deploy";
import { writeDeploysJson } from "../src/writeDeploysJson";
import { parseEnv } from "./parseEnv";

const envSchema = z.object({
  DEPLOYER_PRIVATE_KEY: z.string().refine(isHex),
});

const env = parseEnv(envSchema);

const chains = [goerli, sepolia];
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
    const deployResult = await deploy(client);
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
