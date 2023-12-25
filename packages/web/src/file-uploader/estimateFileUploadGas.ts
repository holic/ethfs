import { contentGasEstimates } from "./contentGasEstimates";
import { PreparedFile } from "./prepareFile";

// For big files, this can be generate a lot of RPC calls, so we've
// precomputed the gas estimates for increments of 512 bytes.

export async function estimateFileUploadGas(
  file: PreparedFile,
): Promise<number> {
  const estimatedGasForContents = await Promise.all(
    file.contents.map(async (content, i) => {
      const { gas } =
        contentGasEstimates.find(
          (estimate) => estimate.size >= content.length,
        ) ?? contentGasEstimates[contentGasEstimates.length - 1];
      // TODO: make chunks + gas per chunk + progress more visible in UI
      console.log(
        `${file.filename} chunk[${i}]: ${
          content.length
        } bytes = ${gas.toString()} gas (estimated)`,
      );
      return gas;
    }),
  );
  const total = estimatedGasForContents.reduce((total, gas) => total + gas, 0);
  // TODO: gas for createFile, hard to estimate right now due to checksum validation
  console.log(`${file.filename} total ${total.toString()} gas (estimated)`);
  return total;
}
