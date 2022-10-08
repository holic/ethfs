import { gql } from "urql";

import { useFileThumbnailQuery } from "../../codegen/subgraph";
import { PendingIcon } from "../icons/PendingIcon";

gql`
  query FileThumbnail($id: ID!) {
    file(id: $id) {
      id
      name
      contents
      type
      encoding
      compression
    }
  }
`;

type Props = {
  id: string;
};

const FileThumbnailInner = ({ id }: Props) => {
  const [query] = useFileThumbnailQuery({ variables: { id } });
  const file = query.data?.file;

  if (!file) {
    return <PendingIcon />;
  }

  if (file.type?.startsWith("image/")) {
    return (
      <img
        src={`data:${file.type}${file.encoding === "base64" ? ";base64" : ""},${
          file.contents
        }`}
        className="object-contain"
        alt={file.name}
      />
    );
  }

  return (
    <div className="overflow-hidden break-all text-ellipsis font-mono text-xs text-stone-500">
      {file.encoding === "base64"
        ? atob(file.contents.slice(0, 1024))
        : file.contents.slice(0, 1024)}
    </div>
  );
};

export const FileThumbnail = ({ id }: Props) => {
  return (
    <div className="w-full h-full flex align-items justify-center">
      <FileThumbnailInner id={id} />
    </div>
  );
};
