import { DateTime } from "luxon";
import React from "react";
import { gql } from "urql";

import { useFileViewerQuery } from "../../codegen/subgraph";
import { fileStore } from "../contracts";
import { targetChain } from "../EthereumProviders";
import { PendingIcon } from "../icons/PendingIcon";
import { UIWindow } from "../ui/UIWindow";
import { FileThumbnail, FileThumbnailFragment } from "./FileThumbnail";

gql`
  query FileViewer($id: ID!) {
    file(id: $id) {
      id
      name
      type
      size
      createdAt
      encoding
      compression
      license
      ...FileThumbnail
    }
    ${FileThumbnailFragment}
  }
`;

type Props = {
  id: string;
  name: string;
  onClose: () => void;
};

const FileViewerContents = ({ id }: Props) => {
  const [result] = useFileViewerQuery({ variables: { id } });
  const file = result.data?.file;

  if (!file) {
    // TODO: better loading visuals
    return (
      <div className="min-h-full flex items-center justify-center text-4xl text-stone-400 bg-stone-200">
        <PendingIcon />
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col gap-4 p-8 items-center bg-stone-200">
        <FileThumbnail file={file} />
        {file.name}
      </div>
      <div className="flex-grow bg-white">
        <div className="grid grid-cols-12 p-6 gap-4 text-base leading-none">
          <div className="col-span-3 text-stone-500">File type</div>
          <div className="col-span-9">{file.type ?? "Unknown"}</div>
          <div className="col-span-3 text-stone-500">File size</div>
          <div className="col-span-9">{file.size.toLocaleString()} bytes</div>
          <div className="col-span-3 text-stone-500">Data encoding</div>
          <div className="col-span-9">{file.encoding ?? "None or unknown"}</div>
          <div className="col-span-3 text-stone-500">Compression</div>
          <div className="col-span-9">
            {file.compression ?? "None or unknown"}
          </div>
          <div className="col-span-3 text-stone-500">Created at</div>
          <div
            className="col-span-9"
            title={DateTime.fromSeconds(file.createdAt).toISO()}
          >
            {DateTime.fromSeconds(file.createdAt).toRFC2822()}
          </div>
          {file.license ? (
            <>
              <div className="col-span-3 text-stone-500">License</div>
              <div className="col-span-9">
                <textarea
                  className="block w-full h-24 p-4 bg-stone-100 text-stone-500 text-sm leading-none whitespace-pre"
                  readOnly
                >
                  {file.license}
                </textarea>
              </div>
            </>
          ) : null}
          <div className="col-span-3 text-stone-500">Usage</div>
          <div className="col-span-9 flex flex-col gap-4">
            {file.type?.startsWith("image/") ? (
              <div className="bg-teal-100 text-teal-900 p-4 font-mono leading-normal whitespace-pre">
                {`
IFileStore fileStore = IFileStore(${fileStore.address});

string.concat(
  "<img src=\\"data:${file.type}${
                  file.encoding === "base64" ? ";base64" : ""
                },",
  fileStore.getFile("${file.name}").read(),
  "\\" />"
);
              `.trim()}
              </div>
            ) : file.type?.includes("javascript") ? (
              <>
                <div className="bg-teal-100 text-teal-900 p-4 font-mono leading-normal whitespace-pre overflow-auto">
                  {`
IFileStore fileStore = IFileStore(${fileStore.address});

string.concat(
  "<script ${
    file.compression === "gzip" ? 'type=\\"text/javascript+gzip\\" ' : ""
  }src=\\"data:${file.type}${file.encoding === "base64" ? ";base64" : ""},",
  fileStore.getFile("${file.name}").read(),
  "\\"></script>"
);
              `.trim()}
                </div>
                {file.compression === "gzip" ? (
                  <>
                    <p>
                      For compressed files, you&apos;ll also need to include the
                      decompression library between the script tag above and
                      where it&apos;s used.
                    </p>
                    <div className="bg-teal-100 text-teal-900 p-4 font-mono leading-normal whitespace-pre overflow-auto">
                      {`
string.concat(
  "<script src=\\"data:text/javascript;base64,",
  fileStore.getFile("gunzipScripts-0.0.1.js").read(),
  "\\"></script>"
);
`.trim()}
                    </div>
                  </>
                ) : null}
              </>
            ) : (
              <>
                This file may have been uploaded separately from this UI.{" "}
                <a
                  href={`https://github.com/holic/ethfs/issues/new?title=${encodeURIComponent(
                    `Add usage example for ${file.type}`
                  )}&body=${encodeURIComponent(
                    `File name: ${file.name}\nFile type: ${file.type}\n\n`
                  )}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-teal-600 hover:underline hover:underline-offset-2"
                >
                  Let us know &rarr;
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FileViewer = (props: Props) => {
  return (
    <UIWindow
      id="FileViewer"
      titleBar={
        <>
          File Viewer
          <span
            className="cursor-pointer font-normal text-2xl leading-none p-1 -my-2"
            onClick={props.onClose}
          >
            &times;
          </span>
        </>
      }
      statusBar={
        <>
          <div>{props.name}</div>
          <div>{targetChain.name}</div>
        </>
      }
      initialX={600}
      initialY={80}
      initialWidth={700}
      initialHeight={600}
    >
      <FileViewerContents key={props.id} {...props} />
    </UIWindow>
  );
};
