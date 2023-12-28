import { Account, Address, Chain, Client, Hex, Transport } from "viem";
import { waitForTransactionReceipt } from "viem/actions";

import { ensureContract } from "./ensureContract";

export async function ensureContractsDeployed({
  client,
  deployer,
  contracts,
}: {
  readonly client: Client<Transport, Chain | undefined, Account>;
  readonly deployer: Address;
  readonly contracts: readonly { readonly bytecode: Hex; label?: string }[];
}): Promise<readonly Hex[]> {
  const txs = (
    await Promise.all(
      contracts.map((contract) =>
        ensureContract({ client, deployer, ...contract }),
      ),
    )
  ).flat();

  if (txs.length) {
    console.log("waiting for contracts");
    // wait for each tx separately/serially, because parallelizing results in RPC errors
    for (const tx of txs) {
      await waitForTransactionReceipt(client, { hash: tx });
      // TODO: throw if there was a revert?
    }
  }

  return txs;
}
