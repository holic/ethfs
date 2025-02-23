"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { ComponentProps, ReactNode, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";

import { useIsMounted } from "./useIsMounted";
import { usePromise } from "./usePromise";

// TODO: adapt to fit submit buttons

// TODO: remove aria-label, aria-busy, aria-disabled?
// TODO: normalize disabled/aria-disabled?
export type ButtonProps = Omit<ComponentProps<"button">, "children">;

export type Props = ButtonProps & {
  chainId: number;
  onWrite: () => Promise<void>;
  // TODO: explore using context, to expose pending/disabled states and labels, instead of render prop?
  children: (props: ButtonProps) => ReactNode;
};

export const WriteButton = React.forwardRef<HTMLButtonElement, Props>(
  (
    { chainId, onWrite, type = "button", children: render, ...buttonProps },
    ref,
  ) => {
    const isMounted = useIsMounted();
    const { openConnectModal, connectModalOpen } = useConnectModal();
    const { isConnected, isConnecting, chain } = useAccount();
    const { switchChain, isPending: isSwitchingChain } = useSwitchChain();

    const [writePromise, setWritePromise] = useState<Promise<void> | null>(
      null,
    );
    const writeResult = usePromise(writePromise);

    // TODO: add SSR support and figure out "Text content does not match server-rendered HTML" error
    if (!isMounted) {
      return render({
        ...buttonProps,
        ref,
        type,
        "aria-disabled": true,
      });
    }

    if (!isConnected) {
      if (openConnectModal) {
        // TODO: figure out why this initially renders pending when not connected
        return render({
          ...buttonProps,
          ref,
          type,
          "aria-label": "Connect wallet",
          "aria-busy": isConnecting || connectModalOpen,
          onClick: (event) => {
            if (event.defaultPrevented) return;
            if (event.currentTarget.ariaBusy === "true") return;
            if (event.currentTarget.ariaDisabled === "true") return;
            event.preventDefault();
            openConnectModal();
          },
        });
      } else {
        return render({
          ...buttonProps,
          ref,
          type,
          "aria-label": "Cannot connect wallet",
          "aria-disabled": true,
        });
      }
    }

    if (chain != null && chain.id !== chainId) {
      if (switchChain) {
        return render({
          ...buttonProps,
          ref,
          type,
          "aria-label": "Switch network",
          "aria-busy": isSwitchingChain,
          onClick: (event) => {
            if (event.defaultPrevented) return;
            if (event.currentTarget.ariaBusy === "true") return;
            if (event.currentTarget.ariaDisabled === "true") return;
            event.preventDefault();
            switchChain({ chainId: chainId });
          },
        });
      } else {
        return render({
          ...buttonProps,
          ref,
          type,
          "aria-label": "Wrong network",
          "aria-disabled": true,
        });
      }
    }

    return render({
      ...buttonProps,
      ref,
      type,
      "aria-busy": writeResult.status === "pending",
      onClick: (event) => {
        if (event.defaultPrevented) return;
        if (event.currentTarget.ariaBusy === "true") return;
        if (event.currentTarget.ariaDisabled === "true") return;
        event.preventDefault();
        setWritePromise(onWrite());
      },
    });
  },
);

WriteButton.displayName = "WriteButton";
