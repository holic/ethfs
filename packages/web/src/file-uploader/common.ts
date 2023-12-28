import {
  Address,
  concatHex,
  getContractAddress,
  Hex,
  numberToHex,
  stringToHex,
} from "viem";

export const salt = stringToHex("EthFS", { size: 32 });

export function contentToInitCode(content: string): Hex {
  return concatHex([
    "0x61",
    numberToHex(content.length + 1, { size: 2 }),
    "0x80600a3d393df300",
    stringToHex(content),
  ]);
}

export function getPointer(deployer: Address, content: string): Address {
  return getContractAddress({
    bytecode: contentToInitCode(content),
    from: deployer,
    opcode: "CREATE2",
    salt,
  });
}
