import FileStoreAbi from "@ethfs/contracts/out/FileStore.sol/FileStore.abi.json";
import deploys from "@ethfs/deploy/deploys.json";
import { createConfig } from "@ponder/core";
import { http } from "viem";

export default createConfig({
  networks: {
    goerli: {
      chainId: 5,
      transport: http(process.env.RPC_HTTP_URL_5),
      maxHistoricalTaskConcurrency: 2,
    },
  },
  contracts: {
    FileStore: {
      abi: FileStoreAbi,
      network: {
        goerli: {
          address: deploys[5]?.contracts.FileStore?.address,
          startBlock: parseInt(
            deploys[5]?.contracts.FileStore?.blockNumber ?? "0",
          ),
        },
      },
    },
  },
});
