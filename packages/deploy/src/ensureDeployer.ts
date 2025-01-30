import { Account, Address, Chain, Client, Transport } from "viem";
import { getChainId, getCode } from "viem/actions";

export async function ensureDeployer(
  client: Client<Transport, Chain | undefined, Account>,
): Promise<Address> {
  const chainId = client.chain?.id ?? (await getChainId(client));

  const deployer = "0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7";
  const bytecode = await getCode(client, {
    address: "0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7",
  });
  if (!bytecode) {
    throw new Error(
      `Chain ID ${chainId} does not have a singleton factory deployed.\n\nLearn how to deploy one at <https://github.com/safe-global/safe-singleton-factory?tab=readme-ov-file#how-to-get-the-singleton-deployed-to-your-network>.`,
    );
  }

  console.log("found singleton factory deployment at", deployer);
  return deployer;
}
