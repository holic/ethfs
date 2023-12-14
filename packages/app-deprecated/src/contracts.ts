import goerliDeploys from "@ethfs/contracts/deploys/goerli.json";
import mainnetDeploys from "@ethfs/contracts/deploys/mainnet.json";
import {
  ContentStore__factory,
  FileStore__factory,
} from "@ethfs/contracts/types";
import { useContractRead } from "wagmi";

import { provider, targetChainId } from "./EthereumProviders";

const deploy = (() => {
  switch (targetChainId) {
    case 1:
      return mainnetDeploys;
    case 5:
      return goerliDeploys;
    default:
      throw new Error("Unsupported chain");
  }
})();

// TODO: migrate to abitype once it's in wagmi
//       https://github.com/wagmi-dev/wagmi/pull/941

export const fileStore = FileStore__factory.connect(
  deploy.FileStore.deployedTo,
  provider({ chainId: targetChainId })
);

export const contentStore = ContentStore__factory.connect(
  deploy.ContentStore.deployedTo,
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
    addressOrName: deploy.FileStore.deployedTo,
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
    addressOrName: deploy.ContentStore.deployedTo,
    contractInterface: ContentStore__factory.abi,
  });
