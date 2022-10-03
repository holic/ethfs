import { BigNumberish, ethers } from "ethers";

import { contentStore } from "../contracts";
import { PreparedFile } from "./prepareFile";

// TODO: make this more accurate, estimate gas can't seem to calculate SSTORE2

export const estimateFileUploadGas = async (
  file: PreparedFile
): Promise<BigNumberish> => {
  const estimatedGasForContents = await Promise.all(
    file.contents.map((content) =>
      contentStore.estimateGas.addContent(ethers.utils.toUtf8Bytes(content))
    )
  );
  return estimatedGasForContents.reduce(
    (acc, gas) => acc.add(gas),
    ethers.BigNumber.from(0)
  );
};
