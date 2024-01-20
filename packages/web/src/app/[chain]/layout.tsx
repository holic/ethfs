import "react-toastify/dist/ReactToastify.css";

import { redirect } from "next/navigation";
import { ToastContainer } from "react-toastify";

import { ChainProvider } from "../../ChainContext";
import { EthereumProviders } from "../../EthereumProviders";
import { supportedChains } from "../../supportedChains";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { chain: string };
}) {
  const chain = supportedChains.find((c) => c.slug === params.chain)?.chain;
  if (!chain) {
    redirect("/");
  }
  return (
    <body className="bg-lime-200 text-lime-800">
      <ChainProvider chain={chain}>
        <EthereumProviders>
          {children}
          <ToastContainer position="bottom-right" draggable={false} />
        </EthereumProviders>
      </ChainProvider>
    </body>
  );
}
