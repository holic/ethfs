import { Address, dataSource } from "@graphprotocol/graph-ts";

import { NewChecksum } from "../generated/ContentStore/ContentStore";
import { FileStoreFrontend } from "../generated/ContentStore/FileStoreFrontend";
import { Chunk } from "../generated/schema";

// Note that this uses == below instead of ===
// See https://github.com/AssemblyScript/assemblyscript/issues/621#issuecomment-496990742
//
// TODO: move these addresses to some sort of config?
//
const getFileStoreFrontendAddress = (network: string): string => {
  if (network == "mainnet") {
    return "0xBc66C61BCF49Cc3fe4E321aeCEa307F61EC57C0b";
  }
  if (network == "goerli") {
    return "0xC8f76cb751B9e983bcF1Cf4824dD1A9441c6F190";
  }
  throw new Error(`Unsupported network (${network}) for FileStoreFrontend`);
};

export function newChecksum(event: NewChecksum): void {
  const fileStoreFrontend = FileStoreFrontend.bind(
    Address.fromString(getFileStoreFrontendAddress(dataSource.network()))
  );

  const chunk = new Chunk(event.params.checksum.toHexString());
  chunk.checksum = event.params.checksum.toHexString();
  chunk.contents = fileStoreFrontend
    .getContent(event.address, event.params.checksum)
    .toString();
  chunk.save();
}
