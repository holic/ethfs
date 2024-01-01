import "tailwindcss/tailwind.css";

import type { Metadata } from "next";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
