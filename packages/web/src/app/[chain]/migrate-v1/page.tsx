import { Metadata } from "next";
import Link from "next/link";

import { DocumentIcon } from "../../../icons/DocumentIcon";
import { getFiles } from "./getFiles";
import { MigrateButton } from "./MigrateButton";

export const metadata: Metadata = {
  title: "Migrate v1 files / EthFS",
  // description: "Browse and upload onchain files",
};

// TODO: exclude already uploaded files (dupe filename)

export default async function MigrateV1Page({
  params,
}: {
  params: { chain: string };
}) {
  const files = await getFiles(params.chain);

  return (
    <div className="max-w-screen-md mx-auto flex flex-col gap-16 p-8 md:p-16">
      <div className="flex flex-col gap-4 text-lg [&_p_a]:underline [&_p_a]:brightness-150">
        <h1 className="text-5xl text-lime-500 font-black">
          Migrate <Link href="/">EthFS</Link> v1 files
        </h1>
        <p>
          Files stored onchain via{" "}
          <a
            href="https://github.com/holic/ethfs/tree/v1?tab=readme-ov-file#ethereum-mainnet-contracts"
            target="_blank"
          >
            EthFS v1 contracts
          </a>{" "}
          are still available and usable by importing the{" "}
          <a
            href="https://github.com/holic/ethfs/tree/v1/packages/contracts/src"
            target="_blank"
          >
            v1 interfaces
          </a>
          . But for ergonomics, you may want to use the{" "}
          <a
            href="https://github.com/holic/ethfs/tree/main/packages/contracts/src"
            target="_blank"
          >
            v2 interfaces
          </a>{" "}
          with files that are already onchain via v1.
        </p>
        <p>
          With a small transaction, a v2 file can be created that points to the
          onchain file contents and metadata from v1.
        </p>
      </div>
      <table className="-mx-2 [&_td]:p-2">
        <tbody>
          {files.map((file) => (
            <tr key={file.name} className="group hover:bg-lime-300">
              <td className="hidden md:table-cell">
                <DocumentIcon strokeWidth={2.5} className="text-lime-500" />
              </td>
              <td className="whitespace-nowrap">{file.name}</td>
              <td className="hidden md:table-cell text-lime-600/50 text-sm whitespace-nowrap">
                {file.type}
              </td>
              <td className="hidden md:table-cell text-lime-600/50 text-sm whitespace-nowrap">
                {(file.size / 1024).toFixed(0)} KB
              </td>
              <td className="w-full text-right opacity-20 group-hover:opacity-100">
                <MigrateButton file={file} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
