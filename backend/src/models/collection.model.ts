import { Schema, model, Document } from "mongoose";
import { Collection } from "@/types";

interface MCollection extends Omit<Collection, "_id">, Document {}

export const CollectionSchemaObj: { [key in keyof Omit<Collection, "_id">]: any } = {
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: "Users", required: true },
};

export const CollectionSchema = new Schema(CollectionSchemaObj, {
  versionKey: false,
  minimize: false,
});

const CollectionModel = model<MCollection>("Collections", CollectionSchema);
export default CollectionModel;
