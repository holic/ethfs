import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.css";

import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";

import { ChainProvider } from "../../ChainContext";
import { EthereumProviders } from "../../EthereumProviders";

export const metadata: Metadata = {
  title: "EthFS: Ethereum File System",
  description: "Browse and upload onchain files",
  icons: [
    {
      url: "/ethfs.svg",
      rel: "shortcut icon",
    },
  ],
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { chainId: string };
}) {
  // TODO: validate chain ID is supported, redirect otherwise
  return (
    <html lang="en">
      <body>
        <ChainProvider chainId={parseInt(params.chainId)}>
          <EthereumProviders>
            {children}
            <ToastContainer position="bottom-right" draggable={false} />
          </EthereumProviders>
        </ChainProvider>
      </body>
    </html>
  );
}
