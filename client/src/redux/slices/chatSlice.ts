import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  // isRead: boolean;
  createdAt: string;
}

interface ChatState {
  onlineUsers: string[];
  messages: { [key: string]: Message[] };
}

const initialState: ChatState = {
  onlineUsers: [],
  messages: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action: PayloadAction<{ userId: string; messages: Message[] }>) => {
      state.messages[action.payload.userId] = action.payload.messages;
    },
    addMessage: (state, action: PayloadAction<{ userId: string; message: Message }>) => {
      if (state.messages[action.payload.userId]) {
        // Check for duplicates before adding
        const isDuplicate = state.messages[action.payload.userId].some(
          msg => msg._id === action.payload.message._id
        );
        if (!isDuplicate) {
          state.messages[action.payload.userId].push(action.payload.message);
        }
      } else {
        state.messages[action.payload.userId] = [action.payload.message];
      }
    },
    clearChat: (state) => {
      state.onlineUsers = [];
      state.messages = {};
    },
  },
});

export const { setOnlineUsers, setMessages, addMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
