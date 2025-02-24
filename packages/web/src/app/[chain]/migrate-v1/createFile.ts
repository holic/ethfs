import IFileStoreAbi from "@ethfs/contracts/out/IFileStore.sol/IFileStore.abi.json";
import deploys from "@ethfs/deploy/deploys.json";
import { Hex, stringToHex, TransactionReceipt } from "viem";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";

import { wagmiConfig } from "../../../EthereumProviders";
import { File } from "./getFiles";

export async function createFile(
  chainId: number,
  file: File,
  pointers: Hex[],
  onProgress: (message: string) => void,
): Promise<TransactionReceipt> {
  const deploy = deploys[chainId];

  onProgress("Checking filename…");
  const fileExists = await readContract(wagmiConfig, {
    chainId,
    address: deploy.contracts.FileStore.address,
    abi: IFileStoreAbi,
    functionName: "fileExists",
    args: [file.name],
  });
  if (fileExists) {
    throw new Error("Filename exists. Was it already migrated?");
  }

  onProgress(`Creating file…`);

  // TODO: add progress messages for long running requests
  //       https://github.com/holic/a-fundamental-dispute/blob/f83ea42fa60c3b8667f6b0eb03a009d264219ba6/packages/app/src/MintButton.tsx#L118-L131

  const tx = await writeContract(wagmiConfig, {
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
  const receipt = await waitForTransactionReceipt(wagmiConfig, {
    chainId,
    hash: tx,
  });
  console.log("create file receipt", receipt);

  return receipt;
}
