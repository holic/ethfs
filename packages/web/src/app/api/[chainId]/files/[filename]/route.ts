import { getFile } from "./getFile";

export async function GET(
  req: Request,
  { params }: { params: { chainId: string; filename: string } },
) {
  const chainId = parseInt(params.chainId) || 0;

  const data = await getFile(chainId, params.filename);

  // TODO: handle reverts (e.g. FileNotFound)
  // TODO: add cache headers

  return Response.json(data);
}
