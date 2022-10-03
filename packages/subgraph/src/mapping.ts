import { Address, json, store } from "@graphprotocol/graph-ts";

import { FileCreated, FileDeleted } from "../generated/FileStore/FileStore";
import { FileStoreFrontend } from "../generated/FileStore/FileStoreFrontend";
import { File } from "../generated/schema";

export function createFile(event: FileCreated): void {
  const fileStoreFrontend = FileStoreFrontend.bind(
    // TODO: somehow make this configurable/per-network
    Address.fromString("0xC8f76cb751B9e983bcF1Cf4824dD1A9441c6F190")
  );

  const file = new File(event.params.filename.toString());
  file.name = event.params.filename.toString();
  file.size = event.params.size.toU32();
  file.contents = fileStoreFrontend.readFile(
    event.address,
    event.params.filename.toString()
  );
  file.createdAt = event.block.timestamp.toI32();

  const parsedMetadata = json.try_fromBytes(event.params.metadata);
  if (parsedMetadata.isOk) {
    const metadata = parsedMetadata.value.toObject();
    const fileType = metadata.get("type");
    file.type = fileType ? fileType.toString() : null;
    const fileEncoding = metadata.get("encoding");
    file.encoding = fileEncoding ? fileEncoding.toString() : null;
    const fileCompression = metadata.get("compression");
    file.compression = fileCompression ? fileCompression.toString() : null;
  }

  file.save();
}

export function deleteFile(event: FileDeleted): void {
  store.remove("File", event.params.filename.toString());
}
