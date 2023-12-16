import FileStoreAbi from "@ethfs/contracts/out/FileStore.sol/FileStore.abi.json";
import deploys from "@ethfs/deploy/deploys.json";
import { createConfig } from "@ponder/core";
import { http } from "viem";

export default createConfig({
  networks: {
    goerli: {
      chainId: 5,
      transport: http(process.env.RPC_HTTP_URL_5),
    },
  },
  contracts: {
    FileStore: {
      abi: FileStoreAbi,
      network: {
        goerli: {
          address: deploys[5]?.FileStore,
          startBlock: 10218693,
          // TODO: get block number from Deployed event or deploys.json
        },
      },
    },
  },
});
