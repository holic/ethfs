"use server";

import IFileStoreAbi from "@ethfs/contracts/out/IFileStore.sol/IFileStore.abi.json";
import deploys from "@ethfs/deploy/deploys.json";
import { createPublicClient, http } from "viem";
import { readContract } from "viem/actions";

import { rpcs } from "../../../../../../rpcs";

export async function getFileContents(
  chainId: number,
  filename: string,
): Promise<string> {
  const rpc = rpcs[chainId];
  if (!rpc) {
    throw new Error("Unsupported chain");
  }

  const publicClient = createPublicClient({
    transport: http(rpc),
  });

  // TODO: handle reverts (e.g. FileNotFound)
  const contents = await readContract(publicClient, {
    address: deploys[chainId].FileStore,
    abi: IFileStoreAbi,
    functionName: "readFile",
    args: [filename],
  });

  return contents;
}