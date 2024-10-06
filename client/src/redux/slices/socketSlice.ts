import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket } from 'socket.io-client';

interface SocketState {
//  socket: Socket | null; // Socket type from socket.io
    socket: any
}

const initialState: SocketState = {
  socket: null
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<Socket | null>) => {
      // Direct assignment works without needing to handle internal immutability
      state.socket = action.payload as Socket | null;
    },
    clearSocket: (state) => {
      state.socket = null;
    }
  }
});

export const { setSocket, clearSocket } = socketSlice.actions;
export default socketSlice.reducer;
