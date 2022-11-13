import { BigNumber, ethers } from "ethers";

// import { contentStore } from "../contracts";
import { precomputedGasEstimates } from "./precomputedGasEstimates";
import { PreparedFile } from "./prepareFile";

// For big files, this can be generate a lot of RPC calls, so we've
// precomputed the gas estimates for increments of 512 bytes.
//
// This file will need to be regenerated if the content store changes.

export const estimateFileUploadGas = async (
  file: PreparedFile
): Promise<BigNumber> => {
  const estimatedGasForContents = await Promise.all(
    file.contents.map(async (content, i) => {
      // const gas = await contentStore.estimateGas.addContent(
      //   ethers.utils.toUtf8Bytes(content)
      // );
      const { gas } =
        precomputedGasEstimates.find(
          (estimate) => estimate.size >= content.length
        ) ?? precomputedGasEstimates[precomputedGasEstimates.length - 1];
      // TODO: make chunks + gas per chunk + progress more visible in UI
      console.log(
        `${file.name} chunk[${i}]: ${
          content.length
        } bytes = ${gas.toString()} gas (estimated)`
      );
      return BigNumber.from(gas);
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
