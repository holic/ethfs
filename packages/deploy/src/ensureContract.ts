import { sendTransaction } from "@latticexyz/common";
import { wait } from "@latticexyz/common/utils";
import pRetry from "p-retry";
import {
  Account,
  Address,
  Chain,
  Client,
  concatHex,
  getCreate2Address,
  Hex,
  Transport,
} from "viem";
import { getBytecode } from "viem/actions";

import { salt } from "./common";

export async function ensureContract({
  client,
  deployer,
  bytecode,
  label = "contract",
}: {
  readonly client: Client<Transport, Chain | undefined, Account>;
  readonly deployer: Address;
  readonly bytecode: Hex;
  readonly label?: string;
}): Promise<readonly Hex[]> {
  const address = getCreate2Address({ from: deployer, salt, bytecode });

  const contractCode = await getBytecode(client, {
    address,
    blockTag: "pending",
  });
  if (contractCode) {
    console.log("found", label, "at", address);
    return [];
  }

  console.log("deploying", label, "at", address);
  return [
    await pRetry(
      () =>
        sendTransaction(client, {
          chain: client.chain ?? null,
          to: deployer,
          data: concatHex([salt, bytecode]),
        }),
      {
        retries: 3,
        onFailedAttempt: async (error) => {
          const delay = error.attemptNumber * 500;
          console.log(`failed to deploy ${label}, retrying in ${delay}ms...`);
          await wait(delay);
        },
      }
    ),
  ];
}
