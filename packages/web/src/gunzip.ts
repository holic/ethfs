import * as fflate from "fflate";

const maxDecompressedLength = 1024 * 1024;

export const gunzip = (compressed: Buffer) => {
  let decompressed = Buffer.from([]);
  const decompressStream = new fflate.Decompress((chunk) => {
    if (decompressed.length < maxDecompressedLength) {
      decompressed = Buffer.concat([
        decompressed,
        chunk.slice(0, maxDecompressedLength - decompressed.length),
      ]);
    }
  });

  for (let i = 0; i < compressed.length; i += 1024) {
    if (decompressed.length >= maxDecompressedLength) break;
    decompressStream.push(compressed.slice(i, i + 1024));
  }

  return decompressed;
};
