import fs from "node:fs/promises";
import path from "node:path";

import { Address } from "viem";

import { DeployResult } from "./deploy";

export type Deploys = {
  readonly [chainId: number]: {
    readonly deployer: Address;
    readonly contracts: {
      readonly [contractName: string]: {
        readonly address: Address;
        readonly blockNumber: bigint;
      };
    };
  };
};

const deploysJsonPath = path.join(__dirname, "..", "deploys.json");

export async function writeDeploysJson(deploy: DeployResult): Promise<void> {
  let deploys: Deploys = {};
  try {
    deploys = JSON.parse(await fs.readFile(deploysJsonPath, "utf-8"));
  } catch (error) {
    console.warn("Error while reading deploys.json, assuming empty", error);
  }

  const entries = Object.entries(deploys);
  entries.push([deploy.chainId.toString(), deploy]);
  entries.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

  deploys = Object.fromEntries(entries);

  console.log("writing to deploys.json");
  await fs.writeFile(
    deploysJsonPath,
    JSON.stringify(
      deploys,
      // TODO: use a standardized JSON bigint encoder
      (k, v) => (typeof v === "bigint" ? v.toString() : v),
      2,
    ) + "\n",
  );
}
