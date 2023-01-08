import { useConnectModal } from "@rainbow-me/rainbowkit";
import { formatEther } from "ethers/lib/utils";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useFeeData, useQuery } from "wagmi";

import { Button } from "../Button";
import { targetChain } from "../EthereumProviders";
import { extractContractError } from "../extractContractError";
import { FileThumbnail } from "../file-explorer/FileThumbnail";
import { DocumentArrowUpIcon } from "../icons/DocumentArrowUpIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { pluralize } from "../pluralize";
import { UIWindow } from "../ui/UIWindow";
import { useWindowOrder } from "../ui/useWindowOrder";
import { estimateFileUploadGas } from "./estimateFileUploadGas";
import { FileUploadTarget } from "./FileUploadTarget";
import {
  compressPreparedFile,
  decompressPreparedFile,
  PreparedFile,
} from "./prepareFile";
import { uploadFile } from "./uploadFile";

const gunzipScriptsSize = 6088;

export const FileUploader = () => {
  const { connector } = useAccount();
  const { openConnectModal } = useConnectModal();
  // TODO: handle multiple files?
  const [file, setFile] = useState<PreparedFile | null>(null);
  const windowId = "FileUploader";
  const windowOrder = useWindowOrder(windowId);

  const { data: feeData } = useFeeData();
  const { data: gasEstimate } = useQuery(
    [file?.name],
    async () => {
      if (!file) throw new Error("No file to estimate gas for");
      return estimateFileUploadGas(file);
    },
    {
      enabled: !!file,
    }
  );

  const estimatedFee =
    feeData?.maxFeePerGas && gasEstimate
      ? Math.round(
          parseFloat(formatEther(gasEstimate.mul(feeData.maxFeePerGas))) * 1000
        ) / 1000
      : null;

  return (
    <UIWindow
      id={windowId}
      titleBar={<>File Uploader</>}
      statusBar={
        <>
          <div>{pluralize(file ? 1 : 0, "file", "files")} selected</div>
          <div>{targetChain.name}</div>
        </>
      }
      initialX={180}
      initialY={240}
      initialWidth={700}
      initialHeight={500}
    >
      {!file ? (
        <FileUploadTarget
          id="FileUploader-target"
          className="h-full flex flex-col justify-center items-center p-16 bg-stone-200 cursor-pointer transition group text-stone-500"
          onFiles={(preparedFiles) => {
            setFile(preparedFiles[0]);
          }}
          onFilesOver={windowOrder.focus}
        >
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="text-5xl opacity-70 transition group-hover:-translate-y-2 group-hover:text-lime-600 group-hover:scale-125">
              <DocumentArrowUpIcon />
            </div>

            <p className="mb-2">
              <span className="font-semibold">Pick a file</span> or drag and
              drop
            </p>
          </div>
        </FileUploadTarget>
      ) : (
        <>
          <div className="flex flex-col gap-4 p-8 items-center bg-stone-200">
            <FileThumbnail
              file={{
                name: file.name,
                type: file.metadata.type,
                contents: file.contents.join(""),
                encoding: file.metadata.encoding,
              }}
            />
            {file.name}
          </div>
          <div className="flex flex-col p-3 pb-8 gap-8 text-stone-500">
            <div className="flex items-start justify-between">
              <div className="flex gap-2">
                <span className="text-stone-400">
                  <DocumentIcon />
                </span>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-8">
                    <span className="text-black">{file.name}</span>

                    {file.metadata.type.startsWith("text/") &&
                    file.original.size > gunzipScriptsSize ? (
                      <label className="flex items-center gap-1 text-sm text-">
                        <input
                          type="checkbox"
                          onChange={(event) => {
                            event.currentTarget.checked
                              ? setFile(compressPreparedFile(file))
                              : setFile(decompressPreparedFile(file));
                          }}
                        />
                        <span>Compress</span>
                      </label>
                    ) : null}
                  </div>
                  <ul className="list-['•'] ml-2 flex flex-col gap-2 text-base leading-none text-stone-500">
                    <li className="pl-1">
                      {(file.original.size / 1024).toFixed(0)} KB &rarr;{" "}
                      {(file.size / 1024).toFixed(0)} KB base64-encoded
                    </li>
                    <li className="pl-1">
                      {pluralize(
                        file.contents.length + 1,
                        "transaction",
                        "transactions"
                      )}{" "}
                      (one per 24 KB chunk, one for file metadata)
                    </li>
                    <li className="pl-1">
                      {!estimatedFee ? (
                        <>estimating gas&hellip;</>
                      ) : (
                        <>estimated ~{estimatedFee} ETH in total gas fees</>
                      )}
                    </li>
                    {file.metadata.compression ? (
                      <li className="pl-1">
                        compressed files require an extra dependency to
                        decompress in browser (code provided in the file viewer)
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
              <button
                type="button"
                className="flex-none text-stone-400 hover:text-orange-500 text-base leading-none"
                onClick={() => setFile(null)}
              >
                &times; Clear file
              </button>
            </div>
            <form
              className="flex flex-col items-center gap-6"
              onSubmit={(event) => {
                event.preventDefault();
                if (!connector) {
                  openConnectModal?.();
                  return;
                }

                if (!event.currentTarget.checkValidity()) {
                  toast.error(
                    "You must complete all prompts before uploading."
                  );
                  return;
                }

                const formData = new FormData(event.currentTarget);
                const license = formData.get("license") as string | null;

                const toastId = toast.loading("Starting…");
                uploadFile(
                  connector,
                  {
                    ...file,
                    metadata: {
                      ...file.metadata,
                      license: license || undefined,
                    },
                  },
                  (message) => {
                    console.log("got progress", message);
                    toast.update(toastId, { render: message });
                  }
                ).then(
                  () => {
                    // TODO: show etherscan link?
                    toast.update(toastId, {
                      isLoading: false,
                      type: "success",
                      render: `File created!`,
                      autoClose: 5000,
                      closeButton: true,
                    });
                    event.currentTarget.reset();
                    setFile(null);
                  },
                  (error) => {
                    const contractError = extractContractError(error);
                    toast.update(toastId, {
                      isLoading: false,
                      type: "error",
                      render: contractError,
                      autoClose: 5000,
                      closeButton: true,
                    });
                  }
                );
              }}
            >
              <div className="flex flex-col items-start max-w-[28rem] text-stone-500 text-lg gap-3">
                <label className="w-full">
                  <p>License, if applicable:</p>
                  <textarea
                    className="block w-full h-20 p-4 bg-stone-100 text-stone-500 placeholder-stone-500/40 text-sm leading-none whitespace-pre"
                    name="license"
                    placeholder="Please copy+paste the full license here"
                  ></textarea>
                </label>
                <label className="flex items-baseline gap-3">
                  <input type="checkbox" name="i-can-redistribute" required />
                  <span>
                    I am permitted to redistribute this file for any use or
                    purpose, commercial or non-commercial. If the file has an
                    associated license, I have included it above.
                  </span>
                </label>
                <label className="flex items-baseline gap-3">
                  <input
                    type="checkbox"
                    name="blockchain-is-forever"
                    required
                  />
                  <span>
                    I understand that uploading this file to the Ethereum
                    blockchain will make it publicly available indefinitely and
                    it cannot be deleted.
                  </span>
                </label>
              </div>
              <Button type="submit" disabled={!connector && !openConnectModal}>
                {connector ? "Upload" : "Connect wallet"}
              </Button>
            </form>
          </div>
        </>
      )}
    </UIWindow>
  );
};
