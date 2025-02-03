import * as fflate from "fflate";

/**
 * Decompresses a gzipped buffer.
 * @param compressed - The compressed data.
 * @param maxSize - (Optional) The maximum number of bytes to decompress.
 *                  If not provided, the full content is decompressed.
 * @returns A Buffer containing the decompressed data (up to maxSize bytes if provided).
 */
export const gunzip = (compressed: Buffer, maxSize?: number): Buffer => {
  // If maxSize is not provided, allow decompression up to a very high number.
  const max = maxSize ?? 1024 * 1024;
  let decompressed = Buffer.from([]);

  // fflate.Decompress accepts a callback that receives each decompressed chunk.
  const decompressStream = new fflate.Decompress((chunk) => {
    if (decompressed.length < max) {
      // Only append as much as needed to not exceed max.
      decompressed = Buffer.concat([
        decompressed,
        chunk.slice(0, max - decompressed.length),
      ]);
    }
  });

  // Push chunks of the compressed data (in 1024-byte blocks) until the full data
  // is processed or until we've reached the max decompressed size.
  for (let i = 0; i < compressed.length; i += 1024) {
    if (decompressed.length >= max) break;
    decompressStream.push(compressed.slice(i, i + 1024));
  }

  return decompressed;
};
