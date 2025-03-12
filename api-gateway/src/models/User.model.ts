import { IUser } from '../types/user';
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "../utils";

const UserSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        public_id: String,
        secure_url: String
    },
    status: {
        type: String,
        default: 'online',
        enum: ['online', 'offline']
    },
    lastSeen: {
        type: Date,
        default: Date.now()
    },
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }],
    sentFriendRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    receivedFriendRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, config.SALT_ROUNDS);
    }
    next();
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;