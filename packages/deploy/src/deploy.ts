import contentStoreBuild from "@ethfs/contracts/out/ContentStore.sol/ContentStore.json" assert { type: "json" };
import fileStoreBuild from "@ethfs/contracts/out/FileStore.sol/FileStore.json" assert { type: "json" };
import {
  Account,
  Address,
  Chain,
  Client,
  encodeDeployData,
  getCreate2Address,
  Hex,
  parseAbi,
  parseAbiItem,
  Transport,
} from "viem";
import { getBlockNumber, getChainId, getLogs } from "viem/actions";

import { salt } from "./common";
import { ensureContractsDeployed } from "./ensureContractsDeployed";
import { ensureDeployer } from "./ensureDeployer";

export type DeployResult = {
  readonly chainId: number;
  readonly contracts: {
    readonly ContentStore: {
      deployer: Address;
      address: Address;
      blockNumber: bigint;
    };
    readonly FileStore: {
      deployer: Address;
      address: Address;
      blockNumber: bigint;
    };
  };
};

export async function deploy(
  client: Client<Transport, Chain | undefined, Account>,
): Promise<DeployResult> {
  const chainId = client.chain?.id ?? (await getChainId(client));
  const deployer = await ensureDeployer(client);

  const contentStoreBytecode = encodeDeployData({
    bytecode: contentStoreBuild.bytecode.object as Hex,
    abi: parseAbi(["constructor(address)"]),
    args: [deployer],
  });
  const contentStore = getCreate2Address({
    from: deployer,
    bytecode: contentStoreBytecode,
    salt,
  });

  const fileStoreBytecode = encodeDeployData({
    bytecode: fileStoreBuild.bytecode.object as Hex,
    abi: parseAbi(["constructor(address)"]),
    args: [contentStore],
  });
  const fileStore = getCreate2Address({
    from: deployer,
    bytecode: fileStoreBytecode,
    salt,
  });

  const startBlock = await getBlockNumber(client);
  await ensureContractsDeployed({
    client,
    deployer,
    contracts: [
      {
        bytecode: contentStoreBytecode,
        label: "ContentStore",
      },
      {
        bytecode: fileStoreBytecode,
        label: "FileStore",
      },
    ],
  });

  const fromBlock = startBlock - 1000n;
  const deployLogs = await getLogs(client, {
    address: [contentStore, fileStore],
    event: parseAbiItem("event Deployed()"),
    fromBlock,
  });
  console.log("found", deployLogs.length, "deploy logs since block", fromBlock);

  const contentStoreDeployLog = deployLogs.find(
    (log) => log.address.toLowerCase() === contentStore.toLowerCase(),
  );
  if (!contentStoreDeployLog) {
    throw new Error("No `Deployed` event log found for `ContentStore`");
  }

  const fileStoreDeployLog = deployLogs.find(
    (log) => log.address.toLowerCase() === fileStore.toLowerCase(),
  );
  if (!fileStoreDeployLog) {
    throw new Error("No `Deployed` event log found for `FileStore`");
  }

  return {
    chainId,
    contracts: {
      ContentStore: {
        deployer,
        address: contentStore,
        blockNumber: contentStoreDeployLog.blockNumber,
      },
      FileStore: {
        deployer,
        address: fileStore,
        blockNumber: fileStoreDeployLog.blockNumber,
      },
    },
  };
}
