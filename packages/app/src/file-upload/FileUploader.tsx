import { useState } from "react";

import { FileThumbnail } from "../file-explorer/FileThumbnail";
import { DocumentArrowUpIcon } from "../icons/DocumentArrowUpIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { UIWindow } from "../ui/UIWindow";
import { FileUploadTarget } from "./FileUploadTarget";
import { PreparedFile } from "./prepareFile";

export const FileUploader = () => {
  // TODO: handle multiple files
  const [file, setFile] = useState<PreparedFile | null>(null);

  return (
    <UIWindow
      id="FileUploader"
      titleBar={<>File Uploader</>}
      statusBar={<>0 files</>}
      initialX={180}
      initialY={320}
      initialWidth={700}
      initialHeight={400}
    >
      {!file ? (
        <FileUploadTarget
          id="FileUploader-target"
          className="h-full flex flex-col justify-center items-center p-16 bg-stone-200 cursor-pointer transition group text-stone-500"
          onFiles={(preparedFiles) => {
            setFile(preparedFiles[0]);
          }}
        >
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="text-5xl opacity-70 transition group-hover:-translate-y-2 group-hover:text-lime-600 group-hover:scale-125">
              <DocumentArrowUpIcon />
            </div>

            <p className="mb-2">
              <span className="font-semibold">Pick a file</span> or drag and
              drop
            </p>
          </div>
        </FileUploadTarget>
      ) : (
        <>
          <div className="flex flex-col gap-4 p-8 items-center bg-stone-200">
            <FileThumbnail
              file={{
                name: file.name,
                type: file.metadata.type,
                contents: file.contents.join(""),
                encoding: file.metadata.encoding,
              }}
            />
          </div>
          <div className="flex flex-col p-3">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <span className="text-stone-400">
                  <DocumentIcon />
                </span>
                <span className="text-black">{file.name}</span>
              </div>
              <button
                type="button"
                className="text-stone-400 hover:text-orange-500 text-base leading-none"
                onClick={() => setFile(null)}
              >
                &times; Clear file
              </button>
            </div>
          </div>
        </>
      )}
    </UIWindow>
  );
};
