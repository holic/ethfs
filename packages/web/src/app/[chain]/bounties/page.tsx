import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bounties / EthFS",
  // description: "Browse and upload onchain files",
};

export default async function BountiesPage({
  params,
}: {
  params: { chain: string };
}) {
  return (
    <div className="max-w-screen-md mx-auto flex flex-col gap-16 p-8 md:p-16">
      <div className="flex flex-col gap-4 text-lg [&_p_a]:underline [&_p_a]:brightness-150">
        <h1 className="text-5xl text-lime-500 font-black">
          <Link href="/">EthFS</Link> Bounties
        </h1>
        <p>
          No active file bounties.{" "}
          <a href="https://github.com/holic/ethfs/issues/new" target="_blank">
            Suggest one
          </a>
          ?
        </p>
      </div>
    </div>
  );
}
