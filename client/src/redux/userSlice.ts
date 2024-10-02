import { createSlice, createAsyncThunk, PayloadAction, AnyAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { userBaseURL } from '@/data/data';

interface User {
  _id: string;
  username: string;
  profilePicture?: string;
  isFollowing?: boolean;
  following: string[];
}

interface UserState {
  currentUser: User | null;
  suggestedUsers: User[];
  followingList: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  suggestedUsers: [],
  followingList: [],
  status: 'idle',
  error: null,
};

// Async Thunks for Fetching Data
export const fetchCurrentUser = createAsyncThunk('user/fetchCurrentUser', async (userId: string) => {
  const response = await axios.get<{ user: User }>(`${userBaseURL}/profile/${userId}`, {
    withCredentials: true
  });
  return response.data.user;
});

export const fetchSuggestedUsers = createAsyncThunk('user/fetchSuggestedUsers', async () => {
  const response = await axios.get<{ users: User[] }>(`${userBaseURL}/suggested`, {
    withCredentials: true
  });
  return response.data.users;
});

export const followUnfollow = createAsyncThunk('user/followUnfollow', async (targetUserId: string) => {
  const response = await axios.post<{ success: boolean }>(
    `${userBaseURL}/followorunfollow/${targetUserId}`,
    {},
    { withCredentials: true }
  );
  if (response.data.success) {
    return targetUserId;
  }
  throw new Error('Follow/Unfollow operation failed');
});

// Helper function to check if an action is rejected
const isRejectedAction = (action: AnyAction) => action.type.endsWith('/rejected');

// User Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload;
        state.followingList = action.payload.following;
        state.status = 'succeeded';
      })
      .addCase(fetchSuggestedUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.suggestedUsers = action.payload.map(user => ({
          ...user,
          isFollowing: state.followingList.includes(user._id),
        }));
        state.status = 'succeeded';
      })
      .addCase(followUnfollow.fulfilled, (state, action: PayloadAction<string>) => {
        const targetUserId = action.payload;
        state.suggestedUsers = state.suggestedUsers.map(user =>
          user._id === targetUserId ? { ...user, isFollowing: !user.isFollowing } : user
        );
        if (state.currentUser) {
          const isFollowing = state.followingList.includes(targetUserId);
          if (isFollowing) {
            state.followingList = state.followingList.filter(id => id !== targetUserId);
          } else {
            state.followingList.push(targetUserId);
          }
        }
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
        }
      )
      .addMatcher(
        isRejectedAction,
        (state, action) => {
          state.status = 'failed';
          state.error = action.error?.message || 'An error occurred';
        }
      );
  },
});

export default userSlice.reducer;
