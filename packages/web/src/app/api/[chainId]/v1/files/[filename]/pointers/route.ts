"use server";

import { getPointers } from "./getPointers";

export async function GET(
  req: Request,
  { params }: { params: { chainId: string; filename: string } },
) {
  const chainId = parseInt(params.chainId) || 0;
  const filename = params.filename;

  const data = await getPointers(chainId, filename);

  return Response.json(data);
}
