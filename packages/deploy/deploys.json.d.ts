import { Address } from "viem";

declare const deploys: {
  readonly [chainId: number]: {
    readonly [contractName: string]: {
      deployer: Address;
      address: Address;
      blockNumber: string;
    };
  };
};

export default deploys;
