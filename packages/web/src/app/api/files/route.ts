import { getFiles } from "./getFiles";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chainId = searchParams.get("chainId");
  const filename = searchParams.get("filename");

  const data = await getFiles(parseInt(chainId ?? "0"), filename ?? undefined);
  // console.log("got data", data);

  return Response.json(data);
}
