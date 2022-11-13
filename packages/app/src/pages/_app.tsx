import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import {
  createClient as createGraphClient,
  Provider as GraphProvider,
} from "urql";

import { EthereumProviders, targetChainId } from "../EthereumProviders";

export const graphClient = createGraphClient({
  url:
    // TODO: move to env?
    targetChainId === 1
      ? "https://api.thegraph.com/subgraphs/name/holic/ethfs"
      : "https://api.thegraph.com/subgraphs/name/holic/ethfs-goerli",
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>EthFS: Ethereum File System</title>
        <link rel="shortcut icon" type="image/svg+xml" href="/ethfs.svg" />
      </Head>
      <GraphProvider value={graphClient}>
        <EthereumProviders>
          <Component {...pageProps} />
        </EthereumProviders>
      </GraphProvider>
      <ToastContainer position="bottom-right" draggable={false} />
    </>
  );
};

export default MyApp;
