import mongoose, {Document, Schema, Model} from "mongoose";

interface IMessage extends Document{
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
//   isRead?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema: Schema<IMessage> = new mongoose.Schema(
    {
        senderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiverId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message:{
            type: String,
            required: [true, 'a Message should be there'],
            trim: true
        },
        // isRead:{
        //     type: Boolean,
        //     default: false,
        // }
    },{
        timestamps: true
    }
)

export const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema)