import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useConnect, useSigner } from "wagmi";

import { Button } from "../Button";
import { extractContractError } from "../extractContractError";
import { FileThumbnail } from "../file-explorer/FileThumbnail";
import { DocumentArrowUpIcon } from "../icons/DocumentArrowUpIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { pluralize } from "../pluralize";
import { UIWindow } from "../ui/UIWindow";
import { useWindowOrder } from "../ui/useWindowOrder";
import { FileUploadTarget } from "./FileUploadTarget";
import { PreparedFile } from "./prepareFile";
import { uploadFile } from "./uploadFile";

export const FileUploader = () => {
  const { connector } = useAccount();
  const { openConnectModal } = useConnectModal();
  // TODO: handle multiple files?
  const [file, setFile] = useState<PreparedFile | null>(null);
  const windowId = "FileUploader";
  const windowOrder = useWindowOrder(windowId);

  return (
    <UIWindow
      id={windowId}
      titleBar={<>File Uploader</>}
      statusBar={<>0 files</>}
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
          </div>
          <div className="flex flex-col p-3 pb-8 gap-8">
            <div className="flex items-start justify-between">
              <div className="flex gap-2">
                <span className="text-stone-400">
                  <DocumentIcon />
                </span>
                <div className="flex flex-col gap-4">
                  <span className="text-black">{file.name}</span>
                  <div className="flex flex-col gap-2 text-base leading-none text-stone-500">
                    <span>
                      &bull; {(file.originalSize / 1024).toFixed(0)} KB &rarr;{" "}
                      {(file.size / 1024).toFixed(0)} KB base64-encoded
                    </span>
                    <span>
                      &bull;{" "}
                      {pluralize(
                        file.contents.length + 1,
                        "transaction",
                        "transactions"
                      )}{" "}
                      (one per 24 KB chunk, one for file metadata)
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="text-stone-400 hover:text-orange-500 text-base leading-none"
                onClick={() => setFile(null)}
              >
                &times; Clear file
              </button>
            </div>

            <Button
              disabled={!connector && !openConnectModal}
              onClick={
                connector
                  ? () => {
                      const toastId = toast.loading("Starting…");
                      uploadFile(connector, file, (message) => {
                        console.log("got progress", message);
                        toast.update(toastId, { render: message });
                      }).then(
                        () => {
                          // TODO: show etherscan link?
                          toast.update(toastId, {
                            isLoading: false,
                            type: "success",
                            render: `File created!`,
                            autoClose: 5000,
                            closeButton: true,
                          });
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
                    }
                  : openConnectModal
              }
            >
              {connector ? "Upload" : "Connect wallet"}
            </Button>
          </div>
        </>
      )}
    </UIWindow>
  );
};
