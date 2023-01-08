import classNames from "classnames";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { gql } from "urql";

import {
  FileExplorerQuery,
  useFileExplorerQuery,
} from "../../codegen/subgraph";
import { targetChain, targetChainId } from "../EthereumProviders";
import { DocumentIcon } from "../icons/DocumentIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { PendingPlaceholder } from "../PendingPlaceholder";
import { pluralize } from "../pluralize";
import { UIWindow } from "../ui/UIWindow";
import { useStore as useWindowOrderStore } from "../ui/useWindowOrder";
import {
  FileCreated,
  FileListRow,
  FileName,
  FileSize,
  FileType,
} from "./FileList";
import { FileViewer } from "./FileViewer";

gql`
  query FileExplorer($searchQuery: String) {
    files(
      first: 100
      where: { name_contains_nocase: $searchQuery }
      orderBy: createdAt
      orderDirection: desc
    ) {
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
  const [files, executeQuery] = useFileExplorerQuery({
    variables: { searchQuery },
  });
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const focusWindow = useWindowOrderStore((state) => state.focusWindow);

  useEffect(() => {
    const timer = setInterval(() => {
      executeQuery({ requestPolicy: "cache-and-network" });
    }, 5000);
    return () => clearInterval(timer);
  }, [executeQuery]);

  return (
    <>
      <UIWindow
        id="FileExplorer"
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
            <div>{targetChain.name}</div>
          </>
        }
        initialX={380}
        initialY={100}
        initialWidth={800}
        initialHeight={400}
      >
        <FileListRow className="text-stone-500 text-base leading-none border-b-2 border-stone-400">
          <FileName>Name</FileName>
          <FileType>Type</FileType>
          <FileSize title="File size after encoding, compression, etc.">
            Size*
          </FileSize>
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
                className={classNames(
                  "text-stone-500 hover:bg-lime-200 cursor-pointer select-none",
                  file.id === currentFile?.id ? "bg-stone-100" : null
                )}
                onDoubleClick={() => {
                  setCurrentFile(file);
                  focusWindow("FileViewer");
                }}
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
                  {DateTime.fromSeconds(file.createdAt).toRelativeCalendar({
                    unit: "days",
                  })}
                </FileCreated>
              </FileListRow>
            ))
          ) : (
            <>
              <FileListRow className="text-stone-500">
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
              <FileListRow className="text-stone-500">
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
        <FileViewer
          id={currentFile.id}
          name={currentFile.name}
          onClose={() => setCurrentFile(null)}
        />
      ) : null}
    </>
  );
};
