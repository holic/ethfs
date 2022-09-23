/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { FileReader, FileReaderInterface } from "../FileReader";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "checksum",
        type: "bytes32",
      },
    ],
    name: "FileNotFound",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_size",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_start",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_end",
        type: "uint256",
      },
    ],
    name: "InvalidCodeAtRange",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "checksum",
        type: "bytes32",
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
    inputs: [
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
    name: "readFile",
    outputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
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
    name: "readFile",
    outputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x61098961003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361061004b5760003560e01c80633bb2c4ce14610050578063473aa2a51461007957806360f9bb1114610099575b600080fd5b61006361005e36600461059a565b6100ac565b60405161007091906106e9565b60405180910390f35b61008c6100873660046106fc565b610130565b6040516100709190610715565b6100636100a7366004610782565b610276565b60606100d38260000151604080518281016060018252910181526000602090910190815290565b905060005b82602001515181101561012a57610118826101138560200151848151811061010257610102610817565b602002602001015160200151610362565b610378565b8061012281610843565b9150506100d8565b50919050565b604080518082019091526000815260606020820152600073__$5c09f8e56d170cbd9f4382764db85fd796$__633a6e674c6040518163ffffffff1660e01b8152600401602060405180830381865af4158015610190573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101b4919061085c565b6001600160a01b0316634641dce6846040518263ffffffff1660e01b81526004016101e191815260200190565b602060405180830381865afa1580156101fe573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610222919061085c565b90506001600160a01b0381166102535760405163a4b13c7360e01b8152600481018490526024015b60405180910390fd5b61025c81610362565b80602001905181019061026f9190610879565b9392505050565b6060600073__$5c09f8e56d170cbd9f4382764db85fd796$__6321ea07e16040518163ffffffff1660e01b8152600401602060405180830381865af41580156102c3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102e7919061085c565b6001600160a01b031663e0876aa8846040518263ffffffff1660e01b815260040161031291906106e9565b600060405180830381865afa15801561032f573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526103579190810190610879565b905061026f816100ac565b6060610372826001600019610403565b92915050565b601f1982015182518251603f199092019182906103959083610964565b11156103f35760405162461bcd60e51b815260206004820152602760248201527f44796e616d69634275666665723a20417070656e64696e67206f7574206f66206044820152663137bab732399760c91b606482015260840161024a565b6103fd84846104b8565b50505050565b6060833b600081900361042657505060408051602081019091526000815261026f565b8084111561044457505060408051602081019091526000815261026f565b838310156104765760405163162544fd60e11b815260048101829052602481018590526044810184905260640161024a565b838303848203600082821061048b578261048d565b815b60408051603f8301601f19168101909152818152955090508087602087018a3c505050509392505050565b8051602082019150808201602084510184015b818410156104e35783518152602093840193016104cb565b505082510190915250565b634e487b7160e01b600052604160045260246000fd5b6040805190810167ffffffffffffffff81118282101715610527576105276104ee565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715610556576105566104ee565b604052919050565b600067ffffffffffffffff821115610578576105786104ee565b5060051b60200190565b6001600160a01b038116811461059757600080fd5b50565b600060208083850312156105ad57600080fd5b823567ffffffffffffffff808211156105c557600080fd5b818501915060408083880312156105db57600080fd5b6105e3610504565b8335815284840135838111156105f857600080fd5b80850194505087601f85011261060d57600080fd5b8335925061062261061d8461055e565b61052d565b83815260069390931b8401850192858101908985111561064157600080fd5b948601945b8486101561068a5783868b03121561065e5760008081fd5b610666610504565b863581528787013561067781610582565b8189015282529483019490860190610646565b95820195909552979650505050505050565b6000815180845260005b818110156106c2576020818501810151868301820152016106a6565b818111156106d4576000602083870101525b50601f01601f19169290920160200192915050565b60208152600061026f602083018461069c565b60006020828403121561070e57600080fd5b5035919050565b602080825282518282015282810151604080840181905281516060850181905260009392830191849160808701905b80841015610776578451805183528601516001600160a01b031686830152938501936001939093019290820190610744565b50979650505050505050565b6000602080838503121561079557600080fd5b823567ffffffffffffffff808211156107ad57600080fd5b818501915085601f8301126107c157600080fd5b8135818111156107d3576107d36104ee565b6107e5601f8201601f1916850161052d565b915080825286848285010111156107fb57600080fd5b8084840185840137600090820190930192909252509392505050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000600182016108555761085561082d565b5060010190565b60006020828403121561086e57600080fd5b815161026f81610582565b6000602080838503121561088c57600080fd5b825167ffffffffffffffff808211156108a457600080fd5b818501915060408083880312156108ba57600080fd5b6108c2610504565b8351815284840151838111156108d757600080fd5b80850194505087601f8501126108ec57600080fd5b835192506108fc61061d8461055e565b83815260069390931b8401850192858101908985111561091b57600080fd5b948601945b8486101561068a5783868b0312156109385760008081fd5b610940610504565b865181528787015161095181610582565b8189015282529483019490860190610920565b600082198211156109775761097761082d565b50019056fea164736f6c634300080d000a";

type FileReaderConstructorParams =
  | [linkLibraryAddresses: FileReaderLibraryAddresses, signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FileReaderConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => {
  return (
    typeof xs[0] === "string" ||
    (Array.isArray as (arg: any) => arg is readonly any[])(xs[0]) ||
    "_isInterface" in xs[0]
  );
};

export class FileReader__factory extends ContractFactory {
  constructor(...args: FileReaderConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      const [linkLibraryAddresses, signer] = args;
      super(
        _abi,
        FileReader__factory.linkBytecode(linkLibraryAddresses),
        signer
      );
    }
  }

  static linkBytecode(
    linkLibraryAddresses: FileReaderLibraryAddresses
  ): string {
    let linkedBytecode = _bytecode;

    linkedBytecode = linkedBytecode.replace(
      new RegExp("__\\$5c09f8e56d170cbd9f4382764db85fd796\\$__", "g"),
      linkLibraryAddresses["packages/contracts/src/DataStores.sol:DataStores"]
        .replace(/^0x/, "")
        .toLowerCase()
    );

    return linkedBytecode;
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<FileReader> {
    return super.deploy(overrides || {}) as Promise<FileReader>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): FileReader {
    return super.attach(address) as FileReader;
  }
  override connect(signer: Signer): FileReader__factory {
    return super.connect(signer) as FileReader__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FileReaderInterface {
    return new utils.Interface(_abi) as FileReaderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FileReader {
    return new Contract(address, _abi, signerOrProvider) as FileReader;
  }
}

export interface FileReaderLibraryAddresses {
  ["packages/contracts/src/DataStores.sol:DataStores"]: string;
}
