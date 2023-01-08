import { Address, dataSource, json, store } from "@graphprotocol/graph-ts";

import { FileCreated, FileDeleted } from "../generated/FileStore/FileStore";
import { FileStoreFrontend } from "../generated/FileStore/FileStoreFrontend";
import { File } from "../generated/schema";

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

export function createFile(event: FileCreated): void {
  const fileStoreFrontend = FileStoreFrontend.bind(
    Address.fromString(getFileStoreFrontendAddress(dataSource.network()))
  );

  const file = new File(event.params.filename.toString());
  file.name = event.params.filename.toString();
  file.size = event.params.size.toU32();
  file.createdAt = event.block.timestamp.toI32();

  const contents = fileStoreFrontend.try_readFile(
    event.address,
    event.params.filename.toString()
  );
  if (!contents.reverted) {
    file.contents = contents.value;
  }

  const parsedMetadata = json.try_fromBytes(event.params.metadata);
  if (parsedMetadata.isOk) {
    const metadata = parsedMetadata.value.toObject();
    const fileType = metadata.get("type");
    file.type = fileType ? fileType.toString() : null;
    // Note that this uses == below instead of ===
    // See https://github.com/AssemblyScript/assemblyscript/issues/621#issuecomment-496990742
    if (file.type == "application/javascript") {
      file.type = "text/javascript";
    }
    const fileEncoding = metadata.get("encoding");
    file.encoding = fileEncoding ? fileEncoding.toString() : null;
    const fileCompression = metadata.get("compression");
    file.compression = fileCompression ? fileCompression.toString() : null;
    const fileLicense = metadata.get("license");
    file.license = fileLicense ? fileLicense.toString() : null;
  }

  file.save();
}

export function deleteFile(event: FileDeleted): void {
  store.remove("File", event.params.filename.toString());
}
