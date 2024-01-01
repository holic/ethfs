"use server";

import FileStoreAbi from "@ethfs/contracts/out/FileStore.sol/FileStore.abi.json";
import deploys from "@ethfs/deploy/deploys.json";
import { createPublicClient, http } from "viem";
import { readContract } from "viem/actions";

import { supportedChains } from "../../../../../../supportedChains";

export async function getFileContents(
  chainId: number,
  filename: string,
): Promise<string> {
  const supportedChain = supportedChains.find((c) => c.chain.id === chainId);
  if (!supportedChain) {
    throw new Error("Unsupported chain");
  }

  const publicClient = createPublicClient({
    transport: http(supportedChain.rpcUrl),
  });

  // TODO: handle reverts (e.g. FileNotFound)
  const contents = await readContract(publicClient, {
    address: deploys[chainId].contracts.FileStore.address,
    abi: FileStoreAbi,
    functionName: "readFile",
    args: [filename],
  });

  return contents;
}
