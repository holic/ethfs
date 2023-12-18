"use client";

import { useMemo } from "react";

import { OnchainFile } from "../common";
import { gunzip } from "../gunzip";
import { useIsMounted } from "../useIsMounted";
import { usePromise } from "../usePromise";

type Props = {
  file: OnchainFile;
};

export const FileThumbnail = ({ file: { filename } }: Props) => {
  const isMounted = useIsMounted();
  const file = usePromise(
    useMemo(
      () =>
        isMounted
          ? fetch(`/api/files/${filename}`).then(
              (res) =>
                res.json() as Promise<
                  (OnchainFile & { contents: string }) | null
                >,
            )
          : null,
      [isMounted, filename],
    ),
  );

  // TODO: better loading indicator
  if (file.status === "pending" || file.status === "idle") {
    return null;
  }
  // TODO: better error state
  if (file.status === "rejected") {
    return null;
  }

  if (file.value == null) {
    return (
      <div className="w-64 h-64 bg-white border-2 border-stone-400 shadow-hard flex items-center justify-center text-stone-500 italic">
        File not found.
      </div>
    );
  }

  if (file.value.type?.startsWith("image/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`data:${file.value.type}${
          file.value.encoding === "base64" ? ";base64" : ""
        },${file.value.contents}`}
        className="max-w-64 max-h-64 object-contain bg-white border-2 border-stone-400 shadow-hard"
        alt={file.value.filename}
      />
    );
  }

  const decodedContents =
    file.value.encoding === "base64"
      ? Buffer.from(file.value.contents, "base64")
      : Buffer.from(file.value.contents);

  const contents =
    file.value.compression === "gzip"
      ? gunzip(decodedContents)
      : decodedContents;

  return (
    <iframe
      className="w-64 h-64 bg-white border-2 border-stone-400 shadow-hard"
      src={`data:text/plain;charset=utf-8;base64,${contents
        .slice(0, 1024 * 64)
        .toString("base64")}`}
    />
  );
};
