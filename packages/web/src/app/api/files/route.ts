import { getFiles } from "./getFiles";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");

  const data = await getFiles(filename ?? undefined);
  // console.log("got data", data);

  return Response.json(data);
}
