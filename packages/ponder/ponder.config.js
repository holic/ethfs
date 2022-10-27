const { graphqlPlugin } = require("@ponder/graphql");

module.exports = {
  plugins: [graphqlPlugin()],
  database: {
    kind: "sqlite",
  },
  networks: [
    {
      kind: "evm",
      name: "goerli",
      chainId: 5,
      rpcUrl: process.env.PONDER_RPC_URL_5,
    },
  ],
  sources: [
    {
      kind: "evm",
      name: "FileStore",
      network: "goerli",
      address: "0x5E348d0975A920E9611F8140f84458998A53af94",
      abi: "./abis/FileStore.abi.json",
      startBlock: 7696727,
    },
    {
      kind: "evm",
      name: "FileStoreFrontend",
      network: "goerli",
      address: "0xC8f76cb751B9e983bcF1Cf4824dD1A9441c6F190",
      abi: "./abis/FileStoreFrontend.abi.json",
      startBlock: 7696727,
    },
  ],
};
