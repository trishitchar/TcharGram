import mongoose, {Document, Schema, Model} from "mongoose";

interface IComment extends Document{
    text: string;
    author: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
}

const commentSchema: Schema<IComment> = new Schema({
    text: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
},{
    timestamps: true
})

export const Comment: Model<IComment> = mongoose.model<IComment>('Comment',commentSchema);