"use client";

import { useRouter } from "next/navigation";

import { useChain } from "./ChainContext";
import { groupBy } from "./groupBy";
import { supportedChains } from "./supportedChains";

const groupedChains = groupBy(supportedChains, (c) => c.group);

export function ChainSelector() {
  const chain = useChain();
  const router = useRouter();

  return (
    <select
      className="border-[0.5rem] border-lime-300 bg-lime-300"
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
      {Array.from(groupedChains.keys()).map((group) => (
        <optgroup key={group} label={group}>
          {groupedChains.get(group)!.map((c) => (
            <option key={c.chain.id} value={c.chain.id}>
              {c.chain.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
