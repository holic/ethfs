import { gql } from 'urql';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type BlockChangedFilter = {
  readonly number_gte: Scalars['Int'];
};

export type Block_Height = {
  readonly hash?: InputMaybe<Scalars['Bytes']>;
  readonly number?: InputMaybe<Scalars['Int']>;
  readonly number_gte?: InputMaybe<Scalars['Int']>;
};

export type Chunk = {
  readonly __typename?: 'Chunk';
  readonly checksum: Scalars['String'];
  readonly contents: Scalars['String'];
  readonly id: Scalars['ID'];
};

export type Chunk_Filter = {
  /** Filter for the block changed event. */
  readonly _change_block?: InputMaybe<BlockChangedFilter>;
  readonly checksum?: InputMaybe<Scalars['String']>;
  readonly checksum_contains?: InputMaybe<Scalars['String']>;
  readonly checksum_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly checksum_ends_with?: InputMaybe<Scalars['String']>;
  readonly checksum_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly checksum_gt?: InputMaybe<Scalars['String']>;
  readonly checksum_gte?: InputMaybe<Scalars['String']>;
  readonly checksum_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly checksum_lt?: InputMaybe<Scalars['String']>;
  readonly checksum_lte?: InputMaybe<Scalars['String']>;
  readonly checksum_not?: InputMaybe<Scalars['String']>;
  readonly checksum_not_contains?: InputMaybe<Scalars['String']>;
  readonly checksum_not_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly checksum_not_ends_with?: InputMaybe<Scalars['String']>;
  readonly checksum_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly checksum_not_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly checksum_not_starts_with?: InputMaybe<Scalars['String']>;
  readonly checksum_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly checksum_starts_with?: InputMaybe<Scalars['String']>;
  readonly checksum_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly contents?: InputMaybe<Scalars['String']>;
  readonly contents_contains?: InputMaybe<Scalars['String']>;
  readonly contents_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly contents_ends_with?: InputMaybe<Scalars['String']>;
  readonly contents_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly contents_gt?: InputMaybe<Scalars['String']>;
  readonly contents_gte?: InputMaybe<Scalars['String']>;
  readonly contents_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly contents_lt?: InputMaybe<Scalars['String']>;
  readonly contents_lte?: InputMaybe<Scalars['String']>;
  readonly contents_not?: InputMaybe<Scalars['String']>;
  readonly contents_not_contains?: InputMaybe<Scalars['String']>;
  readonly contents_not_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly contents_not_ends_with?: InputMaybe<Scalars['String']>;
  readonly contents_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly contents_not_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly contents_not_starts_with?: InputMaybe<Scalars['String']>;
  readonly contents_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly contents_starts_with?: InputMaybe<Scalars['String']>;
  readonly contents_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly id?: InputMaybe<Scalars['ID']>;
  readonly id_gt?: InputMaybe<Scalars['ID']>;
  readonly id_gte?: InputMaybe<Scalars['ID']>;
  readonly id_in?: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly id_lt?: InputMaybe<Scalars['ID']>;
  readonly id_lte?: InputMaybe<Scalars['ID']>;
  readonly id_not?: InputMaybe<Scalars['ID']>;
  readonly id_not_in?: InputMaybe<ReadonlyArray<Scalars['ID']>>;
};

export enum Chunk_OrderBy {
  Checksum = 'checksum',
  Contents = 'contents',
  Id = 'id'
}

export type File = {
  readonly __typename?: 'File';
  readonly compression?: Maybe<Scalars['String']>;
  readonly contents?: Maybe<Scalars['String']>;
  readonly createdAt: Scalars['Int'];
  readonly encoding?: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly license?: Maybe<Scalars['String']>;
  readonly name: Scalars['String'];
  readonly size: Scalars['Int'];
  readonly type?: Maybe<Scalars['String']>;
};

export type File_Filter = {
  /** Filter for the block changed event. */
  readonly _change_block?: InputMaybe<BlockChangedFilter>;
  readonly compression?: InputMaybe<Scalars['String']>;
  readonly compression_contains?: InputMaybe<Scalars['String']>;
  readonly compression_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly compression_ends_with?: InputMaybe<Scalars['String']>;
  readonly compression_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly compression_gt?: InputMaybe<Scalars['String']>;
  readonly compression_gte?: InputMaybe<Scalars['String']>;
  readonly compression_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly compression_lt?: InputMaybe<Scalars['String']>;
  readonly compression_lte?: InputMaybe<Scalars['String']>;
  readonly compression_not?: InputMaybe<Scalars['String']>;
  readonly compression_not_contains?: InputMaybe<Scalars['String']>;
  readonly compression_not_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly compression_not_ends_with?: InputMaybe<Scalars['String']>;
  readonly compression_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly compression_not_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly compression_not_starts_with?: InputMaybe<Scalars['String']>;
  readonly compression_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly compression_starts_with?: InputMaybe<Scalars['String']>;
  readonly compression_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly contents?: InputMaybe<Scalars['String']>;
  readonly contents_contains?: InputMaybe<Scalars['String']>;
  readonly contents_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly contents_ends_with?: InputMaybe<Scalars['String']>;
  readonly contents_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly contents_gt?: InputMaybe<Scalars['String']>;
  readonly contents_gte?: InputMaybe<Scalars['String']>;
  readonly contents_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly contents_lt?: InputMaybe<Scalars['String']>;
  readonly contents_lte?: InputMaybe<Scalars['String']>;
  readonly contents_not?: InputMaybe<Scalars['String']>;
  readonly contents_not_contains?: InputMaybe<Scalars['String']>;
  readonly contents_not_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly contents_not_ends_with?: InputMaybe<Scalars['String']>;
  readonly contents_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly contents_not_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly contents_not_starts_with?: InputMaybe<Scalars['String']>;
  readonly contents_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly contents_starts_with?: InputMaybe<Scalars['String']>;
  readonly contents_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly createdAt?: InputMaybe<Scalars['Int']>;
  readonly createdAt_gt?: InputMaybe<Scalars['Int']>;
  readonly createdAt_gte?: InputMaybe<Scalars['Int']>;
  readonly createdAt_in?: InputMaybe<ReadonlyArray<Scalars['Int']>>;
  readonly createdAt_lt?: InputMaybe<Scalars['Int']>;
  readonly createdAt_lte?: InputMaybe<Scalars['Int']>;
  readonly createdAt_not?: InputMaybe<Scalars['Int']>;
  readonly createdAt_not_in?: InputMaybe<ReadonlyArray<Scalars['Int']>>;
  readonly encoding?: InputMaybe<Scalars['String']>;
  readonly encoding_contains?: InputMaybe<Scalars['String']>;
  readonly encoding_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly encoding_ends_with?: InputMaybe<Scalars['String']>;
  readonly encoding_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly encoding_gt?: InputMaybe<Scalars['String']>;
  readonly encoding_gte?: InputMaybe<Scalars['String']>;
  readonly encoding_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly encoding_lt?: InputMaybe<Scalars['String']>;
  readonly encoding_lte?: InputMaybe<Scalars['String']>;
  readonly encoding_not?: InputMaybe<Scalars['String']>;
  readonly encoding_not_contains?: InputMaybe<Scalars['String']>;
  readonly encoding_not_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly encoding_not_ends_with?: InputMaybe<Scalars['String']>;
  readonly encoding_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly encoding_not_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly encoding_not_starts_with?: InputMaybe<Scalars['String']>;
  readonly encoding_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly encoding_starts_with?: InputMaybe<Scalars['String']>;
  readonly encoding_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly id?: InputMaybe<Scalars['ID']>;
  readonly id_gt?: InputMaybe<Scalars['ID']>;
  readonly id_gte?: InputMaybe<Scalars['ID']>;
  readonly id_in?: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly id_lt?: InputMaybe<Scalars['ID']>;
  readonly id_lte?: InputMaybe<Scalars['ID']>;
  readonly id_not?: InputMaybe<Scalars['ID']>;
  readonly id_not_in?: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly license?: InputMaybe<Scalars['String']>;
  readonly license_contains?: InputMaybe<Scalars['String']>;
  readonly license_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly license_ends_with?: InputMaybe<Scalars['String']>;
  readonly license_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly license_gt?: InputMaybe<Scalars['String']>;
  readonly license_gte?: InputMaybe<Scalars['String']>;
  readonly license_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly license_lt?: InputMaybe<Scalars['String']>;
  readonly license_lte?: InputMaybe<Scalars['String']>;
  readonly license_not?: InputMaybe<Scalars['String']>;
  readonly license_not_contains?: InputMaybe<Scalars['String']>;
  readonly license_not_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly license_not_ends_with?: InputMaybe<Scalars['String']>;
  readonly license_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly license_not_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly license_not_starts_with?: InputMaybe<Scalars['String']>;
  readonly license_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly license_starts_with?: InputMaybe<Scalars['String']>;
  readonly license_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly name?: InputMaybe<Scalars['String']>;
  readonly name_contains?: InputMaybe<Scalars['String']>;
  readonly name_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly name_ends_with?: InputMaybe<Scalars['String']>;
  readonly name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly name_gt?: InputMaybe<Scalars['String']>;
  readonly name_gte?: InputMaybe<Scalars['String']>;
  readonly name_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly name_lt?: InputMaybe<Scalars['String']>;
  readonly name_lte?: InputMaybe<Scalars['String']>;
  readonly name_not?: InputMaybe<Scalars['String']>;
  readonly name_not_contains?: InputMaybe<Scalars['String']>;
  readonly name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly name_not_ends_with?: InputMaybe<Scalars['String']>;
  readonly name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly name_not_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly name_not_starts_with?: InputMaybe<Scalars['String']>;
  readonly name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly name_starts_with?: InputMaybe<Scalars['String']>;
  readonly name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly size?: InputMaybe<Scalars['Int']>;
  readonly size_gt?: InputMaybe<Scalars['Int']>;
  readonly size_gte?: InputMaybe<Scalars['Int']>;
  readonly size_in?: InputMaybe<ReadonlyArray<Scalars['Int']>>;
  readonly size_lt?: InputMaybe<Scalars['Int']>;
  readonly size_lte?: InputMaybe<Scalars['Int']>;
  readonly size_not?: InputMaybe<Scalars['Int']>;
  readonly size_not_in?: InputMaybe<ReadonlyArray<Scalars['Int']>>;
  readonly type?: InputMaybe<Scalars['String']>;
  readonly type_contains?: InputMaybe<Scalars['String']>;
  readonly type_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly type_ends_with?: InputMaybe<Scalars['String']>;
  readonly type_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly type_gt?: InputMaybe<Scalars['String']>;
  readonly type_gte?: InputMaybe<Scalars['String']>;
  readonly type_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly type_lt?: InputMaybe<Scalars['String']>;
  readonly type_lte?: InputMaybe<Scalars['String']>;
  readonly type_not?: InputMaybe<Scalars['String']>;
  readonly type_not_contains?: InputMaybe<Scalars['String']>;
  readonly type_not_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly type_not_ends_with?: InputMaybe<Scalars['String']>;
  readonly type_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly type_not_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly type_not_starts_with?: InputMaybe<Scalars['String']>;
  readonly type_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly type_starts_with?: InputMaybe<Scalars['String']>;
  readonly type_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum File_OrderBy {
  Compression = 'compression',
  Contents = 'contents',
  CreatedAt = 'createdAt',
  Encoding = 'encoding',
  Id = 'id',
  License = 'license',
  Name = 'name',
  Size = 'size',
  Type = 'type'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  readonly __typename?: 'Query';
  /** Access to subgraph metadata */
  readonly _meta?: Maybe<_Meta_>;
  readonly chunk?: Maybe<Chunk>;
  readonly chunks: ReadonlyArray<Chunk>;
  readonly file?: Maybe<File>;
  readonly files: ReadonlyArray<File>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryChunkArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryChunksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Chunk_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Chunk_Filter>;
};


export type QueryFileArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFilesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<File_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<File_Filter>;
};

export type Subscription = {
  readonly __typename?: 'Subscription';
  /** Access to subgraph metadata */
  readonly _meta?: Maybe<_Meta_>;
  readonly chunk?: Maybe<Chunk>;
  readonly chunks: ReadonlyArray<Chunk>;
  readonly file?: Maybe<File>;
  readonly files: ReadonlyArray<File>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionChunkArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionChunksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Chunk_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Chunk_Filter>;
};


export type SubscriptionFileArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFilesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<File_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<File_Filter>;
};

export type _Block_ = {
  readonly __typename?: '_Block_';
  /** The hash of the block */
  readonly hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  readonly number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  readonly timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  readonly __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  readonly block: _Block_;
  /** The deployment ID */
  readonly deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  readonly hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type BountiesQueryVariables = Exact<{
  checksums: ReadonlyArray<Scalars['String']> | Scalars['String'];
  filenames: ReadonlyArray<Scalars['String']> | Scalars['String'];
}>;


export type BountiesQuery = { readonly __typename?: 'Query', readonly chunks: ReadonlyArray<{ readonly __typename?: 'Chunk', readonly checksum: string }>, readonly files: ReadonlyArray<{ readonly __typename?: 'File', readonly name: string }> };

export type FileExplorerQueryVariables = Exact<{
  searchQuery?: InputMaybe<Scalars['String']>;
}>;


export type FileExplorerQuery = { readonly __typename?: 'Query', readonly files: ReadonlyArray<{ readonly __typename?: 'File', readonly id: string, readonly name: string, readonly size: number, readonly createdAt: number, readonly type?: string | null, readonly encoding?: string | null, readonly compression?: string | null }> };

export type FileThumbnailFragment = { readonly __typename?: 'File', readonly name: string, readonly contents?: string | null, readonly type?: string | null, readonly encoding?: string | null, readonly compression?: string | null };

export type FileViewerQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type FileViewerQuery = { readonly __typename?: 'Query', readonly file?: { readonly __typename?: 'File', readonly id: string, readonly name: string, readonly type?: string | null, readonly size: number, readonly createdAt: number, readonly encoding?: string | null, readonly compression?: string | null, readonly license?: string | null, readonly contents?: string | null } | null };

export const FileThumbnailFragmentDoc = gql`
    fragment FileThumbnail on File {
  name
  contents
  type
  encoding
  compression
}
    `;
export const BountiesDocument = gql`
    query Bounties($checksums: [String!]!, $filenames: [String!]!) {
  chunks(where: {checksum_in: $checksums}) {
    checksum
  }
  files(where: {name_in: $filenames}) {
    name
  }
}
    `;

export function useBountiesQuery(options: Omit<Urql.UseQueryArgs<BountiesQueryVariables>, 'query'>) {
  return Urql.useQuery<BountiesQuery, BountiesQueryVariables>({ query: BountiesDocument, ...options });
};
export const FileExplorerDocument = gql`
    query FileExplorer($searchQuery: String) {
  files(
    first: 100
    where: {name_contains_nocase: $searchQuery}
    orderBy: createdAt
    orderDirection: desc
  ) {
    id
    name
    size
    createdAt
    type
    encoding
    compression
  }
}
    `;

export function useFileExplorerQuery(options?: Omit<Urql.UseQueryArgs<FileExplorerQueryVariables>, 'query'>) {
  return Urql.useQuery<FileExplorerQuery, FileExplorerQueryVariables>({ query: FileExplorerDocument, ...options });
};
export const FileViewerDocument = gql`
    query FileViewer($id: ID!) {
  file(id: $id) {
    id
    name
    type
    size
    createdAt
    encoding
    compression
    license
    ...FileThumbnail
  }
}
    ${FileThumbnailFragmentDoc}`;

export function useFileViewerQuery(options: Omit<Urql.UseQueryArgs<FileViewerQueryVariables>, 'query'>) {
  return Urql.useQuery<FileViewerQuery, FileViewerQueryVariables>({ query: FileViewerDocument, ...options });
};