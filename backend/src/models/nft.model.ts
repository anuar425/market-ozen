import { NFT, NFTTypes } from "@/types";
import { Schema, model, Document } from "mongoose";
const { Mixed } = Schema.Types;

export interface INFT extends Omit<NFT, "_id">, Document {}

const schema = {
  name: { type: String, required: true },
  sym: { type: String, required: true, maxLength: 3, minLength: 3 },
  image: { type: String, required: true },
  description: { type: String },
  externalUri: { type: String },
  price: { type: Number, default: 0.01 },
  attributes: { type: Mixed, default: {} },
  contractAddress: { type: String },
  transactionHash: { type: String },
  deploying: { type: Boolean, default: false },
  createDate: { type: Date, default: Date.now },
  type: { type: Number, default: NFTTypes.ART },
  collectionId: { type: Schema.Types.ObjectId, ref: "Collections", required: true },
  owner: { type: Schema.Types.ObjectId, ref: "Users", required: true },
};

export const NFTSchema = new Schema(schema, {
  versionKey: false,
  minimize: false,
});

const NFTModel = model<INFT>("NFTs", NFTSchema);
export default NFTModel;
