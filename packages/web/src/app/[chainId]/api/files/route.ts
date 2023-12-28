import { getFiles } from "./getFiles";

export async function GET(
  req: Request,
  { params }: { params: { chainId: string } },
) {
  const chainId = params.chainId;
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");

  const data = await getFiles(parseInt(chainId ?? "0"), filename ?? undefined);

  return Response.json(data);
}
