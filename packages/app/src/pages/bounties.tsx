import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";

import Bounties from "../bounties/Bounties";
import { PendingIcon } from "../icons/PendingIcon";
import { useIsMounted } from "../useIsMounted";

const BountiesPage: NextPage = () => {
  const isMounted = useIsMounted();
  return (
    <>
      <Head>
        <title>Bounties / EthFS</title>
      </Head>
      <div className="w-screen min-h-screen pb-[50vh] bg-lime-200 text-lime-800 text-lg flex flex-col">
        <div className="self-end p-2">
          <ConnectButton />
        </div>
        <div className="max-w-screen-md mx-auto flex flex-col gap-12 p-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl text-lime-500 font-black">
              EthFS Bounties
            </h1>
            <p>
              <strong>The on-chain community needs your help!</strong> We want
              the files below to exist on chain, but it&apos;s often too cost
              prohibitive for any one person or project to upload alone. You can
              pitch in and unlock new kinds of fully on-chain projects by
              uploading a chunk of one of the files below.
            </p>
          </div>
          {isMounted ? <Bounties /> : <PendingIcon />}
        </div>
      </div>
    </>
  );
};

export default BountiesPage;
