import { ContractTransaction, ethers, Signer } from "ethers";

import { contentStore, fileStore } from "../contracts";
import { PreparedFile } from "./prepareFile";

export const uploadFile = async (signer: Signer, file: PreparedFile) => {
  const transactions: ContractTransaction[] = [];

  const checksums = file.contents.map((content) =>
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(content))
  );

  for (const content of file.contents) {
    // Kick off transactions serially, so that rejecting one will stop the rest
    // from being executed.
    // TODO: check if content has already been uploaded
    const tx = await contentStore
      .connect(signer)
      .addContent(ethers.utils.toUtf8Bytes(content));
    transactions.push(tx);
  }

  const receipts = await Promise.all(transactions.map((tx) => tx.wait()));
  console.log("got add contents results", receipts);

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

  const createFileReceipt = await createFileTx.wait();
  console.log("create file receipt", createFileReceipt);
};
