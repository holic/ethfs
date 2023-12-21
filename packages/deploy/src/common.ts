import { padHex } from "viem";

export const salt = padHex("0x", { size: 32 });

// https://eips.ethereum.org/EIPS/eip-170
export const contractSizeLimit = parseInt("6000", 16);
