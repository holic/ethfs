import IFileStoreAbi from "@ethfs/contracts/out/IFileStore.sol/IFileStore.abi.json";
import deploys from "@ethfs/deploy/deploys.json";
import { Hex, stringToHex } from "viem";
import { readContract, waitForTransaction, writeContract } from "wagmi/actions";

import { File } from "./getFiles";

export async function createFile(
  chainId: number,
  file: File,
  pointers: Hex[],
  onProgress: (message: string) => void,
) {
  const deploy = deploys[chainId];

  onProgress("Checking filename…");
  const fileExists = await readContract({
    chainId,
    address: deploy.contracts.FileStore.address,
    abi: IFileStoreAbi,
    functionName: "fileExists",
    args: [file.name],
  });
  if (fileExists) {
    throw new Error("Filename already exists");
  }

  onProgress(`Creating file…`);

  const { hash: tx } = await writeContract({
    chainId,
    address: deploy.contracts.FileStore.address,
    abi: IFileStoreAbi,
    functionName: "createFileFromPointers",
    args: [
      file.name,
      pointers,
      stringToHex(
        JSON.stringify({
          type: file.type ?? undefined,
          encoding: file.encoding ?? undefined,
          compression: file.compression ?? undefined,
          license: file.license ?? undefined,
        }),
      ),
    ],
  });
  console.log("create file tx", tx);

  onProgress(`Waiting for transaction…`);
  const receipt = await waitForTransaction({
    chainId,
    hash: tx,
  });
  console.log("create file receipt", receipt);
}
