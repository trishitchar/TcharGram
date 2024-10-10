import { userBaseURL } from "@/data/data";

// router.post('/profile/edit/:id', isTokenValid, upload.single('profilePicture'), editProfile);

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

export async function register(username:string,email: string,password:string) {
  try {
    const response = await authFetch('/register',{
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) throw new Error('Failed to REGISTER');

    const responseData = await response.json();
    // console.log("user api responsedata",response);
    return responseData;

  } catch (error) {
    console.error('Error in REGISTER:', error);
    throw error;
  }
}

export async function login(email:string,password: string) {
  try {
    const response = await authFetch('/login',{
      method: 'POST',
      body: JSON.stringify({email,password}),
    });
    if (!response.ok) throw new Error('Failed to LOGIN');

    const responseData = await response.json();
    // console.log("user api responsedata",response);
    return responseData;
  } catch (error) {
    console.error('Error in LOGIN:', error);
    throw error;
    
  }
}

export async function logout() {
  try {
    const response = await authFetch('/logout',{
      method: 'GET',
    })
    if (!response.ok) throw new Error('Failed to LOGOUT');
    const responseData = await response.json();
    // console.log("user api responsedata",response);
    return responseData;
  } catch (error) {
    console.error('Error in LOGOUT:', error);
    throw error;
  }
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

export async function suggestedUsers() {
  try {
    const response = await authFetch('/suggested', {
      method: 'GET',
    });
    if (!response.ok) throw new Error('Failed to fetch suggested users');

    const responseData = await response.json();
    // console.log("user api responsedata",response);
    return responseData;
  } catch (error) {
    console.error('Error in fetchSuggestedUsers:', error);
    throw error;
  }
}

export async function followorunfollow(targetUserId:string) {
  try {
    const response = await authFetch(`/followorunfollow/${targetUserId}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to fetch suggested users');

    const responseData = await response.json();
    // console.log("user api responsedata",response);
    return responseData;
  } catch (error) {
    console.error('Error in followunfollow:', error);
    throw error;
  }
}

export async function editProfileAPI(formData: FormData): Promise<any> {
  try {
    const response = await authFetch('/profile/edit', {
      method: 'POST',
      body: formData,
    });
    console.log("formdata",formData)

    if (!response.ok) {
      throw new Error('Failed to edit profile');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error editing profile:', error);
    throw error;
  }
}
