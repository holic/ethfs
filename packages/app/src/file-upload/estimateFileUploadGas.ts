import { BigNumber, ethers } from "ethers";

import { contentStore } from "../contracts";
import { PreparedFile } from "./prepareFile";

export const estimateFileUploadGas = async (
  file: PreparedFile
): Promise<BigNumber> => {
  const estimatedGasForContents = await Promise.all(
    file.contents.map(async (content, i) => {
      const gas = await contentStore.estimateGas.addContent(
        ethers.utils.toUtf8Bytes(content)
      );
      console.log(
        `${file.name} chunk[${i}]: ${
          content.length
        } bytes = ${gas.toString()} gas (estimated)`
      );
      return gas;
    })
  );
  const total = estimatedGasForContents.reduce(
    (acc, gas) => acc.add(gas),
    ethers.BigNumber.from(0)
  );
  // TODO: gas for createFile, hard to estimate right now due to checksum validation
  console.log(`${file.name} total ${total.toString()} gas (estimated)`);
  return total;
};
