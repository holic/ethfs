import { ContractTransaction, ethers, Signer } from "ethers";

import { contentStore, fileStore } from "../contracts";
import { pluralize } from "../pluralize";
import { PreparedFile } from "./prepareFile";

export const uploadFile = async (
  signer: Signer,
  file: PreparedFile,
  onProgress: (message: string) => void
) => {
  onProgress("Checking filename…");
  if (await fileStore.fileExists(file.name)) {
    throw new Error("Filename already exists");
  }

  onProgress("Looking up checksums…");
  const checksums = file.contents.map((content) =>
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(content))
  );
  // TODO: multicall
  const chunksToUpload = (
    await Promise.all(
      file.contents.map(async (content, i) => {
        const checksumExists = await contentStore.checksumExists(checksums[i]);
        console.log("checksum exists?", checksums[i], checksumExists);
        if (checksumExists) {
          return;
        }
        return content;
      })
    )
  ).filter((content): content is string => content != null);

  const transactions: ContractTransaction[] = [];
  for (const [i, content] of chunksToUpload.entries()) {
    // Kick off transactions serially, so that rejecting one will stop the rest
    // from being executed.
    // TODO: check if content has already been uploaded
    onProgress(`Uploading chunk ${i + 1} of ${chunksToUpload.length}…`);
    const tx = await contentStore
      .connect(signer)
      .addContent(ethers.utils.toUtf8Bytes(content));
    transactions.push(tx);
  }

  let receiptsPending = transactions.length;
  onProgress(
    `Waiting for ${pluralize(receiptsPending, "transaction", "transactions")}…`
  );
  const receipts = await Promise.all(
    transactions.map(async (tx) => {
      const receipt = await tx.wait();
      onProgress(
        `Waiting for ${pluralize(
          --receiptsPending,
          "transaction",
          "transactions"
        )}…`
      );
      return receipt;
    })
  );
  console.log("got add contents results", receipts);

  onProgress(`Creating file…`);
  const createFileTx = await fileStore
    .connect(signer)
    ["createFile(string,bytes32[],bytes)"](
      file.name,
      checksums,
      ethers.utils.defaultAbiCoder.encode(
        ["string", "string", "string"],
        [
          file.metadata.type,
          file.metadata.encoding,
          file.metadata.compression ?? "",
        ]
      )
    );
  console.log("create file tx", createFileTx);

  onProgress(`Waiting for transaction…`);
  const createFileReceipt = await createFileTx.wait();
  console.log("create file receipt", createFileReceipt);
};
