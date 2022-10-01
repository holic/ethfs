import { ContractTransaction, ethers, Signer } from "ethers";

import { contentStore } from "../contracts";
import { PreparedFile } from "./prepareFile";

export const uploadFile = async (signer: Signer, file: PreparedFile) => {
  const transactions: ContractTransaction[] = [];

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
  // TODO: create file
};
