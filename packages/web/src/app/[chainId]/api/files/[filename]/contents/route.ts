import IFileStoreAbi from "@ethfs/contracts/out/IFileStore.sol/IFileStore.abi.json";
import deploys from "@ethfs/deploy/deploys.json";
import { createPublicClient, http } from "viem";
import { readContract } from "viem/actions";

import { rpcs } from "../../../../../../rpcs";

export async function GET(
  req: Request,
  { params }: { params: { chainId: string; filename: string } },
) {
  const chainId = parseInt(params.chainId);
  if (!chainId) {
    throw new Error("Invalid chain ID");
  }

  const rpc = rpcs[parseInt(params.chainId)];
  if (!rpc) {
    throw new Error("Unsupported chain");
  }

  const publicClient = createPublicClient({
    transport: http(rpc),
  });

  const contents = await readContract(publicClient, {
    address: deploys[chainId].FileStore,
    abi: IFileStoreAbi,
    functionName: "readFile",
    args: [params.filename],
  });

  // TODO: handle reverts (e.g. FileNotFound)
  // TODO: look up metadata in DB for file type + encoding
  // TODO: add cache headers

  return Response.json({ contents });
}
