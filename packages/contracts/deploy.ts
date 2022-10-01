import { spawnSync } from "child_process";
import { ethers } from "ethers";
import fs from "fs";

const env = (key: string) => {
  const value = process.env[key];
  if (value == null || value === "") {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const getChainName = () => {
  const { signal, status, error, stdout } = spawnSync("cast", [
    "chain",
    "--rpc-url",
    rpcUrl,
  ]);

  if (status) {
    throw new Error(`Get chain name failed with status ${status}`);
  }
  if (signal) {
    throw new Error(`Get chain name killed by signal ${signal}`);
  }
  if (error) {
    throw error;
  }
  return stdout.toString("utf-8").trim();
};

const rpcUrl = env("RPC_URL");
const chainId = env("CHAIN_ID");
const deployScript = "Deploy.s.sol";
const broadcastLogs = `./broadcast/${deployScript}/${chainId}/run-latest.json`;
const deployOutput = `${__dirname}/deploys/${getChainName()}.json`;

if (!fs.existsSync(deployOutput)) {
  const { signal, status, error } = spawnSync(
    "forge",
    [
      "script",
      `script/${deployScript}`,
      "--broadcast",
      "--chain-id",
      chainId,
      "--rpc-url",
      rpcUrl,
      "--private-key",
      env("DEPLOYER_PRIVATE_KEY"),
    ],
    {
      stdio: "inherit",
    }
  );

  if (status) {
    throw new Error(`Deploy script failed with status ${status}`);
  }
  if (signal) {
    throw new Error(`Deploy script killed by signal ${signal}`);
  }
  if (error) {
    throw error;
  }
}

const { transactions, receipts } = JSON.parse(
  fs.readFileSync(broadcastLogs).toString("utf-8")
);

const result: Record<
  string,
  {
    deployedTo: string;
    deployer: string;
    transactionHash: string;
    blockNumber: string;
    blockHash: string;
  }
> = {};

transactions.forEach((tx: any, i: number) => {
  const receipt = receipts[i];
  result[tx.contractName] = {
    deployedTo: receipt.contractAddress,
    deployer: receipt.from,
    transactionHash: receipt.transactionHash,
    blockNumber: ethers.BigNumber.from(receipt.blockNumber).toString(),
    blockHash: receipt.blockHash,
  };
});

fs.writeFileSync(deployOutput, JSON.stringify(result, null, 2));
