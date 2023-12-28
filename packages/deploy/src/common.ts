import { stringToHex } from "viem";

export const salt = stringToHex("", { size: 32 });
// export const salt = stringToHex("EthFS", { size: 32 });

// https://eips.ethereum.org/EIPS/eip-170
export const contractSizeLimit = parseInt("6000", 16);
