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
  Transport,
} from "viem";
import { getChainId } from "viem/actions";

import { salt } from "./common";
import { ensureContractsDeployed } from "./ensureContractsDeployed";
import { ensureDeployer } from "./ensureDeployer";

export type DeployResult = {
  readonly chainId: number;
  readonly contracts: {
    readonly ContentStore: Address;
    readonly FileStore: Address;
  };
};

export async function deploy(
  client: Client<Transport, Chain | undefined, Account>
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

  return {
    chainId,
    contracts: {
      ContentStore: contentStore,
      FileStore: fileStore,
    },
  };
}
