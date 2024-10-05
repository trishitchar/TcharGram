// src/redux/slices/postSlice.ts

import { CommentType, PostType } from "@/data/interface.data";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AllPostsState {
  posts: PostType[];
}

interface AddCommentPayload {
  postId: string;
  comment: CommentType;
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
      state.posts.push(...newPosts);
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    removeAllPosts: (state) => {
      state.posts = [];
    },
    addComment: (state, action: PayloadAction<AddCommentPayload>) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find(post => post._id === postId);
      if (post) {
        if (!post.comments) {
          post.comments = []; // Ensure comments array exists
        }
        post.comments.push(comment); // Add the new comment
      }
    },
  },
});

export const { setPosts, addPosts, removePost, removeAllPosts, addComment } = postSlice.actions;
export default postSlice.reducer;
