import { getSingletonFactoryInfo } from "@safe-global/safe-singleton-factory";
import {
  Account,
  Address,
  Chain,
  Client,
  getAddress,
  Hex,
  Transport,
} from "viem";
import {
  getBytecode,
  getChainId,
  sendRawTransaction,
  sendTransaction,
  waitForTransactionReceipt,
} from "viem/actions";

export async function ensureDeployer(
  client: Client<Transport, Chain | undefined, Account>,
): Promise<Address> {
  const chainId = client.chain?.id ?? (await getChainId(client));
  const deployment = getSingletonFactoryInfo(chainId);
  if (!deployment) {
    throw new Error(
      `Chain ID ${chainId} not supported. Create an issue at <https://github.com/safe-global/safe-singleton-factory> and <https://github.com/holic/ethfs> to request this chain be added.`,
    );
  }

  const deployer = getAddress(deployment.address);
  const bytecode = await getBytecode(client, {
    address: deployer,
  });
  if (bytecode) {
    console.log("found singleton factory deployment at", deployer);
    return deployer;
  }

  // send gas to signer
  console.log(
    "sending gas for singleton factory deployment to signer at",
    deployment.signerAddress,
  );
  const gasTx = await sendTransaction(client, {
    chain: client.chain ?? null,
    to: deployment.signerAddress as Hex,
    value: BigInt(deployment.gasLimit) * BigInt(deployment.gasPrice),
  });
  const gasReceipt = await waitForTransactionReceipt(client, { hash: gasTx });
  if (gasReceipt.status !== "success") {
    console.error("failed to send gas to deployer signer", gasReceipt);
    throw new Error("failed to send gas to deployer signer");
  }

  // deploy the deployer
  console.log("deploying singleton factory at", deployer);
  const deployTx = await sendRawTransaction(client, {
    serializedTransaction: deployment.transaction as Hex,
  });
  const deployReceipt = await waitForTransactionReceipt(client, {
    hash: deployTx,
  });
  if (!deployReceipt.contractAddress) {
    console.error("no contract deployed", deployReceipt);
    throw new Error("no contract deployed");
  }
  if (getAddress(deployReceipt.contractAddress) !== deployer) {
    console.error("unexpected contract address for deployer", deployReceipt);
    throw new Error("unexpected contract address for deployer");
  }

  return deployer;
}
