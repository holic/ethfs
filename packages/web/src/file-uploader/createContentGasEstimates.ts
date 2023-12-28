import { Address, concatHex, PublicClient } from "viem";
import { estimateGas } from "viem/actions";

import { contentToInitCode, salt } from "./common";
import { contentGasEstimates } from "./contentGasEstimates";

export async function createContentGasEstimates(
  publicClient: PublicClient,
  account: Address,
  to: Address,
) {
  const estimates = await Promise.all(
    contentGasEstimates.map(async (estimate) => {
      const content = new Array(estimate.size).fill("z").join("");
      const gas = await estimateGas(publicClient, {
        account,
        to,
        data: concatHex([salt, contentToInitCode(content)]),
      });
      console.log("estimated gas for", estimate.size, "bytes:", gas);
      console.log(
        "previous estimate gas for",
        estimate.size,
        "bytes:",
        estimate.gas,
      );
      return { size: estimate.size, gas };
    }),
  );
  console.log(
    "new estimates",
    JSON.stringify(estimates, (k, v) =>
      typeof v === "bigint" ? Number(v) : v,
    ),
  );
}
