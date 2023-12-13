import FileStoreAbi from "@ethfs/contracts/out/FileStore.sol/FileStore.abi.json";
import deploys from "@ethfs/deploy/deploys.json";
import { createConfig } from "@ponder/core";
import { fallback, http } from "viem";

export default createConfig({
  networks: {
    goerli: {
      chainId: 5,
      transport: fallback([
        // http("https://ethereum-goerli.publicnode.com"),
        http("https://www.noderpc.xyz/rpc-goerli/public"),
      ]),
    },
  },
  contracts: {
    FileStore: {
      abi: FileStoreAbi,
      network: {
        goerli: {
          address: deploys[5]?.FileStore,
          // TODO: get block number from Deployed event
        },
      },
    },
  },
});
