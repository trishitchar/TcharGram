import { userBaseURL } from "@/data/data";

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
  
    const response = await fetch(`${userBaseURL}${endpoint}`, fetchOptions);
  
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
  
    return response;
  }

export async function getProfile(userId:string) {
    // alert(userId);
    try {
        const response = await authFetch(`/profile/${userId}`,{
            method: 'GET'
        });
        if(!response.ok) throw new Error('Failed to getProfile');
    
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error getProfile', error);
        throw error;
    }


}