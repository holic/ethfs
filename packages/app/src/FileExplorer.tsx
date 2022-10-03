import classNames from "classnames";
import { DateTime } from "luxon";
import React from "react";
import { gql } from "urql";

import { useFileExplorerQuery } from "../codegen/subgraph";
import { DocumentIcon } from "./icons/DocumentIcon";
import { SearchIcon } from "./icons/SearchIcon";
import { PendingIcon } from "./PendingIcon";
import { pluralize } from "./pluralize";
import { useIsMounted } from "./useIsMounted";

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

  // Temporarily workaround hydration issues where server-rendered markup
  // doesn't match the client due to localStorage caching in wagmi
  // See https://github.com/holic/web3-scaffold/pull/26
  const isMounted = useIsMounted();
  if (!isMounted) {
    return null;
  }

  if (!files.data) {
    return <PendingIcon />;
  }

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

      <div className="grid grid-cols-12 text-stone-500 text-base leading-none border-b-2 border-stone-400">
        <div className="col-span-4 px-3 py-2">Name</div>
        <div className="col-span-3 px-3 py-2">Type</div>
        <div className="col-span-2 px-3 py-2">Size*</div>
        <div className="col-span-3 px-3 py-2">Created</div>
      </div>
      <div
        className={classNames(
          `flex-grow py-1`,
          files.fetching ? "opacity-50 pointer-events-none" : null
        )}
      >
        {files.data.files.map((file) => (
          <div
            key={file.id}
            className="grid grid-cols-12 hover:bg-lime-200 cursor-pointer"
          >
            <div className="col-span-4 px-3 py-2 flex gap-2">
              <div className="text-stone-400">
                <DocumentIcon />
              </div>
              {file.name}
            </div>
            <div className="col-span-3 px-3 py-2 text-stone-500">
              {file.type}
            </div>
            <div className="col-span-2 px-3 py-2 text-stone-500 tabular-nums">
              {(file.size / 1024).toFixed(0)} KB
            </div>
            <div
              className="col-span-3 px-3 py-2 text-stone-500 tabular-nums"
              title={DateTime.fromSeconds(file.createdAt).toISO()}
            >
              {DateTime.fromSeconds(file.createdAt).toRelativeCalendar()}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t-2 border-stone-400 bg-stone-200 text-stone-500 text-base leading-none px-3 py-1 flex justify-between">
        <div>{pluralize(files.data.files.length, "file", "files")}</div>
        <div>Goerli</div>
      </div>
    </div>
  );
};
