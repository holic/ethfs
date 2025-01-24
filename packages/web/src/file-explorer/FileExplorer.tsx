"use client";

import { DateTime } from "luxon";
import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import { useChain } from "../ChainContext";
import { OnchainFile } from "../common";
import { DocumentIcon } from "../icons/DocumentIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { PendingPlaceholder } from "../PendingPlaceholder";
import { pluralize } from "../pluralize";
import { UIWindow } from "../UIWindow";
import { useIsMounted } from "../useIsMounted";
import { usePromise } from "../usePromise";
import { useStore as useWindowStackStore } from "../useWindowStack";
import {
  FileCreated,
  FileListRow,
  FileName,
  FileSize,
  FileType,
} from "./FileList";
import { FileViewer } from "./FileViewer";

export function FileExplorer() {
  const chain = useChain();
  const isMounted = useIsMounted();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFile, setCurrentFile] = useState<OnchainFile | null>(null);
  const focusWindow = useWindowStackStore((state) => state.focusWindow);

  // TODO: switch to useQuery for better caching
  const files = usePromise(
    useMemo(() => {
      if (!isMounted) return;
      return fetch(
        `${process.env.NEXT_PUBLIC_PONDER_URL}/api/${
          chain.id
        }/files?${new URLSearchParams({
          filename: searchQuery,
        })}`,
      ).then((res) => res.json() as Promise<OnchainFile[]>);
    }, [chain.id, isMounted, searchQuery]),
  );

  // TODO: refetch on interval

  const resetCurrentFile = useCallback(() => setCurrentFile(null), []);

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
                <SearchIcon strokeWidth={3.5} />
              </div>
            </div>
          </>
        }
        statusBar={
          <>
            <div>
              {files.status === "fulfilled"
                ? pluralize(files.value.length, "file", "files")
                : null}
            </div>
            <div>{chain.name}</div>
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
          className={twMerge(
            `flex-grow py-1`,
            files.status === "pending"
              ? "opacity-50 pointer-events-none"
              : null,
          )}
        >
          {files.status === "fulfilled" ? (
            <>
              {files.value.map((file) => (
                <FileListRow
                  key={file.filename}
                  className={twMerge(
                    "text-stone-500 hover:bg-lime-200 cursor-pointer select-none",
                    file.filename === currentFile?.filename
                      ? "bg-stone-100"
                      : null,
                  )}
                  onDoubleClick={() => {
                    setCurrentFile(file);
                    focusWindow("FileViewer");
                  }}
                >
                  <FileName className="flex gap-2">
                    <span className="text-stone-400">
                      <DocumentIcon strokeWidth={2.5} />
                    </span>
                    <span className="text-black">{file.filename}</span>
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
              ))}
              {chain.id === 1 ? (
                <div className="m-3 mt-6 bg-stone-100 p-3 text-sm text-stone-500 [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-stone-300 hover:[&_a]:text-black">
                  Missing files? EthFS{" "}
                  <a
                    href="https://twitter.com/frolic/status/1749058887372636455"
                    target="_blank"
                  >
                    just got an upgrade
                  </a>
                  . Files in v1 still exist onchain and{" "}
                  <Link href="/mainnet/migrate-v1">can be migrated to v2</Link>.
                </div>
              ) : null}
            </>
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
        <FileViewer file={currentFile} onClose={resetCurrentFile} />
      ) : null}
    </>
  );
}
