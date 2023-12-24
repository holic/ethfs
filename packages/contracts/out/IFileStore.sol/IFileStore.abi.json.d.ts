declare const abi: [
  {
    "type": "function",
    "name": "contentStore",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IContentStore"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "createFile",
    "inputs": [
      {
        "name": "filename",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "contents",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "pointer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "file",
        "type": "tuple",
        "internalType": "struct File",
        "components": [
          {
            "name": "size",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "slices",
            "type": "tuple[]",
            "internalType": "struct BytecodeSlice[]",
            "components": [
              {
                "name": "pointer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "size",
                "type": "uint32",
                "internalType": "uint32"
              },
              {
                "name": "offset",
                "type": "uint32",
                "internalType": "uint32"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createFile",
    "inputs": [
      {
        "name": "filename",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "contents",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "metadata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "pointer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "file",
        "type": "tuple",
        "internalType": "struct File",
        "components": [
          {
            "name": "size",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "slices",
            "type": "tuple[]",
            "internalType": "struct BytecodeSlice[]",
            "components": [
              {
                "name": "pointer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "size",
                "type": "uint32",
                "internalType": "uint32"
              },
              {
                "name": "offset",
                "type": "uint32",
                "internalType": "uint32"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createFileFromChunks",
    "inputs": [
      {
        "name": "filename",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chunks",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "metadata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "pointer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "file",
        "type": "tuple",
        "internalType": "struct File",
        "components": [
          {
            "name": "size",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "slices",
            "type": "tuple[]",
            "internalType": "struct BytecodeSlice[]",
            "components": [
              {
                "name": "pointer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "size",
                "type": "uint32",
                "internalType": "uint32"
              },
              {
                "name": "offset",
                "type": "uint32",
                "internalType": "uint32"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createFileFromChunks",
    "inputs": [
      {
        "name": "filename",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chunks",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "outputs": [
      {
        "name": "pointer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "file",
        "type": "tuple",
        "internalType": "struct File",
        "components": [
          {
            "name": "size",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "slices",
            "type": "tuple[]",
            "internalType": "struct BytecodeSlice[]",
            "components": [
              {
                "name": "pointer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "size",
                "type": "uint32",
                "internalType": "uint32"
              },
              {
                "name": "offset",
                "type": "uint32",
                "internalType": "uint32"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createFileFromPointers",
    "inputs": [
      {
        "name": "filename",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "pointers",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "metadata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "pointer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "file",
        "type": "tuple",
        "internalType": "struct File",
        "components": [
          {
            "name": "size",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "slices",
            "type": "tuple[]",
            "internalType": "struct BytecodeSlice[]",
            "components": [
              {
                "name": "pointer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "size",
                "type": "uint32",
                "internalType": "uint32"
              },
              {
                "name": "offset",
                "type": "uint32",
                "internalType": "uint32"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createFileFromPointers",
    "inputs": [
      {
        "name": "filename",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "pointers",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "outputs": [
      {
        "name": "pointer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "file",
        "type": "tuple",
        "internalType": "struct File",
        "components": [
          {
            "name": "size",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "slices",
            "type": "tuple[]",
            "internalType": "struct BytecodeSlice[]",
            "components": [
              {
                "name": "pointer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "size",
                "type": "uint32",
                "internalType": "uint32"
              },
              {
                "name": "offset",
                "type": "uint32",
                "internalType": "uint32"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createFileFromSlices",
    "inputs": [
      {
        "name": "filename",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "slices",
        "type": "tuple[]",
        "internalType": "struct BytecodeSlice[]",
        "components": [
          {
            "name": "pointer",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "size",
            "type": "uint32",
            "internalType": "uint32"
          },
          {
            "name": "offset",
            "type": "uint32",
            "internalType": "uint32"
          }
        ]
      },
      {
        "name": "metadata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "pointer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "file",
        "type": "tuple",
        "internalType": "struct File",
        "components": [
          {
            "name": "size",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "slices",
            "type": "tuple[]",
            "internalType": "struct BytecodeSlice[]",
            "components": [
              {
                "name": "pointer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "size",
                "type": "uint32",
                "internalType": "uint32"
              },
              {
                "name": "offset",
                "type": "uint32",
                "internalType": "uint32"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createFileFromSlices",
    "inputs": [
      {
        "name": "filename",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "slices",
        "type": "tuple[]",
        "internalType": "struct BytecodeSlice[]",
        "components": [
          {
            "name": "pointer",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "size",
            "type": "uint32",
            "internalType": "uint32"
          },
          {
            "name": "offset",
            "type": "uint32",
            "internalType": "uint32"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "pointer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "file",
        "type": "tuple",
        "internalType": "struct File",
        "components": [
          {
            "name": "size",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "slices",
            "type": "tuple[]",
            "internalType": "struct BytecodeSlice[]",
            "components": [
              {
                "name": "pointer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "size",
                "type": "uint32",
                "internalType": "uint32"
              },
              {
                "name": "offset",
                "type": "uint32",
                "internalType": "uint32"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "fileExists",
    "inputs": [
      {
        "name": "filename",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "files",
    "inputs": [
      {
        "name": "filename",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "pointer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getFile",
    "inputs": [
      {
        "name": "filename",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "file",
        "type": "tuple",
        "internalType": "struct File",
        "components": [
          {
            "name": "size",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "slices",
            "type": "tuple[]",
            "internalType": "struct BytecodeSlice[]",
            "components": [
              {
                "name": "pointer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "size",
                "type": "uint32",
                "internalType": "uint32"
              },
              {
                "name": "offset",
                "type": "uint32",
                "internalType": "uint32"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPointer",
    "inputs": [
      {
        "name": "filename",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "pointer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "readFile",
    "inputs": [
      {
        "name": "filename",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "contents",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "FileCreated",
    "inputs": [
      {
        "name": "indexedFilename",
        "type": "string",
        "indexed": true,
        "internalType": "string"
      },
      {
        "name": "pointer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "filename",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "size",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "metadata",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "FileEmpty",
    "inputs": []
  },
  {
    "type": "error",
    "name": "FileNotFound",
    "inputs": [
      {
        "name": "filename",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "FilenameExists",
    "inputs": [
      {
        "name": "filename",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidPointer",
    "inputs": [
      {
        "name": "pointer",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "SliceEmpty",
    "inputs": [
      {
        "name": "pointer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "size",
        "type": "uint32",
        "internalType": "uint32"
      },
      {
        "name": "offset",
        "type": "uint32",
        "internalType": "uint32"
      }
    ]
  }
]; export default abi;
