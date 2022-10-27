import { ethers } from "ethers";

import { FileInstance } from "../generated/entities";
import { FileCreatedHandler, FileDeletedHandler } from "../generated/FileStore";

const parseJson = (encodedJson: string, defaultValue: any = null) => {
  try {
    return JSON.parse(encodedJson);
  } catch (e) {
    return defaultValue;
  }
};

const handleFileCreated: FileCreatedHandler = async (event, context) => {
  const { FileStoreFrontend } = context.contracts;
  const { File } = context.entities;

  const filename = event.params[2];
  const size = event.params[3];
  const metadata = parseJson(ethers.utils.toUtf8String(event.params[4]));

  // console.log("File created", filename, size, metadata);

  const fileData: Omit<FileInstance, "id"> = {
    name: filename,
    size: size.toNumber(),
    contents: await FileStoreFrontend.readFile(
      event.address as `0x{string}`,
      filename,
      {
        blockTag: 7839848,
      }
    ),
    createdAt: event.block.timestamp,
    type: metadata?.type,
    compression: metadata?.compression,
    encoding: metadata?.encoding,
  };

  let file = await File.get(filename);
  if (file) {
    file = await File.update({
      id: file.id,
      ...fileData,
    });
  } else {
    file = await File.insert({ id: filename, ...fileData });
  }
};

const handleFileDeleted: FileDeletedHandler = async (event, context) => {
  return;
};

// export function createFile(event: FileCreated): void {
//   const fileStoreFrontend = FileStoreFrontend.bind(
//     // TODO: somehow make this configurable/per-network
//     Address.fromString("0xC8f76cb751B9e983bcF1Cf4824dD1A9441c6F190")
//   );

//   const file = new File(event.params.filename.toString());
//   file.name = event.params.filename.toString();
//   file.size = event.params.size.toU32();
//   file.contents = fileStoreFrontend.readFile(
//     event.address,
//     event.params.filename.toString()
//   );
//   file.createdAt = event.block.timestamp.toI32();

//   const parsedMetadata = json.try_fromBytes(event.params.metadata);
//   if (parsedMetadata.isOk) {
//     const metadata = parsedMetadata.value.toObject();
//     const fileType = metadata.get("type");
//     file.type = fileType ? fileType.toString() : null;
//     const fileEncoding = metadata.get("encoding");
//     file.encoding = fileEncoding ? fileEncoding.toString() : null;
//     const fileCompression = metadata.get("compression");
//     file.compression = fileCompression ? fileCompression.toString() : null;
//   }

//   file.save();
// }

// export function deleteFile(event: FileDeleted): void {
//   store.remove("File", event.params.filename.toString());
// }

export const FileStore = {
  FileCreated: handleFileCreated,
  FileDeleted: handleFileDeleted,
};
