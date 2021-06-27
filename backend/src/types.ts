export type Collection<T = string> = {
  _id: T;
  image: string;
  name: string;
  description: string;
  owner: T;
};

export enum NFTTypes {
  ART = 1,
  MUSIC = 2,
  DOMAIN_NAME = 3,
}
export type NFT<T = string> = {
  _id: T;
  name: string;
  description: string;
  externalUri: string;
  props: Record<string, unknown>;
  contractAddress: string;
  transactionHash: string;
  tokenId: string;
  deploying: boolean;
  createDate: Date | string;
  price: number;
  type: NFTTypes;
  image: string;
  sym: string;
  source: string[];
  collectionId: T;
  owner: T;
};
