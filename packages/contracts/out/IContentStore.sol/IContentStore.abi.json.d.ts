declare const abi: [
  {
    "type": "function",
    "name": "addContent",
    "inputs": [
      {
        "name": "content",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "pointer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "contentLength",
    "inputs": [
      {
        "name": "pointer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "size",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getContent",
    "inputs": [
      {
        "name": "pointer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "content",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getPointer",
    "inputs": [
      {
        "name": "content",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "pointerExists",
    "inputs": [
      {
        "name": "pointer",
        "type": "address",
        "internalType": "address"
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
    "type": "event",
    "name": "NewContent",
    "inputs": [
      {
        "name": "pointer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "size",
        "type": "uint32",
        "indexed": false,
        "internalType": "uint32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "ContentNotFound",
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
    "name": "UnexpectedPointer",
    "inputs": [
      {
        "name": "expectedPointer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "actualPointer",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
]; export default abi;
