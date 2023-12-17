import "tailwindcss/tailwind.css";

import type { Metadata } from "next";

import { EthereumProviders } from "../EthereumProviders";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <EthereumProviders>{children}</EthereumProviders>
      </body>
    </html>
  );
}
