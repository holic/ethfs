type Result<Data, Err = unknown> = { data: Data } | { error: Err };

export function isError<Data, Err>(
  result: Result<Data, Err>,
): result is { error: Err } {
  return "error" in result;
}

export function unwrap<Data, Err>(result: Result<Data, Err>): Data {
  if (isError(result)) {
    throw result.error;
  }
  return result.data;
}

const graphqlEndpoints = [
  {
    chain: "mainnet",
    url: "https://api.thegraph.com/subgraphs/name/holic/ethfs",
  },
  {
    chain: "goerli",
    url: "https://api.thegraph.com/subgraphs/name/holic/ethfs-goerli",
  },
];

export type File = {
  name: string;
  type: string | null;
  encoding: string | null;
  compression: string | null;
  license: string | null;
};

export async function getFiles(chainSlug: string) {
  const url = graphqlEndpoints.find((e) => e.chain === chainSlug)?.url;
  if (!url) throw new Error(`Chain "${chainSlug}" not supported`);

  const result = (await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          files(orderBy: createdAt, orderDirection: desc, first: 1000) {
            name
            type
            encoding
            compression
            license
          }
        }
      `,
    }),
  }).then((res) => res.json())) as Result<{ files: File[] }, string>;

  return unwrap(result).files;
}
