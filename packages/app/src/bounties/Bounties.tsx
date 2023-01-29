import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { gql } from "urql";
import { useAccount } from "wagmi";

import { useBountiesQuery } from "../../codegen/subgraph";
import { bounties } from "../bounties";
import { extractContractError } from "../extractContractError";
import { PendingIcon } from "../icons/PendingIcon";
import { BountyFile } from "../pages/api/prepare-bounties";
import { usePromise } from "../usePromise";
import { createFile } from "./createFile";
import { uploadContent } from "./uploadContent";

// TODO: paginate?
gql`
  query Bounties($checksums: [String!]!, $filenames: [String!]!) {
    chunks(where: { checksum_in: $checksums }) {
      checksum
    }
    files(where: { name_in: $filenames }) {
      name
    }
  }
`;

const Bounties = () => {
  const { connector } = useAccount();
  const { openConnectModal } = useConnectModal();

  const bountiesFetch = usePromise(
    useMemo(
      () =>
        Promise.all(
          Object.values(bounties).map((filename) =>
            fetch(`/bounties/${filename}.json`).then(
              (res) => res.json() as Promise<BountyFile>
            )
          )
        ),
      []
    )
  );

  const [desiredChecksums, desiredFilenames] = useMemo(
    () =>
      bountiesFetch.type === "fulfilled"
        ? [
            bountiesFetch.value.flatMap((file) => file.checksums),
            bountiesFetch.value.map((file) => file.name),
          ]
        : [[], []],
    [bountiesFetch]
  );
  console.log("desiredChecksums", desiredChecksums);
  console.log("desiredFilenames", desiredFilenames);

  const [bountiesQuery, executeQuery] = useBountiesQuery({
    variables: { checksums: desiredChecksums, filenames: desiredFilenames },
  });
  const checksums =
    bountiesQuery.data?.chunks.map((chunk) => chunk.checksum) ?? [];
  const filenames = bountiesQuery.data?.files.map((file) => file.name) ?? [];
  console.log("already uploaded checksums and filenames", checksums, filenames);

  useEffect(() => {
    const timer = setInterval(() => {
      executeQuery({ requestPolicy: "cache-and-network" });
    }, 5000);
    return () => clearInterval(timer);
  }, [executeQuery]);

  if (bountiesFetch.type === "pending" || bountiesQuery.fetching) {
    return <PendingIcon />;
  }
  if (bountiesFetch.type === "rejected") {
    console.error("fetch bounties error", bountiesFetch.error);
    return <div>Error fetching bounties</div>;
  }
  if (bountiesQuery.error) {
    console.error("query bounties error", bountiesQuery.error);
    return <div>Error querying chunks</div>;
  }

  return (
    <>
      {bountiesFetch.value.map((file) => {
        const hasCreatedFile = filenames.includes(file.name);
        const isReadyToCreateFile = file.checksums.every((checksum) =>
          checksums.includes(checksum)
        );

        return (
          <div key={file.name} className="flex flex-col gap-1">
            <div className="text-lime-600 font-black">{file.name}</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
              {file.checksums.map((checksum, i) => {
                const content = file.contents[i];

                if (checksums.includes(checksum)) {
                  return (
                    <div className="border-4 border-transparent p-2 text-sm whitespace-nowrap text-ellipsis overflow-hidden">
                      <span className="font-black text-lime-500">✓</span> Chunk{" "}
                      {checksum}
                    </div>
                  );
                }

                return (
                  <button
                    key={checksum}
                    type="button"
                    className="group relative border-4 border-lime-400 hover:border-lime-600 p-2 text-sm whitespace-nowrap text-ellipsis overflow-hidden"
                    onClick={
                      !connector
                        ? openConnectModal
                        : (event) => {
                            event.preventDefault();
                            const toastId = toast.loading("Starting…");
                            uploadContent(connector, content, (message) => {
                              toast.update(toastId, { render: message });
                            }).then(
                              () => {
                                // TODO: show etherscan link?
                                toast.update(toastId, {
                                  isLoading: false,
                                  type: "success",
                                  render: `Uploaded!`,
                                  autoClose: 5000,
                                  closeButton: true,
                                });
                              },
                              (error) => {
                                const contractError =
                                  extractContractError(error);
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
                    }
                  >
                    Chunk {checksum}
                    <span className="hidden group-hover:flex absolute inset-0 items-center justify-center bg-lime-200 font-bold text-lime-700">
                      {connector ? "Upload chunk" : "Connect wallet"}
                    </span>
                  </button>
                );
              })}
              {hasCreatedFile ? (
                <div className="border-4 border-transparent p-2 text-sm whitespace-nowrap text-ellipsis overflow-hidden">
                  <span className="font-black text-lime-500">✓</span> File
                  created
                </div>
              ) : isReadyToCreateFile ? (
                <button
                  type="button"
                  className="group relative border-4 border-lime-400 hover:border-lime-600 p-2 text-sm whitespace-nowrap text-ellipsis overflow-hidden"
                  onClick={
                    !connector
                      ? openConnectModal
                      : (event) => {
                          event.preventDefault();

                          const toastId = toast.loading("Starting…");
                          createFile(connector, file, (message) => {
                            toast.update(toastId, { render: message });
                          }).then(
                            () => {
                              // TODO: show etherscan link?
                              toast.update(toastId, {
                                isLoading: false,
                                type: "success",
                                render: `Uploaded!`,
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
                  }
                >
                  {connector ? "Create file" : "Connect wallet"}
                </button>
              ) : null}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Bounties;
