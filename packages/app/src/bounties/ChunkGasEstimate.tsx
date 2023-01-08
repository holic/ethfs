import { formatEther } from "ethers/lib/utils";
import { useFeeData } from "wagmi";

import { precomputedGasEstimates } from "../file-upload/precomputedGasEstimates";

const maxChunk = precomputedGasEstimates[precomputedGasEstimates.length - 1];

export const ChunkGasEstimate = () => {
  const { data: feeData } = useFeeData();

  const estimatedFee = feeData?.maxFeePerGas
    ? Math.round(
        parseFloat(formatEther(feeData.maxFeePerGas.mul(maxChunk.gas))) * 1000
      ) / 1000
    : null;

  if (estimatedFee == null) return null;

  return (
    <p>
      At current gas prices, uploading a chunk will cost ~{estimatedFee} ETH in
      gas.
    </p>
  );
};
