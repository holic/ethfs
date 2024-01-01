"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Hex } from "viem";
import { useNetwork, useSwitchNetwork, useWalletClient } from "wagmi";

import { useChain } from "../../../ChainContext";
import { createFile } from "./createFile";
import { File } from "./getFiles";

type Props = {
  file: File;
};

export function MigrateButton({ file }: Props) {
  const chain = useChain();
  const { data: walletClient } = useWalletClient();
  const { chain: walletChain } = useNetwork();
  const { isLoading: isSwitchingChain, switchNetwork } = useSwitchNetwork();
  const { openConnectModal } = useConnectModal();

  const shouldSwitchChain = chain.id !== walletChain?.id;

  return (
    <button
      onClick={async (event) => {
        event.preventDefault();

        if (!walletClient) {
          openConnectModal?.();
          return;
        }

        if (shouldSwitchChain && switchNetwork) {
          switchNetwork(chain.id);
        }

        const pointers = (await fetch(
          `/api/${chain.id}/v1/files/${file.name}/pointers`,
        ).then((res) => res.json())) as Hex[];

        await createFile(chain.id, file, pointers, () => {});
      }}
    >
      {file.name}
    </button>
  );
}
