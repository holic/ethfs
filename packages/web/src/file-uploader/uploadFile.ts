import IContentStoreAbi from "@ethfs/contracts/out/IContentStore.sol/IContentStore.abi.json";
import IFileStoreAbi from "@ethfs/contracts/out/IFileStore.sol/IFileStore.abi.json";
import deploys from "@ethfs/deploy/deploys.json";
import {
  Account,
  Chain,
  Hex,
  stringToHex,
  Transport,
  WalletClient,
} from "viem";
import { readContract, waitForTransaction, writeContract } from "wagmi/actions";

import { pluralize } from "../pluralize";
import { PreparedFile } from "./prepareFile";

export async function uploadFile(
  chainId: number,
  walletClient: WalletClient<Transport, Chain, Account>,
  preparedFile: PreparedFile,
  onProgress: (message: string) => void,
) {
  onProgress("Checking filename…");
  const fileExists = await readContract({
    chainId,
    address: deploys[chainId].FileStore.address,
    abi: IFileStoreAbi,
    functionName: "fileExists",
    args: [preparedFile.filename],
  });
  if (fileExists) {
    throw new Error("Filename already exists");
  }

  onProgress("Splitting file into chunks…");
  const pointers = await Promise.all(
    preparedFile.contents.map(
      async (content) =>
        await readContract({
          chainId,
          address: deploys[walletClient.chain.id].ContentStore.address,
          abi: IContentStoreAbi,
          functionName: "getPointer",
          args: [stringToHex(content)],
        }),
    ),
  );

  const transactions: Hex[] = [];
  // Kick off transactions serially, so that rejecting one will stop the rest from being executed.
  for (const [i, content] of preparedFile.contents.entries()) {
    onProgress(`Uploading chunk ${i + 1} of ${preparedFile.contents.length}…`);

    const pointerExists = await readContract({
      chainId,
      address: deploys[walletClient.chain.id].ContentStore.address,
      abi: IContentStoreAbi,
      functionName: "pointerExists",
      args: [pointers[i]],
    });
    if (pointerExists) continue;

    const { hash: tx } = await writeContract({
      chainId,
      address: deploys[walletClient.chain.id].ContentStore.address,
      abi: IContentStoreAbi,
      functionName: "addContent",
      args: [stringToHex(content)],
    });
    transactions.push(tx);
  }

  let receiptsPending = transactions.length;
  onProgress(
    `Waiting for ${pluralize(receiptsPending, "transaction", "transactions")}…`,
  );
  const receipts = await Promise.all(
    transactions.map(async (tx) => {
      const receipt = await waitForTransaction({
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

  const { hash: tx } = await writeContract({
    chainId,
    address: deploys[chainId].FileStore.address,
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
  const receipt = await waitForTransaction({
    chainId,
    hash: tx,
  });
  console.log("create file receipt", receipt);
}
