import { gzipSync } from "fflate";
import mime from "mime/lite";

export type PreparedFile = {
  filename: string;
  contents: string[];
  size: number;
  metadata: {
    type?: string;
    encoding?: "base64";
    compression?: "gzip";
    license?: string;
  };
  original: {
    filename: string;
    size: number;
    contents: ArrayBuffer;
  };
};

// https://eips.ethereum.org/EIPS/eip-170
// 0x6000 minus 1 byte for SSTORE2 prefix
export const maxContentSize = parseInt("6000", 16) - 1;

// A File can only be read once, so this is a destructive operation
function readFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function chunkContents(buffer: ArrayBuffer) {
  const encoded = Buffer.from(buffer).toString("base64");
  const size = encoded.length;
  const contents: string[] = [];
  for (let i = 0; i < encoded.length; i += maxContentSize) {
    contents.push(encoded.slice(i, i + maxContentSize));
  }
  return { size, contents };
}

// A File can only be read once, so this is a destructive operation
export async function prepareFile(file: File): Promise<PreparedFile> {
  const contents = await readFile(file);
  return {
    filename: file.name,
    metadata: {
      type: mime.getType(file.name) ?? undefined,
      encoding: "base64",
    },
    original: {
      filename: file.name,
      size: file.size,
      contents,
    },
    ...chunkContents(contents),
  };
}

export function compressPreparedFile(preparedFile: PreparedFile): PreparedFile {
  const compressed = gzipSync(new Uint8Array(preparedFile.original.contents));
  return {
    ...preparedFile,
    filename: `${preparedFile.original.filename}.gz`,
    metadata: {
      ...preparedFile.metadata,
      compression: "gzip",
    },
    ...chunkContents(compressed.slice().buffer),
  };
}

export function decompressPreparedFile(
  preparedFile: PreparedFile,
): PreparedFile {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { compression, ...metadata } = preparedFile.metadata;
  return {
    ...preparedFile,
    filename: preparedFile.original.filename,
    metadata,
    ...chunkContents(preparedFile.original.contents),
  };
}
