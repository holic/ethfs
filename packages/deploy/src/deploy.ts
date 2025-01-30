import fileStoreBuild from "@ethfs/contracts/out/FileStore.sol/FileStore.json" assert { type: "json" };
import { execa } from "execa";
import {
  Account,
  Address,
  Chain,
  Client,
  concatHex,
  encodeAbiParameters,
  getCreate2Address,
  Hex,
  parseAbiItem,
  parseAbiParameters,
  Transport,
} from "viem";
import { getChainId, getLogs } from "viem/actions";

import { salt } from "./common";
import { ensureContractsDeployed } from "./ensureContractsDeployed";
import { ensureDeployer } from "./ensureDeployer";
import { writeDeploysJson } from "./writeDeploysJson";

export type DeployResult = {
  readonly chainId: number;
  readonly deployer: Address;
  readonly contracts: {
    readonly FileStore: {
      readonly address: Address;
      readonly blockNumber: bigint;
    };
  };
};

export type VerifierConfig =
  | { type: "etherscan"; apiKey: string }
  | { type: "blockscout"; url: string };

export async function deploy(
  client: Client<Transport, Chain | undefined, Account>,
  verifier: VerifierConfig,
): Promise<DeployResult> {
  const chainId = client.chain?.id ?? (await getChainId(client));
  const deployer = await ensureDeployer(client);

  const fileStoreConstructorArgs = encodeAbiParameters(
    parseAbiParameters("address"),
    [deployer],
  );
  const fileStoreBytecode = concatHex([
    fileStoreBuild.bytecode.object as Hex,
    fileStoreConstructorArgs,
  ]);

  const fileStore = getCreate2Address({
    from: deployer,
    bytecode: fileStoreBytecode,
    salt,
  });

  // const startBlock = await getBlockNumber(client);
  await ensureContractsDeployed({
    client,
    deployer,
    contracts: [
      {
        bytecode: fileStoreBytecode,
        label: "FileStore",
      },
    ],
  });

  // TODO: find a way to do to get deployment without block range issues

  // const fromBlock = startBlock - 1000n;
  const fromBlock = "earliest";
  const deployLogs = await getLogs(client, {
    address: [fileStore],
    event: parseAbiItem("event Deployed()"),
    fromBlock,
  });
  console.log("found", deployLogs.length, "deploy logs since block", fromBlock);

  const fileStoreDeployLog = deployLogs.find(
    (log) => log.address.toLowerCase() === fileStore.toLowerCase(),
  );
  if (!fileStoreDeployLog) {
    throw new Error("No `Deployed` event log found for `FileStore`");
  }

  try {
    console.log("verifying FileStore");

    const verifierFlags: (string | string[])[] = [];
    if (verifier.type === "etherscan") {
      verifierFlags.push(["--verifier", verifier.type]);
      verifierFlags.push(["--etherscan-api-key", verifier.apiKey]);
    } else if (verifier.type === "blockscout") {
      verifierFlags.push(["--verifier", verifier.type]);
      verifierFlags.push(["--verifier-url", verifier.url]);
    }

    await execa(
      "forge",
      [
        ["verify-contract", fileStore, "src/FileStore.sol:FileStore"],
        ["--chain-id", `${chainId}`],
        ["--compiler-version", fileStoreBuild.metadata.compiler.version],
        ["--evm-version", fileStoreBuild.metadata.settings.evmVersion],
        [
          "--num-of-optimizations",
          `${fileStoreBuild.metadata.settings.optimizer.runs}`,
        ],
        ["--constructor-args", fileStoreConstructorArgs],
        "--watch",
        verifierFlags,
      ].flat(5),
      {
        cwd: `${__dirname}/../../contracts`,
        stdio: "inherit",
      },
    );

    // TODO: figure out how to get sourcify working, this gives a generic 500 with "Compiler error"
    // TODO: try to do this with sourcify API instead of forge?
    // await contracts$`forge verify-contract ${fileStore} src/FileStore.sol:FileStore --chain-id ${chainId} --compiler-version ${fileStoreBuild.metadata.compiler.version} --num-of-optimizations ${fileStoreBuild.metadata.settings.optimizer.runs} --constructor-args ${fileStoreConstructorArgs} --verifier sourcify --watch`;
  } catch (error) {
    console.error("could not verify FileStore, skipping for now", error);
  }

  const deployResult = {
    chainId,
    deployer,
    contracts: {
      FileStore: {
        address: fileStore,
        blockNumber: fileStoreDeployLog.blockNumber,
      },
    },
  };

  // Write the deployment results to a JSON file
  await writeDeploysJson(deployResult);

  return deployResult;
}
