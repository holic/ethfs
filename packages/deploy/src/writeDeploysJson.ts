import fs from "node:fs/promises";
import path from "node:path";

import { Address } from "viem";

import { DeployResult } from "./deploy";

export type Deploys = {
  readonly [chainId: number]: {
    readonly [contractName: string]: Address;
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
  entries.push([deploy.chainId.toString(), deploy.contracts]);
  entries.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

  deploys = Object.fromEntries(entries);

  // TODO: write deployer
  // TODO: write block number

  console.log("writing to deploys.json");
  await fs.writeFile(deploysJsonPath, JSON.stringify(deploys, null, 2) + "\n");
}
