"use client";

import { useCallback } from "react";

import { OnchainFile } from "../common";
import { gunzip } from "../gunzip";
import { DownloadIcon } from "../icons/DownloadIcon";

type Props = {
  file: OnchainFile;
  contents: string;
};

export function FileThumbnail({ file, contents }: Props) {
  // Decode the contents (assuming base64 encoding if applicable).
  const decodedContents =
    file.encoding === "base64"
      ? Buffer.from(contents, "base64")
      : Buffer.from(contents);

  // Set a preview size limit.
  const previewMaxSize = 1024 * 1024;

  // For non-image files, decompress only up to previewMaxSize bytes.
  // (For images we use the original encoded content for rendering.)
  const previewContents =
    file.compression === "gzip"
      ? gunzip(decodedContents, previewMaxSize)
      : decodedContents.slice(0, previewMaxSize);

  // Create a download filename (if gzipped, remove the ".gz" extension).
  const downloadFilename =
    file.compression === "gzip"
      ? file.filename.replace(/\.gz$/, "")
      : file.filename;

  // Download handler: decompress fully (if needed) only when the user clicks "Download".
  const handleDownload = useCallback(() => {
    // For compressed files, decompress fully; otherwise use the decoded content.
    const fullContents =
      file.compression === "gzip" ? gunzip(decodedContents) : decodedContents;

    const blob = new Blob([fullContents], {
      type: file.type || "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [file, decodedContents, downloadFilename]);

  // Determine the preview element based on file type.
  const previewElement = file.type?.startsWith("image/") ? (
    // For images, render the <img> using the original encoded content.
    <img
      src={`data:${file.type}${file.encoding === "base64" ? ";base64" : ""},${contents}`}
      className="max-w-64 max-h-64 object-contain bg-white border-2 border-stone-400 shadow-hard"
      alt={file.filename}
    />
  ) : (
    // For non-images, render an <iframe> showing the preview (up to previewMaxSize bytes).
    <iframe
      className="w-64 h-64 bg-white border-2 border-stone-400 shadow-hard"
      src={`data:text/plain;charset=utf-8;base64,${previewContents.toString("base64")}`}
    />
  );

  return (
    <div className="flex flex-col gap-6">
      {previewElement}
      <div className="flex flex-row items-center justify-center gap-4 w-64">
        <p>{file.filename}</p>
        <p onClick={handleDownload} className="text-stone-400 cursor-pointer">
          <DownloadIcon />
        </p>
      </div>
    </div>
  );
}
