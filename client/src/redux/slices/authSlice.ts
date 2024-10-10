import { UserType } from '@/data/interface.data';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: UserType | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    updateFollowStatus: (state, action: PayloadAction<string>) => {
      if (state.user) {
        const targetUserId = action.payload;
        const isCurrentlyFollowing = state.user.following.includes(targetUserId);
        
        if (isCurrentlyFollowing) {
          state.user.following = state.user.following.filter(id => id !== targetUserId);
        } else {
          state.user.following.push(targetUserId);
        }
      }
    },
    updateProfile: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
  },
});

export const { setAuthUser, logout, updateFollowStatus, updateProfile } = authSlice.actions;
export default authSlice.reducer;