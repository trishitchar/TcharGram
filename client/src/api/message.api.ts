import { msgBaseURL } from "@/data/data";

async function authFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const fetchOptions: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
    },
  };

  if (!(options.body instanceof FormData)) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      'Content-Type': 'application/json',
    };
  }

  const response = await fetch(`${msgBaseURL}${endpoint}`, fetchOptions);
  if (!response.ok) throw new Error('Unauthorized');

  return response;
}

export async function sendmsg(receiverId: string, textMessage: string): Promise<any> {
  try {
    const response = await authFetch(`/sendmsg/${receiverId}`, {
      method: 'POST',
      body: JSON.stringify({ textMessage }),
    });
    const responseData = await response.json();
    if (responseData.success) {
      return {
        success: true,
        message: responseData.message // Ensure the server returns the saved message
      };
    } else {
      throw new Error(responseData.message || 'Failed to send message');
    }
  } catch (error) {
    console.error('Error in sendmsg frontend API:', error);
    throw error;
  }
}

export async function allmsg(receiverId: string, page: number = 1, limit: number = 20): Promise<any> {
  try {
    const response = await authFetch(`/allmsg/${receiverId}?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error in allmsg frontend API:', error);
    throw error;
  }
}
