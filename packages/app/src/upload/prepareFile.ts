// import { gzipSync } from "fflate";

export type PreparedFile = {
  name: string;
  contents: string[];
  metadata: {
    type: string;
    compression?: "gzip";
    encoding: "base64";
  };
};

// https://eips.ethereum.org/EIPS/eip-170
export const maxContentSize = parseInt("6000", 16) - 1;

// A File can only be read once, so this is a destructive operation
const readFile = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// A File can only be read once, so this is a destructive operation
export const prepareFile = async (file: File): Promise<PreparedFile> => {
  const preparedFile: PreparedFile = {
    name: file.name,
    contents: [],
    metadata: { type: file.type, encoding: "base64" },
  };
  const contents = await readFile(file);
  // const compressed = gzipSync(new Uint8Array(contents));
  // // TODO: check what fflate's deflate lib size is after base64 encoding
  // //       (estimated at 4kb below)
  // if (contents.byteLength - compressed.byteLength > 1024 * 4) {
  //   preparedFile.metadata.compression = "gzip";
  // }
  // const data = preparedFile.metadata.compression ? compressed : contents;
  // const encoded = Buffer.from(data).toString("base64");
  const encoded = Buffer.from(contents).toString("base64");
  for (let i = 0; i < encoded.length; i += maxContentSize) {
    preparedFile.contents.push(encoded.slice(i, i + maxContentSize));
  }
  return preparedFile;
};
