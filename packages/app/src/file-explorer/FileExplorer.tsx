import classNames from "classnames";
import { DateTime } from "luxon";
import React from "react";
import { gql } from "urql";

import { useFileExplorerQuery } from "../../codegen/subgraph";
import { DocumentIcon } from "../icons/DocumentIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { PendingPlaceholder } from "../PendingPlaceholder";
import { pluralize } from "../pluralize";
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
    <div className="mx-auto mt-24 min-w-[48rem] min-h-[24rem] bg-white border-4 border-stone-600 shadow-hard flex flex-col">
      <div className="bg-stone-600 text-white p-3 flex justify-between items-center">
        <div className="text-white font-bold text-xl leading-none">
          File Explorer
        </div>
        <div className="relative">
          <input
            type="text"
            className="bg-transparent border-2 border-stone-500 border-transparent focus:border-white outline-none text-base leading-none -my-2 -mr-1 pr-8 pl-1 py-1"
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <div className="absolute right-0 inset-y-0 pointer-events-none">
            <SearchIcon />
          </div>
        </div>
      </div>

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

      <div className="border-t-2 border-stone-400 bg-stone-200 text-stone-500 text-base leading-none px-3 py-1 flex justify-between">
        <div>
          {files.data
            ? pluralize(files.data.files.length, "file", "files")
            : null}
        </div>
        <div>Goerli</div>
      </div>
    </div>
  );
};
