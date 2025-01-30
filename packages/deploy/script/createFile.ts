import "dotenv/config";

import FileStoreAbi from "@ethfs/contracts/out/FileStore.sol/FileStore.abi.json";
import { createWalletClient, http, isHex, size, stringToHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { getBytecode, waitForTransactionReceipt } from "viem/actions";
import { goerli } from "viem/chains";
import { z } from "zod";

import deploys from "../deploys.json";
import { parseEnv } from "./parseEnv";

const envSchema = z.object({
  DEPLOYER_PRIVATE_KEY: z.string().refine(isHex),
});

const env = parseEnv(envSchema);

const account = privateKeyToAccount(env.DEPLOYER_PRIVATE_KEY);

const chain = goerli;

async function run() {
  const client = createWalletClient({ chain, transport: http(), account });

  // goerli SSTORE2 address of gunzipScripts
  const pointer = "0x2D4dd79B7726e919b9215D088aa6C39830d558bA";
  const bytecode = await getBytecode(client, { address: pointer });
  const codeSize = size(bytecode!);
  console.log("codeSize", codeSize);

  const tx = await client.writeContract({
    address: `0x${deploys[chain.id].contracts.FileStore.address.substring(2)}`,
    abi: FileStoreAbi,
    functionName: "createFileFromPointers",
    args: [
      "gunzipScripts-0.0.1.js",
      [pointer],
      stringToHex(
        JSON.stringify({
          type: "text/javascript",
          encoding: "base64",
          compression: null,
          license: `fflate: https://github.com/101arrowz/fflate

MIT License

Copyright (c) 2020 Arjun Barrett

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
        }),
      ),
    ],
  });

  console.log("waiting for tx", tx);
  await waitForTransactionReceipt(client, { hash: tx });
}

run().then(
  () => {
    console.log("done!");
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
