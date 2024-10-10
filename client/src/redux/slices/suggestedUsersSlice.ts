import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType } from '@/data/interface.data';

export interface ExtendedUser extends UserType {
  isFollowing?: boolean;
}

interface SuggestedUsersState {
  users: ExtendedUser[];
  loading: boolean;
  error: string | null;
}

const initialState: SuggestedUsersState = {
  users: [],
  loading: false,
  error: null,
};

const suggestedUsersSlice = createSlice({
  name: 'suggestedUsers',
  initialState,
  reducers: {
    fetchSuggestedUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuggestedUsersSuccess: (state, action: PayloadAction<ExtendedUser[]>) => {
      state.users = action.payload;
      state.loading = false;
    },
    fetchSuggestedUsersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateFollowStatus: (state, action: PayloadAction<string>) => {
      const targetUserId = action.payload;
      state.users = state.users.map(user => 
        user._id === targetUserId 
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      );
    },
    removeSuggestedUsers: (state) => {
      state.users = [],
      state.loading = false,
      state.error = null
    }
  },
});

export const {
  fetchSuggestedUsersStart,
  fetchSuggestedUsersSuccess,
  fetchSuggestedUsersFailure,
  updateFollowStatus,
  removeSuggestedUsers,
} = suggestedUsersSlice.actions;

export default suggestedUsersSlice.reducer;