import { getFileContents } from "./getFileContents";

export async function GET(
  req: Request,
  { params }: { params: { chainId: string; filename: string } },
) {
  const chainId = parseInt(params.chainId);
  if (!chainId) {
    throw new Error("Invalid chain ID");
  }

  const contents = await getFileContents(chainId, params.filename);

  // TODO: handle reverts (e.g. FileNotFound)
  // TODO: look up metadata in DB for file type + encoding
  // TODO: add cache headers

  return Response.json({ contents });
}
