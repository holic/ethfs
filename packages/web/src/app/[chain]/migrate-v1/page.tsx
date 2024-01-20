import { ConnectButton } from "@rainbow-me/rainbowkit";

import { getFiles } from "./getFiles";
import { MigrateButton } from "./MigrateButton";

export default async function FromV1Page({
  params,
}: {
  params: { chain: string };
}) {
  const files = await getFiles(params.chain);

  return (
    <div className="w-screen min-h-screen bg-lime-200 text-lg leading-none relative overflow-hidden">
      <div className="flex flex-col items-start p-4">
        {files.map((file) => (
          <div key={file.name}>
            {file.name} <MigrateButton file={file} />
          </div>
        ))}
      </div>
    </div>
  );
}
