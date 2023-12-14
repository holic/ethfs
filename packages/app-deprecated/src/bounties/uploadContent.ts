import { Provider, Signer } from "@wagmi/core";
import { ethers } from "ethers";
import { Connector } from "wagmi";

import { contentStore } from "../contracts";
import { targetChainId } from "../EthereumProviders";
import { switchChain } from "../switchChain";

export const uploadContent = async (
  connector: Connector<Provider, void, Signer>,
  content: string,
  onProgress: (message: string) => void
) => {
  onProgress("Switching networks…");
  await switchChain(connector, targetChainId);

  const signer = await connector.getSigner({ chainId: targetChainId });

  onProgress("Looking up checksum…");
  const checksum = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(content));
  const checksumExists = await contentStore.checksumExists(checksum);
  if (checksumExists) {
    throw new Error("Content already uploaded");
  }

  onProgress("Uploading chunk…");
  const tx = await contentStore
    .connect(signer)
    .addContent(ethers.utils.toUtf8Bytes(content));
  console.log("tx", tx);

  const receipt = await tx.wait();
  onProgress("Waiting for transaction…");
  console.log("tx receipt", receipt);

  return { tx, receipt, checksum };
};
