"use client";

import { Hex } from "viem";

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
  return (
    <WriteButton
      chainId={chain.id}
      onWrite={async () => {
        console.log("creating file");
        const pointers = (await fetch(
          `/api/${chain.id}/v1/files/${file.name}/pointers`,
        ).then((res) => res.json())) as Hex[];

        await createFile(chain.id, file, pointers, () => {});
      }}
    >
      {({ "aria-label": ariaLabel, ...buttonProps }) => (
        <Button label="Migrate" hoverLabel={ariaLabel} {...buttonProps} />
      )}
    </WriteButton>
  );
}
