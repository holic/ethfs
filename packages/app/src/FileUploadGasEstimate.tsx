import { ethers } from "ethers";
import { suspend } from "suspend-react";

import { estimateFileUploadGas } from "./upload/estimateFileUploadGas";
import { PreparedFile } from "./upload/prepareFile";

type Props = {
  file: PreparedFile;
};

export const FileUploadGasEstimate = ({ file }: Props) => {
  const estimatedGas = suspend(() => estimateFileUploadGas(file), [file]);
  return <>{ethers.utils.formatEther(estimatedGas)}</>;
};
