import { getFile } from "./getFile";

export async function GET(
  req: Request,
  { params }: { params: { chainId: string; filename: string } },
) {
  const chainId = params.chainId;

  const data = await getFile(parseInt(chainId ?? "0"), params.filename);

  // TODO: handle reverts (e.g. FileNotFound)
  // TODO: add cache headers

  return Response.json(data);
}
