import { Address } from "viem";

declare const deploys: {
  readonly [chainId: number]: {
    readonly deployer: Address;
    readonly contracts: {
      readonly [contractName: string]: {
        readonly address: Address;
        readonly blockNumber: string;
      };
    };
  };
};

export default deploys;
