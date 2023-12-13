import { Address } from "viem";

declare const deploys: {
  readonly [chainId: number]: {
    readonly [contractName: string]: Address;
  };
};

export default deploys;
