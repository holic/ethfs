import classNames from "classnames";
import { DateTime } from "luxon";
import React from "react";
import { gql } from "urql";

import { useFileExplorerQuery } from "../../codegen/subgraph";
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

export const FileExplorer = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [files] = useFileExplorerQuery({ variables: { searchQuery } });

  return (
    <div className="mx-auto mt-24 min-w-[48rem] min-h-[24rem] flex flex-col">
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
              <div className="absolute right-0 inset-y-0 pointer-events-none">
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
    </div>
  );
};
