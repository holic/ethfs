import { gql } from "urql";

import { useFileExplorerQuery } from "../codegen/subgraph";
import { PendingIcon } from "./PendingIcon";
import { useIsMounted } from "./useIsMounted";

gql`
  query FileExplorer {
    files(first: 100) {
      id
      name
      size
      type
      encoding
      compression
      contents
    }
  }
`;

export const FileExplorer = () => {
  const [query] = useFileExplorerQuery();

  // Temporarily workaround hydration issues where server-rendered markup
  // doesn't match the client due to localStorage caching in wagmi
  // See https://github.com/holic/web3-scaffold/pull/26
  const isMounted = useIsMounted();
  if (!isMounted) {
    return null;
  }

  if (!query.data) {
    return <PendingIcon />;
  }

  return (
    <div className="flex flex-col">
      <div className="uppercase text-sm text-slate-500 font-semibold">
        Files
      </div>
      <div className="grid grid-cols-3">
        {query.data.files.map((file) => (
          <div key={file.id}>
            {file.name} ({file.type})
            {file.type?.startsWith("image/") &&
            file.encoding === "base64" &&
            !file.compression ? (
              <img
                src={`data:${file.type};base64,${file.contents}`}
                className="w-16 h-16 object-cover"
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
