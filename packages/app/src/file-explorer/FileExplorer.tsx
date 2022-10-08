import classNames from "classnames";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { gql } from "urql";

import {
  FileExplorerQuery,
  useFileExplorerQuery,
} from "../../codegen/subgraph";
import { DocumentIcon } from "../icons/DocumentIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { PendingPlaceholder } from "../PendingPlaceholder";
import { pluralize } from "../pluralize";
import { UIWindow } from "../ui/UIWindow";
import {
  FileCreated,
  FileListRow,
  FileName,
  FileSize,
  FileType,
} from "./FileList";
import { FileThumbnail } from "./FileThumbnail";

gql`
  query FileExplorer($searchQuery: String) {
    files(first: 100, where: { name_contains_nocase: $searchQuery }) {
      id
      name
      size
      createdAt
      type
      encoding
      compression
    }
  }
`;

type File = FileExplorerQuery["files"][number];

export const FileExplorer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [files] = useFileExplorerQuery({ variables: { searchQuery } });
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  return (
    <>
      <UIWindow
        titleBar={
          <>
            File Explorer
            <div className="relative">
              <input
                type="text"
                className="bg-transparent outline-none ring-2 ring-transparent focus:ring-stone-400 text-base leading-none font-normal py-1 pl-1 pr-7 -m-1"
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <div className="absolute right-0 inset-y-0 pointer-events-none flex items-center">
                <SearchIcon />
              </div>
            </div>
          </>
        }
        statusBar={
          <>
            <div>
              {files.data
                ? pluralize(files.data.files.length, "file", "files")
                : null}
            </div>
            <div>Goerli</div>
          </>
        }
        initialX={280}
        initialY={120}
        initialWidth={800}
        initialHeight={400}
      >
        <FileListRow className="text-stone-500 text-base leading-none border-b-2 border-stone-400">
          <FileName>Name</FileName>
          <FileType>Type</FileType>
          <FileSize>Size*</FileSize>
          <FileCreated>Created</FileCreated>
        </FileListRow>
        <div
          className={classNames(
            `flex-grow py-1`,
            !files.data || files.fetching
              ? "opacity-50 pointer-events-none"
              : null
          )}
        >
          {files.data ? (
            files.data.files.map((file) => (
              <FileListRow
                key={file.id}
                className="text-stone-500 hover:bg-lime-200 cursor-pointer"
                onClick={() => setCurrentFile(file)}
              >
                <FileName className="flex gap-2">
                  <span className="text-stone-400">
                    <DocumentIcon />
                  </span>
                  <span className="text-black">{file.name}</span>
                </FileName>
                <FileType>{file.type}</FileType>
                <FileSize className="tabular-nums">
                  {(file.size / 1024).toFixed(0)} KB
                </FileSize>
                <FileCreated
                  className="tabular-nums"
                  title={DateTime.fromSeconds(file.createdAt).toISO()}
                >
                  {DateTime.fromSeconds(file.createdAt).toRelativeCalendar()}
                </FileCreated>
              </FileListRow>
            ))
          ) : (
            <>
              <FileListRow className="text-stone-500 hover:bg-lime-200 cursor-pointer">
                <FileName className="flex gap-2">
                  <span className="text-stone-400">
                    <DocumentIcon />
                  </span>
                  <span className="text-black">
                    <PendingPlaceholder>example.txt</PendingPlaceholder>
                  </span>
                </FileName>
                <FileType>
                  <PendingPlaceholder>text/plain</PendingPlaceholder>
                </FileType>
                <FileSize className="tabular-nums">
                  <PendingPlaceholder>42 KB</PendingPlaceholder>
                </FileSize>
                <FileCreated className="tabular-nums">
                  <PendingPlaceholder>42 days ago</PendingPlaceholder>
                </FileCreated>
              </FileListRow>
              <FileListRow className="text-stone-500 hover:bg-lime-200 cursor-pointer">
                <FileName className="flex gap-2">
                  <span className="text-stone-400">
                    <DocumentIcon />
                  </span>
                  <span className="text-black">
                    <PendingPlaceholder>burning-text.gif</PendingPlaceholder>
                  </span>
                </FileName>
                <FileType>
                  <PendingPlaceholder>image/gif</PendingPlaceholder>
                </FileType>
                <FileSize className="tabular-nums">
                  <PendingPlaceholder>102 KB</PendingPlaceholder>
                </FileSize>
                <FileCreated className="tabular-nums">
                  <PendingPlaceholder>23 years ago</PendingPlaceholder>
                </FileCreated>
              </FileListRow>
            </>
          )}
        </div>
      </UIWindow>
      {currentFile ? (
        <UIWindow
          key={currentFile.id}
          titleBar={
            <>
              File Preview
              <span
                className="cursor-pointer font-normal text-2xl leading-none p-1 -my-2"
                onClick={() => setCurrentFile(null)}
              >
                &times;
              </span>
            </>
          }
          statusBar={<>{(currentFile.size / 1024).toFixed(0)} KB</>}
          initialX={600}
          initialY={80}
          initialWidth={700}
          initialHeight={500}
        >
          <div className="flex-grow flex flex-col gap-4 items-center justify-center bg-stone-200">
            {/* <span className="text-8xl text-stone-400">
              <DocumentIcon />
            </span> */}
            <div className="w-64 h-64 shadow-hard bg-white">
              <FileThumbnail id={currentFile.id} />
            </div>
            {currentFile.name}
          </div>
        </UIWindow>
      ) : null}
    </>
  );
};
