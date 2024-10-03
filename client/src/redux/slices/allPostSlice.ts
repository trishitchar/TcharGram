// src/redux/slices/postSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostType } from "@/api/post.api.ts";

interface AllPostsState {
  posts: PostType[];
}

const initialState: AllPostsState = {
  posts: [],
};

const postSlice = createSlice({
  name: "allPosts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<PostType[]>) => {
      state.posts = action.payload;
    },
    addPosts: (state, action: PayloadAction<PostType[]>) => {
      // Merge unique posts (avoid duplicates)
      const newPosts = action.payload.filter(
        (newPost) => !state.posts.some((post) => post._id === newPost._id)
      );
      state.posts = [...state.posts, ...newPosts];
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    removeAllPosts: (state) => {
      state.posts = [];
    },
  },
});

export const { setPosts, addPosts, removePost, removeAllPosts } = postSlice.actions;
export default postSlice.reducer;
