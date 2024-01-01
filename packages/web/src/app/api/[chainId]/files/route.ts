import { getFiles } from "./getFiles";

export async function GET(
  req: Request,
  { params }: { params: { chainId: string } },
) {
  const chainId = parseInt(params.chainId) || 0;
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");

  const data = await getFiles(chainId, filename ?? undefined);

  return Response.json(data);
}
