import { goerli } from "wagmi/chains";

export const supportedChains = [goerli];

export const rpcs: { readonly [chainId: number]: string } = {
  [goerli.id]: process.env.NEXT_PUBLIC_RPC_HTTP_URL_5!,
};
