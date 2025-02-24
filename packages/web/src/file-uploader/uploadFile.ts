import IFileStoreAbi from "@ethfs/contracts/out/IFileStore.sol/IFileStore.abi.json";
import deploys from "@ethfs/deploy/deploys.json";
import { concatHex, Hex, stringToHex } from "viem";
import {
  getBytecode,
  readContract,
  sendTransaction,
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";

import { wagmiConfig } from "../EthereumProviders";
import { pluralize } from "../pluralize";
import { contentToInitCode, getPointer, salt } from "./common";
import { PreparedFile } from "./prepareFile";

export async function uploadFile(
  chainId: number,
  preparedFile: PreparedFile,
  onProgress: (message: string) => void,
) {
  const deploy = deploys[chainId];

  onProgress("Checking filename…");
  const fileExists = await readContract(wagmiConfig, {
    chainId,
    address: deploy.contracts.FileStore.address,
    abi: IFileStoreAbi,
    functionName: "fileExists",
    args: [preparedFile.filename],
  });
  if (fileExists) {
    throw new Error("Filename already exists");
  }

  const pointers = preparedFile.contents.map((content) =>
    getPointer(deploy.deployer, content),
  );

  const transactions: Hex[] = [];
  // Kick off transactions serially, so that rejecting one will stop the rest from being executed.
  for (const [i, content] of preparedFile.contents.entries()) {
    onProgress(`Uploading chunk ${i + 1} of ${preparedFile.contents.length}…`);

    const existingBytecode = await getBytecode(wagmiConfig, {
      address: pointers[i],
    });
    if (existingBytecode) continue;

    const tx = await sendTransaction(wagmiConfig, {
      chainId,
      to: deploy.deployer,
      data: concatHex([salt, contentToInitCode(content)]),
    });
    transactions.push(tx);
  }

  let receiptsPending = transactions.length;
  onProgress(
    `Waiting for ${pluralize(receiptsPending, "transaction", "transactions")}…`,
  );
  const receipts = await Promise.all(
    transactions.map(async (tx) => {
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        chainId,
        hash: tx,
      });
      onProgress(
        `Waiting for ${pluralize(
          --receiptsPending,
          "transaction",
          "transactions",
        )}…`,
      );
      return receipt;
    }),
  );
  console.log("got add contents results", receipts);

  onProgress(`Creating file…`);

  const tx = await writeContract(wagmiConfig, {
    chainId,
    address: deploy.contracts.FileStore.address,
    abi: IFileStoreAbi,
    functionName: "createFileFromPointers",
    args: [
      preparedFile.filename,
      pointers,
      stringToHex(JSON.stringify(preparedFile.metadata)),
    ],
  });
  console.log("create file tx", tx);

  onProgress(`Waiting for transaction…`);
  const receipt = await waitForTransactionReceipt(wagmiConfig, {
    chainId,
    hash: tx,
  });
  console.log("create file receipt", receipt);
}
