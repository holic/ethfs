"use client";

import { OnchainFile } from "../common";
import { gunzip } from "../gunzip";

type Props = {
  file: OnchainFile;
  contents: string;
};

export function FileThumbnail({ file, contents }: Props) {
  if (file.type?.startsWith("image/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`data:${file.type}${
          file.encoding === "base64" ? ";base64" : ""
        },${contents}`}
        className="max-w-64 max-h-64 object-contain bg-white border-2 border-stone-400 shadow-hard"
        alt={file.filename}
      />
    );
  }

  const decodedContents =
    file.encoding === "base64"
      ? Buffer.from(contents, "base64")
      : Buffer.from(contents);

  const decompressedContents =
    file.compression === "gzip" ? gunzip(decodedContents) : decodedContents;

  return (
    <iframe
      className="w-64 h-64 bg-white border-2 border-stone-400 shadow-hard"
      src={`data:text/plain;charset=utf-8;base64,${decompressedContents
        .slice(0, 1024 * 64)
        .toString("base64")}`}
    />
  );
}
