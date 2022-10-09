import { gql } from "urql";

import { FileThumbnailFragment as File } from "../../codegen/subgraph";

export { FileThumbnailFragmentDoc as FileThumbnailFragment } from "../../codegen/subgraph";

gql`
  fragment FileThumbnail on File {
    name
    contents
    type
    encoding
    compression
  }
`;

type Props = {
  file: File;
};

export const FileThumbnail = ({ file }: Props) => {
  if (file.type?.startsWith("image/")) {
    return (
      <img
        src={`data:${file.type}${file.encoding === "base64" ? ";base64" : ""},${
          file.contents
        }`}
        className="max-w-64 max-h-64 object-contain bg-white border-2 border-stone-400 shadow-hard"
        alt={file.name}
      />
    );
  }

  return (
    <iframe
      className="w-64 h-64 bg-white border-2 border-stone-400 shadow-hard"
      src={`data:${file.type ?? "text/plain"}${
        file.encoding === "base64" ? ";base64" : ""
      },${file.contents}`}
    />
  );
};
