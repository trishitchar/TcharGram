import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from '@/data/interface.data';

interface ChatState {
  onlineUsers: User[]; // Store full User objects
}

const initialState: ChatState = {
  onlineUsers: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<User[]>) => {
      state.onlineUsers = action.payload;
    }
  }
});

export const { setOnlineUsers } = chatSlice.actions;
export default chatSlice.reducer;