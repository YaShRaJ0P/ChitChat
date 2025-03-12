import { Types, Document } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  name: string;
  email: string;
  password: string;
  status: 'online' | 'offline';
  lastSeen?: Date;
  chats?: Types.ObjectId[];
  sentFriendRequests?: Types.ObjectId[];
  receivedFriendRequests?: Types.ObjectId[];
  friends?: Types.ObjectId[];
  avatar?: {
    public_id: string;
    secure_url: string;
  };
}