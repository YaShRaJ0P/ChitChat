import { Types, Document } from "mongoose";

export interface IUsername extends Document {
  _id: Types.ObjectId;
  username: string;
}