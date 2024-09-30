import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
    userId: string;
    // Add other properties that are in your JWT payload
  }

export function decodeToken(): string | null {
  const token = localStorage.getItem('token');
  // console.log("getItem-token"+ token)
  if (!token) {
    console.warn('No token found in localStorage');
    return null;
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (!decoded || !decoded.userId) {
      console.warn('Invalid token: Missing userId');
      return null;
    }
    console.log("decoded.userId"+decoded.userId)
    return decoded.userId;
  } catch (error) {
    console.warn('Error decoding token:', error);
    return null;
  }
}