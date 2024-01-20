"use client";

import { useRouter } from "next/navigation";

import { useChain } from "./ChainContext";
import { supportedChains } from "./supportedChains";

export function ChainSelector() {
  const chain = useChain();
  const router = useRouter();

  return (
    <select
      className="border-4 border-lime-300 bg-lime-300 p-1"
      value={chain.id}
      onChange={(event) => {
        event.preventDefault();
        const targetChainId = parseInt(event.currentTarget.value);
        const targetChain = supportedChains.find(
          (c) => c.chain.id === targetChainId,
        );
        if (!targetChain) {
          throw new Error(`Unexpected chain ID: ${targetChainId}`);
        }
        router.push(`/${targetChain.slug}`);
      }}
    >
      {supportedChains.map((c) => (
        <option key={c.chain.id} value={c.chain.id}>
          {c.chain.name}
        </option>
      ))}
    </select>
  );
}
