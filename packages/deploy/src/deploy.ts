import contentStoreBuild from "@ethfs/contracts/out/ContentStore.sol/ContentStore.json" assert { type: "json" };
import fileStoreBuild from "@ethfs/contracts/out/FileStore.sol/FileStore.json" assert { type: "json" };
import fileStoreFrontendBuild from "@ethfs/contracts/out/FileStoreFrontend.sol/FileStoreFrontend.json" assert { type: "json" };
import {
  Account,
  Chain,
  Client,
  encodeDeployData,
  getCreate2Address,
  Hex,
  parseAbi,
  Transport,
} from "viem";

import { salt } from "./common";
import { ensureContractsDeployed } from "./ensureContractsDeployed";
import { ensureDeployer } from "./ensureDeployer";

export async function deploy(
  client: Client<Transport, Chain | undefined, Account>
): Promise<void> {
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

  const fileStoreFrontendBytecode = encodeDeployData({
    bytecode: fileStoreFrontendBuild.bytecode.object as Hex,
    abi: [],
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
      {
        bytecode: fileStoreFrontendBytecode,
        label: "FileStoreFrontend",
      },
    ],
  });
}
