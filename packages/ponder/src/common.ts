export type OnchainFile = {
  chainId: number;
  filename: string;
  createdAt: number;
  size: number;
  type: string | null;
  encoding: string | null;
  compression: string | null;
  license: string | null;
};
