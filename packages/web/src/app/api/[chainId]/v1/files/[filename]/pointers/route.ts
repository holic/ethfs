"use server";

import { createPublicClient, Hex, http } from "viem";
import { readContract } from "viem/actions";

import { supportedChains } from "../../../../../../../supportedChains";
import { fileStoreAbi } from "./abi";
import { fileStoreDeploys } from "./deploys";

export async function getPointers(
  chainId: number,
  filename: string,
): Promise<Hex[]> {
  const deploy = fileStoreDeploys.find((d) => d.chain.id === chainId);
  if (!deploy) {
    throw new Error(`Chain ${chainId} not supported, no deploy`);
  }
  const supportedChain = supportedChains.find((c) => c.chain.id === chainId);
  if (!supportedChain) {
    throw new Error(`Chain ${chainId} not supported, no RPC`);
  }

  const publicClient = createPublicClient({
    transport: http(supportedChain.rpcUrl),
  });

  // TODO: handle reverts (e.g. FileNotFound)
  const file = await readContract(publicClient, {
    address: deploy.address,
    abi: fileStoreAbi,
    functionName: "getFile",
    args: [filename],
  });

  return file.contents.map((c) => c.pointer);
}

export async function GET(
  req: Request,
  { params }: { params: { chainId: string; filename: string } },
) {
  const chainId = parseInt(params.chainId) || 0;
  const filename = params.filename;

  const data = await getPointers(chainId, filename);

  return Response.json(data);
}
