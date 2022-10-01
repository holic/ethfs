import goerliDeploys from "@web3-scaffold/contracts/deploys/goerli.json";
import {
  ContentStore__factory,
  FileStore__factory,
} from "@web3-scaffold/contracts/types";
import { useContractRead } from "wagmi";

import { provider, targetChainId } from "./EthereumProviders";

// TODO: migrate to abitype once it's in wagmi
//       https://github.com/wagmi-dev/wagmi/pull/941

export const fileStore = FileStore__factory.connect(
  goerliDeploys.FileStore.deployedTo,
  provider({ chainId: targetChainId })
);

export const contentStore = ContentStore__factory.connect(
  goerliDeploys.ContentStore.deployedTo,
  provider({ chainId: targetChainId })
);

export const useFileStoreRead = (
  readConfig: Omit<
    Parameters<typeof useContractRead>[0],
    "addressOrName" | "contractInterface"
  >
) =>
  useContractRead({
    ...readConfig,
    addressOrName: goerliDeploys.FileStore.deployedTo,
    contractInterface: FileStore__factory.abi,
  });

export const useContentStoreRead = (
  readConfig: Omit<
    Parameters<typeof useContractRead>[0],
    "addressOrName" | "contractInterface"
  >
) =>
  useContractRead({
    ...readConfig,
    addressOrName: goerliDeploys.ContentStore.deployedTo,
    contractInterface: ContentStore__factory.abi,
  });
