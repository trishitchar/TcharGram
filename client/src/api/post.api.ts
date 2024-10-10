import { postBaseURL } from '@/data/data';
import { AddCommentResponse, ApiResponse } from '@/data/interface.data';

// have to add
// router.route('/getcommentsOfpost/:id').post(isTokenValid,getCommentsOfPost)
// router.route('/deletecomment/:id').post(isTokenValid,deleteComment)
// router.route('/bookmarkpost/:id').post(isTokenValid,bookmarkPost)

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
    const responseData = await response.json();
    return responseData;

    // return await response.json();
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
      // console.log("post delete front 2") 
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

export async function likePost(postId: string): Promise<any> {
  try {
    const response = await authFetch(`/likePost/${postId}`, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error('Failed to like post');
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
}

export async function dislikePost(postId: string): Promise<any> {
  try {
    const response = await authFetch(`/dislikePost/${postId}`, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error('Failed to dislike post');
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error disliking post:', error);
    throw error;
  }
}

export async function addCommentt(postId: string, text: string): Promise<AddCommentResponse> {
  try {
    const response = await authFetch(`/addComment/${postId}`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to add comment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

export async function getCurrentUserPost() {
  try {
    const response = await authFetch('/currentUserPost',{
      method: 'GET',
    })
    if (!response.ok) {
      throw new Error('Failed to add comment');
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error fetching all Post', error);
    throw error;
  }
}