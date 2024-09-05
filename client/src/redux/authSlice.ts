// redux/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state structure
interface AuthState {
  user: string | null;
}

// Set initial state
const initialState: AuthState = {
  user: null,
};

// Create a slice for authentication
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<string | null>) => {
      state.user = action.payload;
    },
  },
});

export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer;
