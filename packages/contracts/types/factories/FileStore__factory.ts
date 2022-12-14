/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { FileStore, FileStoreInterface } from "../FileStore";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IContentStore",
        name: "_contentStore",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "EmptyFile",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "filename",
        type: "string",
      },
    ],
    name: "FileNotFound",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "filename",
        type: "string",
      },
    ],
    name: "FilenameExists",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "indexedFilename",
        type: "string",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "checksum",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "filename",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "metadata",
        type: "bytes",
      },
    ],
    name: "FileCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "indexedFilename",
        type: "string",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "checksum",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "filename",
        type: "string",
      },
    ],
    name: "FileDeleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "contentStore",
    outputs: [
      {
        internalType: "contract IContentStore",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "filename",
        type: "string",
      },
      {
        internalType: "bytes32[]",
        name: "checksums",
        type: "bytes32[]",
      },
    ],
    name: "createFile",
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
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "filename",
        type: "string",
      },
      {
        internalType: "bytes32[]",
        name: "checksums",
        type: "bytes32[]",
      },
      {
        internalType: "bytes",
        name: "extraData",
        type: "bytes",
      },
    ],
    name: "createFile",
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
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "filename",
        type: "string",
      },
    ],
    name: "deleteFile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "filename",
        type: "string",
      },
    ],
    name: "fileExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "files",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "filename",
        type: "string",
      },
    ],
    name: "getChecksum",
    outputs: [
      {
        internalType: "bytes32",
        name: "checksum",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
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
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a060405234801561001057600080fd5b506040516111ec3803806111ec83398101604081905261002f916100c0565b61003833610049565b6001600160a01b03166080526100f0565b600180546001600160a01b031916905561006d81610070602090811b61063517901c565b50565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156100d257600080fd5b81516001600160a01b03811681146100e957600080fd5b9392505050565b6080516110c5610127600039600081816101020152818161050a015281816107800152818161085e015261097b01526110c56000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80639bccd6ad1161008c578063e0876aa811610066578063e0876aa8146101c9578063e30c3978146101dc578063e7755761146101ed578063f2fde38b1461021857600080fd5b80639bccd6ad14610172578063a52e640e14610195578063a9910054146101b657600080fd5b80631eb8bc4e146100d45780633a6e674c146100fd578063715018a61461013c57806379ba5097146101465780638da5cb5b1461014e578063972079921461015f575b600080fd5b6100e76100e2366004610c64565b61022b565b6040516100f49190610cc8565b60405180910390f35b6101247f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020016100f4565b610144610263565b005b610144610277565b6000546001600160a01b0316610124565b6100e761016d366004610d35565b6102f6565b610185610180366004610dd1565b610361565b60405190151581526020016100f4565b6101a86101a3366004610dd1565b61038f565b6040519081526020016100f4565b6101446101c4366004610dd1565b6103d8565b6100e76101d7366004610dd1565b610498565b6001546001600160a01b0316610124565b6101a86101fb366004610dd1565b805160208183018101805160028252928201919093012091525481565b610144610226366004610e1b565b6105c4565b60408051808201825260008082526060602080840191909152835191825281019092529061025c90849084906102f6565b9392505050565b61026b610685565b61027560006106df565b565b60015433906001600160a01b031681146102ea5760405162461bcd60e51b815260206004820152602960248201527f4f776e61626c6532537465703a2063616c6c6572206973206e6f7420746865206044820152683732bb9037bbb732b960b91b60648201526084015b60405180910390fd5b6102f3816106df565b50565b6040805180820190915260008152606060208201526000801b60028560405161031f9190610e68565b9081526020016040518091039020541461034e57836040516301856ec560e51b81526004016102e19190610eb0565b6103598484846106f8565b949350505050565b60008060001b6002836040516103779190610e68565b90815260200160405180910390205414159050919050565b60006002826040516103a19190610e68565b908152604051908190036020019020549050806103d35781604051630b5d665f60e31b81526004016102e19190610eb0565b919050565b6103e0610685565b60006002826040516103f29190610e68565b908152604051908190036020019020549050806104245781604051630b5d665f60e31b81526004016102e19190610eb0565b6002826040516104349190610e68565b90815260200160405180910390206000905580826040516104559190610e68565b60405180910390207f049d33e2ff016446d304c7c9f197f7112de9a3b3134df07ca017294a25a4e4618460405161048c9190610eb0565b60405180910390a35050565b60408051808201909152600081526060602082015260006002836040516104bf9190610e68565b908152604051908190036020019020549050806104f15782604051630b5d665f60e31b81526004016102e19190610eb0565b6040516306fc89ab60e21b8152600481018290526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690631bf226ac90602401602060405180830381865afa158015610559573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061057d9190610ec3565b90506001600160a01b0381166105a85783604051630b5d665f60e31b81526004016102e19190610eb0565b6105b181610aac565b8060200190518101906103599190610ee0565b6105cc610685565b600180546001600160a01b0383166001600160a01b031990911681179091556105fd6000546001600160a01b031690565b6001600160a01b03167f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e2270060405160405180910390a350565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000546001600160a01b031633146102755760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016102e1565b600180546001600160a01b03191690556102f381610635565b6040805180820190915260008152606060208201526000835167ffffffffffffffff81111561072957610729610aed565b60405190808252806020026020018201604052801561076e57816020015b60408051808201909152600080825260208201528152602001906001900390816107475790505b5090506000805b855181101561093e577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166331654b098783815181106107bf576107bf610fdd565b60200260200101516040518263ffffffff1660e01b81526004016107e591815260200190565b602060405180830381865afa158015610802573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108269190610ff3565b6108309083611022565b9150604051806040016040528087838151811061084f5761084f610fdd565b602002602001015181526020017f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316634641dce689858151811061089d5761089d610fdd565b60200260200101516040518263ffffffff1660e01b81526004016108c391815260200190565b602060405180830381865afa1580156108e0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109049190610ec3565b6001600160a01b031681525083828151811061092257610922610fdd565b6020026020010181905250806109379061103a565b9050610775565b50806000036109605760405163067b6a0f60e01b815260040160405180910390fd5b604051806040016040528082815260200183815250925060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663093e9839856040516020016109b99190610cc8565b6040516020818303038152906040526040518263ffffffff1660e01b81526004016109e49190610eb0565b60408051808303816000875af1158015610a02573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a269190611053565b50905080600288604051610a3a9190610e68565b9081526020016040518091039020819055508087604051610a5b9190610e68565b60405180910390207fbf4d3dad9eb190a395deec4f74f993087bfb5df21ff6c0e1403ec61042090c2d89876000015189604051610a9a93929190611083565b60405180910390a35050509392505050565b6060813b80610ac3576311052bb46000526004601cfd5b600181039050604051915061ffe0603f820116820160405280825280600160208401853c50919050565b634e487b7160e01b600052604160045260246000fd5b6040805190810167ffffffffffffffff81118282101715610b2657610b26610aed565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715610b5557610b55610aed565b604052919050565b600067ffffffffffffffff831115610b7757610b77610aed565b610b8a601f8401601f1916602001610b2c565b9050828152838383011115610b9e57600080fd5b828260208301376000602084830101529392505050565b600082601f830112610bc657600080fd5b61025c83833560208501610b5d565b600067ffffffffffffffff821115610bef57610bef610aed565b5060051b60200190565b600082601f830112610c0a57600080fd5b81356020610c1f610c1a83610bd5565b610b2c565b82815260059290921b84018101918181019086841115610c3e57600080fd5b8286015b84811015610c595780358352918301918301610c42565b509695505050505050565b60008060408385031215610c7757600080fd5b823567ffffffffffffffff80821115610c8f57600080fd5b610c9b86838701610bb5565b93506020850135915080821115610cb157600080fd5b50610cbe85828601610bf9565b9150509250929050565b602080825282518282015282810151604080840181905281516060850181905260009392830191849160808701905b80841015610d29578451805183528601516001600160a01b031686830152938501936001939093019290820190610cf7565b50979650505050505050565b600080600060608486031215610d4a57600080fd5b833567ffffffffffffffff80821115610d6257600080fd5b610d6e87838801610bb5565b94506020860135915080821115610d8457600080fd5b610d9087838801610bf9565b93506040860135915080821115610da657600080fd5b508401601f81018613610db857600080fd5b610dc786823560208401610b5d565b9150509250925092565b600060208284031215610de357600080fd5b813567ffffffffffffffff811115610dfa57600080fd5b61035984828501610bb5565b6001600160a01b03811681146102f357600080fd5b600060208284031215610e2d57600080fd5b813561025c81610e06565b60005b83811015610e53578181015183820152602001610e3b565b83811115610e62576000848401525b50505050565b60008251610e7a818460208701610e38565b9190910192915050565b60008151808452610e9c816020860160208601610e38565b601f01601f19169290920160200192915050565b60208152600061025c6020830184610e84565b600060208284031215610ed557600080fd5b815161025c81610e06565b60006020808385031215610ef357600080fd5b825167ffffffffffffffff80821115610f0b57600080fd5b81850191506040808388031215610f2157600080fd5b610f29610b03565b835181528484015183811115610f3e57600080fd5b80850194505087601f850112610f5357600080fd5b83519250610f63610c1a84610bd5565b83815260069390931b84018501928581019089851115610f8257600080fd5b948601945b84861015610fcb5783868b031215610f9f5760008081fd5b610fa7610b03565b8651815287870151610fb881610e06565b8189015282529483019490860190610f87565b95820195909552979650505050505050565b634e487b7160e01b600052603260045260246000fd5b60006020828403121561100557600080fd5b5051919050565b634e487b7160e01b600052601160045260246000fd5b600082198211156110355761103561100c565b500190565b60006001820161104c5761104c61100c565b5060010190565b6000806040838503121561106657600080fd5b82519150602083015161107881610e06565b809150509250929050565b6060815260006110966060830186610e84565b84602084015282810360408401526110ae8185610e84565b969550505050505056fea164736f6c634300080d000a";

type FileStoreConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FileStoreConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FileStore__factory extends ContractFactory {
  constructor(...args: FileStoreConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _contentStore: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<FileStore> {
    return super.deploy(_contentStore, overrides || {}) as Promise<FileStore>;
  }
  override getDeployTransaction(
    _contentStore: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_contentStore, overrides || {});
  }
  override attach(address: string): FileStore {
    return super.attach(address) as FileStore;
  }
  override connect(signer: Signer): FileStore__factory {
    return super.connect(signer) as FileStore__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FileStoreInterface {
    return new utils.Interface(_abi) as FileStoreInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FileStore {
    return new Contract(address, _abi, signerOrProvider) as FileStore;
  }
}
