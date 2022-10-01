import React, { useState } from "react";
import { useSigner } from "wagmi";

import { Button } from "./Button";
import { DocumentArrowUpIcon } from "./icons/DocumentArrowUpIcon";
import { DocumentIcon } from "./icons/DocumentIcon";
import { PreparedFile, prepareFile } from "./upload/prepareFile";
import { uploadFile } from "./upload/uploadFile";

export const FileUpload = () => {
  const { data: signer } = useSigner();
  const [files, setFiles] = useState<PreparedFile[]>([]);
  console.log("got files", files);

  return (
    <>
      <label
        htmlFor="FileUpload-input"
        className="w-full flex flex-col justify-center items-center p-20 rounded-xl border-4 border-dashed border-gray-300 hover:border-sky-300 bg-gray-50 hover:bg-sky-100 text-gray-500 hover:text-sky-600 cursor-pointer transition"
        onDrop={async (event) => {
          event.preventDefault();

          const files = event.dataTransfer.items
            ? Array.from(event.dataTransfer.items)
                .map((item) => (item.kind === "file" ? item.getAsFile() : null))
                .filter((file): file is File => file != null)
            : Array.from(event.dataTransfer.files);

          const preparedFiles = await Promise.all(files.map(prepareFile));

          setFiles((prevFiles) => [...prevFiles, ...preparedFiles]);
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
      >
        <div className="flex flex-col justify-center items-center gap-2">
          <div className="text-5xl opacity-70">
            <DocumentArrowUpIcon />
          </div>

          <p className="mb-2">
            <span className="font-semibold">Pick a file</span> or drag and drop
          </p>
        </div>
        <input
          id="FileUpload-input"
          type="file"
          className="hidden"
          multiple
          onChange={async (event) => {
            const files = Array.from(event.target.files ?? []);
            if (files.length) {
              const preparedFiles = await Promise.all(files.map(prepareFile));
              setFiles((prevFiles) => [...prevFiles, ...preparedFiles]);
            }
            // Reset file input so selecting the same file twice works
            event.target.value = "";
          }}
        />
      </label>

      <div className="w-full grid grid-cols-12 gap-y-4 gap-x-2">
        {files.map((file, i) => (
          <React.Fragment key={i}>
            <div className="col-span-1 flex justify-center text-3xl">
              <DocumentIcon />
            </div>
            <div className="col-span-2 flex justify-center">
              {file?.metadata.type?.startsWith("image/") &&
              file.metadata.encoding === "base64" &&
              !file.metadata.compression ? (
                <img
                  src={`data:${file.metadata.type};base64,${file.contents.join(
                    ""
                  )}`}
                  className="w-16 h-16 object-cover"
                />
              ) : null}
            </div>
            <div className="col-span-3">{file.name}</div>
            <div className="col-span-3">
              {file.contents.length + 1} transactions
            </div>
            <div className="col-span-3">
              <Button
                disabled={!signer}
                onClick={() => {
                  if (!signer) return;
                  uploadFile(signer, file);
                }}
              >
                Upload
              </Button>
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};
