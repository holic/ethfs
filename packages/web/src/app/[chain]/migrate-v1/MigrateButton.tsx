"use client";

import { toast } from "react-toastify";
import { BaseError, Hex } from "viem";

import { useChain } from "../../../ChainContext";
import { WriteButton } from "../../../WriteButton";
import { Button } from "./Button";
import { createFile } from "./createFile";
import { File } from "./getFiles";

type Props = {
  file: File;
};

export function MigrateButton({ file }: Props) {
  const chain = useChain();
  const blockExplorer = chain.blockExplorers?.default;

  return (
    <WriteButton
      chainId={chain.id}
      onWrite={async () => {
        const toastId = toast.loading("Fetching content pointers…");
        const pointers = (await fetch(
          `/api/${chain.id}/v1/files/${file.name}/pointers`,
        ).then((res) => res.json())) as Hex[];

        console.log("creating file");
        await createFile(chain.id, file, pointers, (message) => {
          toast.update(toastId, { render: message });
        }).then(
          (receipt) => {
            toast.update(toastId, {
              isLoading: false,
              type: "success",
              render: (
                <>
                  File created!{" "}
                  {blockExplorer ? (
                    <a
                      href={`${blockExplorer.url}/tx/${receipt.transactionHash}`}
                    >
                      <a className="underline" onClick={() => toast.dismiss()}>
                        View tx on {blockExplorer.name} &rarr;
                      </a>
                    </a>
                  ) : null}
                </>
              ),
              autoClose: 15000,
              closeButton: true,
            });
          },
          (error) => {
            console.error("Error while attempting to create file", error);
            toast.update(toastId, {
              isLoading: false,
              type: "error",
              render:
                error instanceof BaseError
                  ? error.shortMessage
                  : error instanceof Error
                    ? error.message
                    : String(error),
              autoClose: 15000,
              closeButton: true,
            });
          },
        );
      }}
    >
      {({ "aria-label": ariaLabel, ...buttonProps }) => (
        <Button label="Migrate" hoverLabel={ariaLabel} {...buttonProps} />
      )}
    </WriteButton>
  );
}
