import { Schema, model, Document } from "mongoose";
const { Mixed } = Schema.Types;

declare global {
  namespace Express {
    interface User {
      _id: typeof Schema.Types.ObjectId | string;
      login: string;
      password: string;
      info?: {
        name: string;
        surname: string;
        avatar: string;
        email: string;
        phone: string;
      };
      groups?: ("USER" | "ADMIN" | "VISITOR")[];
      credit?: number;
      meta?: any;
      date?: {
        register: Date;
        signin: Date;
      };
    }
  }
}
export type User = Express.User;

export interface IUser extends Omit<Express.User, "_id">, Document {}

const schema = {
  login: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
  info: {
    type: Mixed,
    default: {},
  },
  groups: {
    type: [String],
    default: ["USERS"],
  },
  meta: {
    type: Mixed,
    default: {},
  },
  date: {
    register: { type: Date, default: Date.now },
    signin: { type: Date, default: Date.now },
  },
};

export const UserSchema = new Schema(schema, {
  versionKey: false,
  minimize: false,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.meta;
      delete ret.password;
      return ret;
    },
  },
});

const UserModel = model<IUser>("Users", UserSchema);
export default UserModel;
