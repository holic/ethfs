import { gzipSync } from "fflate";

export type PreparedFile = {
  name: string;
  contents: string[];
  size: number;
  metadata: {
    type: string;
    encoding: "base64";
    compression?: "gzip";
    license?: string;
  };
  original: {
    name: string;
    size: number;
    contents: ArrayBuffer;
  };
};

// https://eips.ethereum.org/EIPS/eip-170
// 0x6000 minus 1 byte for SSTORE2 prefix
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

export const chunkContents = (buffer: ArrayBuffer) => {
  const encoded = Buffer.from(buffer).toString("base64");
  const size = encoded.length;
  const contents: string[] = [];
  for (let i = 0; i < encoded.length; i += maxContentSize) {
    contents.push(encoded.slice(i, i + maxContentSize));
  }
  return { size, contents };
};

// A File can only be read once, so this is a destructive operation
export const prepareFile = async (file: File): Promise<PreparedFile> => {
  const contents = await readFile(file);
  return {
    name: file.name,
    metadata: { type: file.type, encoding: "base64" },
    original: {
      name: file.name,
      size: file.size,
      contents,
    },
    ...chunkContents(contents),
  };
};

export const compressPreparedFile = (
  preparedFile: PreparedFile
): PreparedFile => {
  const compressed = gzipSync(new Uint8Array(preparedFile.original.contents));
  return {
    ...preparedFile,
    name: `${preparedFile.original.name}.gz`,
    metadata: {
      ...preparedFile.metadata,
      compression: "gzip",
    },
    ...chunkContents(compressed),
  };
};

export const decompressPreparedFile = (
  preparedFile: PreparedFile
): PreparedFile => {
  const { compression, ...metadata } = preparedFile.metadata;
  return {
    ...preparedFile,
    name: preparedFile.original.name,
    metadata,
    ...chunkContents(preparedFile.original.contents),
  };
};
