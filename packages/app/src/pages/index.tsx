import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";

import { FileExplorer } from "../file-explorer/FileExplorer";

const HomePage: NextPage = () => {
  return (
    <div className="min-h-screen bg-lime-200 text-lg leading-none relative">
      <div className="absolute inset-0 text-[12rem] font-black text-lime-400 pointer-events-none select-none">
        Ethereum
        <br />
        File
        <br />
        System
      </div>
      <div className="h-full relative flex flex-col">
        <div className="self-end p-2">
          <ConnectButton />
        </div>
        <FileExplorer />
      </div>
    </div>
  );
};

export default HomePage;
