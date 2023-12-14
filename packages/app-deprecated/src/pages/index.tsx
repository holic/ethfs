import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Link from "next/link";

import { FileExplorer } from "../file-explorer/FileExplorer";
import { FileUploader } from "../file-upload/FileUploader";
import { DocumentArrowUpIcon } from "../icons/DocumentArrowUpIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { GithubIcon } from "../icons/GithubIcon";
import { TwitterIcon } from "../icons/TwitterIcon";

const HomePage: NextPage = () => {
  return (
    <div className="w-screen min-h-screen bg-lime-200 text-lg leading-none relative overflow-hidden">
      <div className="absolute inset-0 text-[12rem] font-black text-lime-400 pointer-events-none select-none">
        Ethereum
        <br />
        File
        <br />
        System
      </div>
      <div className="absolute inset-0 flex flex-col items-end justify-end">
        <div className="flex flex-col p-8 gap-8">
          <Link href="/bounties" passHref>
            <a className="text-lime-500 hover:text-lime-600 flex flex-col items-center justify-center p-2 gap-1 border-2 border-transparent border-dotted outline-none focus:border-current">
              <span className="text-6xl">
                <DocumentArrowUpIcon />
              </span>
              File Bounties
            </a>
          </Link>
          <a
            href="https://twitter.com/frolic"
            target="_blank"
            rel="noopener noreferer noreferrer"
            className="text-lime-500 hover:text-lime-600 flex flex-col items-center justify-center p-2 gap-1 border-2 border-transparent border-dotted outline-none focus:border-current"
          >
            <span className="text-6xl">
              <TwitterIcon />
            </span>
            Say hello &rarr;
          </a>
          <a
            href="https://github.com/holic/ethfs"
            target="_blank"
            rel="noopener noreferer noreferrer"
            className="text-lime-500 hover:text-lime-600 flex flex-col items-center justify-center p-2 gap-1 border-2 border-transparent border-dotted outline-none focus:border-current"
          >
            <span className="text-6xl">
              <GithubIcon />
            </span>
            View source &rarr;
          </a>
        </div>
      </div>
      <div className="h-full relative flex flex-col">
        <div className="self-end p-2">
          <ConnectButton />
        </div>
        <FileUploader />
        <FileExplorer />
      </div>
    </div>
  );
};

export default HomePage;
