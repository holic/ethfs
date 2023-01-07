import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { gql } from "urql";
import { useAccount } from "wagmi";

import { useBountiesQuery } from "../../codegen/subgraph";
import { extractContractError } from "../extractContractError";
import { PendingIcon } from "../icons/PendingIcon";
import { BountyFile } from "../pages/api/bounties";
import { usePromise } from "../usePromise";
import { uploadContent } from "./uploadContent";

// TODO: paginate?
gql`
  query Bounties($checksums: [String!]!) {
    chunks(where: { checksum_in: $checksums }) {
      checksum
    }
  }
`;

const Bounties = () => {
  const { connector } = useAccount();
  const { openConnectModal } = useConnectModal();

  const bounties = usePromise(
    useMemo(
      () =>
        fetch("/api/bounties").then(
          (res) => res.json() as Promise<BountyFile[]>
        ),
      []
    )
  );
  console.log("bounties", bounties);

  const desiredChecksums = useMemo(
    () =>
      bounties.type === "fulfilled"
        ? bounties.value.flatMap((file) => file.checksums)
        : [],
    [bounties]
  );
  console.log("desiredChecksums", desiredChecksums);

  const [bountiesQuery, executeQuery] = useBountiesQuery({
    variables: { checksums: desiredChecksums },
  });
  const checksums =
    bountiesQuery.data?.chunks.map((chunk) => chunk.checksum) ?? [];
  console.log("uploaded checksums", checksums);

  useEffect(() => {
    const timer = setInterval(() => {
      executeQuery({ requestPolicy: "cache-and-network" });
    }, 5000);
    return () => clearInterval(timer);
  }, [executeQuery]);

  if (bounties.type === "pending" || bountiesQuery.fetching) {
    return <PendingIcon />;
  }
  if (bounties.type === "rejected") {
    console.error("fetch bounties error", bounties.error);
    return <div>Error fetching bounties</div>;
  }
  if (bountiesQuery.error) {
    console.error("query bounties error", bountiesQuery.error);
    return <div>Error querying chunks</div>;
  }

  return (
    <div>
      {bounties.value.map((file) => (
        <div key={file.name} className="flex flex-col gap-1">
          <div className="text-lime-600 font-black">{file.name}</div>
          <div className="grid grid-cols-6 gap-1">
            {file.checksums.map((checksum, i) => {
              const content = file.contents[i];

              if (checksums.includes(checksum)) {
                return (
                  <div className="border-4 border-transparent p-2 text-sm text-left whitespace-nowrap text-ellipsis overflow-hidden">
                    <span className="font-black text-lime-500">✓</span>{" "}
                    {checksum}
                  </div>
                );
              }

              return (
                <button
                  key={checksum}
                  type="button"
                  className="group relative border-4 border-lime-400 hover:border-lime-600 p-2 text-sm text-left whitespace-nowrap text-ellipsis overflow-hidden"
                  onClick={
                    !connector
                      ? openConnectModal
                      : (event) => {
                          event.preventDefault();
                          if (!connector) return;
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
                  {checksum}
                  <span className="hidden group-hover:flex absolute inset-0 items-center justify-center bg-lime-200 font-bold text-lime-700">
                    {connector ? "Upload" : "Connect"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Bounties;
