import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";

import { FileExplorer } from "../FileExplorer";
import { FileUpload } from "../FileUpload";

const HomePage: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="self-end p-2">
        <ConnectButton />
      </div>
      <div className="flex-grow flex flex-col gap-4 items-center justify-center p-8 pb-[50vh]">
        <h1 className="text-4xl">Example NFT</h1>

        <FileUpload />

        <FileExplorer />
      </div>
    </div>
  );
};

export default HomePage;
