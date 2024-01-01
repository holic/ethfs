import { goerli, mainnet } from "viem/chains";

export const fileStoreDeploys = [
  {
    chain: mainnet,
    address: "0x9746fD0A77829E12F8A9DBe70D7a322412325B91",
  },
  {
    chain: goerli,
    address: "0x5E348d0975A920E9611F8140f84458998A53af94",
  },
] as const;
