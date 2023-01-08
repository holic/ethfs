import { Provider, Signer } from "@wagmi/core";
import { ContractTransaction, ethers } from "ethers";
import { Connector } from "wagmi";

import { contentStore, fileStore } from "../contracts";
import { targetChainId } from "../EthereumProviders";
import { PreparedFile } from "../file-upload/prepareFile";
import { BountyFile } from "../pages/api/bounties";
import { pluralize } from "../pluralize";
import { switchChain } from "../switchChain";

export const createFile = async (
  connector: Connector<Provider, void, Signer>,
  file: BountyFile,
  onProgress: (message: string) => void
) => {
  onProgress("Switching networks…");
  await switchChain(connector, targetChainId);

  const signer = await connector.getSigner({ chainId: targetChainId });

  onProgress("Checking filename…");
  if (await fileStore.fileExists(file.name)) {
    throw new Error("Filename already exists");
  }

  onProgress(`Creating file…`);
  const createFileTx = await fileStore
    .connect(signer)
    ["createFile(string,bytes32[],bytes)"](
      file.name,
      file.checksums,
      ethers.utils.toUtf8Bytes(JSON.stringify(file.metadata))
    );
  console.log("create file tx", createFileTx);

  onProgress(`Waiting for transaction…`);
  const createFileReceipt = await createFileTx.wait();
  console.log("create file receipt", createFileReceipt);
};
