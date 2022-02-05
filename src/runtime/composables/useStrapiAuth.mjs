import { useStrapiToken } from "./useStrapiToken.mjs";
import { useStrapiTokenRefresh } from "./useStrapiTokenRefresh.mjs";
import { useStrapiUser } from "./useStrapiUser.mjs";
import { useStrapiClient } from "./useStrapiClient.mjs";
import { useStrapiUrl } from "./useStrapiUrl.mjs";
export const useStrapiAuth = () => {
  const url = useStrapiUrl();
  
  const token = useStrapiToken();
  const refreshToken = useStrapiTokenRefresh();
  const user = useStrapiUser();
  const client = useStrapiClient();
  const setToken = (value) => {
    token.value = value;
  };
  const setRefresh = (value) => {
    refreshToken.value = value;
    
  };
  const setUser = (value) => {
    user.value = value;
  };
  const fetchUser = async () => {
    
    if (!user.value) {
      try {
        user.value = await client("/users/me");
      } catch (e) {
          
        
        if (refreshToken.value) {
          setToken(null);
            try {
             
              
            const { jwt, refresh } = await client("/auth/refreshToken",  { method: "POST", body: ({
              "token": refreshToken.value,
              "renew": true
            }) });

            console.log("new jwt: ", jwt)
            console.log("new refresh: ", refresh)

              setToken(jwt);
              setRefresh(refresh);

                  try {
                    user.value = await client("/users/me");
                  } catch (e) {
                    console.log("jwt after refresh error: ", e)
                    

                  }
                
             } catch (e) {
             console.log("refresh error: ", e)
             setRefresh(null)
             

             }
            }
            
      }
    }

   
    return user;
  };
  const login = async (data) => {
    setToken(null);
    setRefresh(null);
    const { jwt, refresh } = await client("/auth/local", { method: "POST", body: data });
    setToken(jwt);
    setRefresh(refresh);
    const user2 = await fetchUser();
    return {
      user: user2,
      jwt
    };
  };
  const logout = () => {
    setToken(null);
    setRefresh(null);
    setUser(null);
  };
  const register = async (data) => {
    setToken(null);
    setRefresh(null);
    const { jwt, refresh } = await client("/auth/local/register", { method: "POST", body: data });
    
    setToken(jwt);
    setRefresh(refresh);
    const user2 = await fetchUser();
    return {
      user: user2,
      jwt
    };
  };
  const forgotPassword = async (data) => {
    setToken(null);
    //setRefresh(null);
    await client("/auth/forgot-password", { method: "POST", body: data });
  };
  const resetPassword = async (data) => {
    
    if (refreshToken.value) {
    await client("/auth/revoke", { method: "POST", body: ({
      "token": refreshToken.value,
      
    }) });
    }
    setToken(null);
    setRefresh(null);

    const { jwt, refresh } = await client("/auth/reset-password", { method: "POST", body: data });
    setToken(jwt);
    setRefresh(refresh);
    const user2 = await fetchUser();
    return {
      user: user2,
      jwt
    };
  };
  const sendEmailConfirmation = async (data) => {
    await client("/auth/send-email-confirmation", { method: "POST", body: data });
  };
  const getProviderAuthenticationUrl = (provider) => {
    return new URL(`/connect/${provider}`, url).href;
  };
  const authenticateProvider = async (provider, access_token) => {
    setToken(null);
    setRefresh(null);
    const { jwt } = await client(`/auth/${provider}/callback`, { method: "GET", params: { access_token } });
    setToken(jwt);
    const user2 = await fetchUser();
    return {
      user: user2,
      jwt
    };
  };
  return {
    setToken,
    setUser,
    fetchUser,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    sendEmailConfirmation,
    getProviderAuthenticationUrl,
    authenticateProvider
  };
};
