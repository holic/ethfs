export const fileStoreAbi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "filename",
        type: "string",
      },
    ],
    name: "getFile",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "size",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "checksum",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "pointer",
                type: "address",
              },
            ],
            internalType: "struct Content[]",
            name: "contents",
            type: "tuple[]",
          },
        ],
        internalType: "struct File",
        name: "file",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
