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
  
// comment er response from backend
export interface AddCommentResponse {
    message: string;
    comment: CommentType;
    success: boolean;
}

export interface UserType {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
    bio?: string;
    gender?: string;
    followers: string[];
    following: string[];
    posts: string[];
    bookmarks: string[];
    // isFollowing?: boolean;
    // Add any other properties you need
}