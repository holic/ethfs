import { createConfig } from "ponder";
import { http } from "viem";

import { FileStoreAbi } from "./abis/FileStoreAbi";

export default createConfig({
  networks: {
    mainnet: {
      chainId: 1,
      transport: http(process.env.RPC_HTTP_URL_1),
    },
  },
  contracts: {
    FileStore: {
      address: "0xFe1411d6864592549AdE050215482e4385dFa0FB",
      abi: FileStoreAbi,
      network: {
        mainnet: { startBlock: 18898263 },
      },
    },
  },
});
