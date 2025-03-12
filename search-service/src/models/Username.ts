import { IUsername } from '../types/username';
import mongoose from "mongoose";

const UsernameSchema = new mongoose.Schema<IUsername>({
    username: {
        type: String,
        required: true
    },
});

const Username = mongoose.model<IUsername>('Username', UsernameSchema);

export default Username;