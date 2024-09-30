// src/utils/api.ts

import { postBaseURL } from '@/data/data';

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
  comments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  posts: PostType[];
}

// async function authFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
//   const fetchOptions: RequestInit = {
//     ...options,
//     credentials: 'include',
//     headers: {
//       ...options.headers,
//       'Content-Type': 'application/json',
//     },
//   };

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

export async function createPost(formData: FormData): Promise<any> {
  try {
    const response = await authFetch('/addpost', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}