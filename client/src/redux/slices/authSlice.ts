// redux/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the User interface with expected properties
interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  followers: string[];
  following: string[];
  posts: string[];
  bookmarks: string[];
  // Add any other properties you need
}

interface AuthState {
  user: User | null; // Ensure the user is an object or null, not a string
}

const initialState: AuthState = {
  user: null, // Initial state is null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null; // Clear the user on logout
    },
  },
});

export const { setAuthUser, logout } = authSlice.actions;
export default authSlice.reducer;
