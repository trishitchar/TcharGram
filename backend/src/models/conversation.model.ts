import mongoose, {Document, Schema, Model} from "mongoose";

interface IConversation extends Document{
    // participants and message would be array of object, for -> gc chat or many msg
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema: Schema<IConversation> = new mongoose.Schema({
    participants:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]
},{
    timestamps: true
})

export const Conversation: Model<IConversation> = mongoose.model<IConversation>('Conversation',conversationSchema);