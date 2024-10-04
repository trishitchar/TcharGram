// src/utils/api.ts

import { postBaseURL } from '@/data/data';

export interface CommentType {
  _id: string;
  text: string;
  author: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PostType {
  _id: string;
  caption: string;
  image: string;
  author: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  likes: string[];
  comments: CommentType[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  posts: PostType[];
}

// eita sometimes work kore but nicher ta prai same and updated
// async function authFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
//   const fetchOptions: RequestInit = {
//     ...options,
//     credentials: 'include',
//     headers: {
//       ...options.headers,
//       'Content-Type': 'application/json',
//     },
//   };

// this is fetching rule and regulation, send headers and json from frontend
async function authFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const fetchOptions: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
      // Don't set Content-Type for FormData, let the browser set it
    },
  };

  // If it's not FormData, set the Content-Type to application/json
  if (!(options.body instanceof FormData)) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      'Content-Type': 'application/json',
    };
  }

  const response = await fetch(`${postBaseURL}${endpoint}`, fetchOptions);

  if (response.status === 401) {
    throw new Error('Unauthorized');
  }

  return response;
}

export async function addpost(formData: FormData): Promise<any> {
  try {
    const response = await authFetch('/addpost', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    // console.log('post api',response)

    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function deletePost(postId: string): Promise<any> {
  try {
    const response = await authFetch(`/deletePost/${postId}`,{
      method: 'POST'
    })
    if (!response.ok) {
      console.log("post delete front 2") 
      throw new Error('Failed to delete post');
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

export async function getAllPosts(page: number = 1, limit: number = 10): Promise<ApiResponse> {
  try {
    const response = await authFetch(`/allpost?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const data: ApiResponse = await response.json();
    if (!data.success || !Array.isArray(data.posts)) {
      throw new Error(data.message || 'Invalid response format');
    }
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}