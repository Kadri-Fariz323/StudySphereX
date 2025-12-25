

import { createContext, useState, useEffect } from "react";
export const AuthContext = createContext(null);
import { initialSignInFormData, initialSignUpFormData } from "../config/index";
import { registerService } from "../services/registerService";
import { loginService } from "../services/loginService";
import { checkAuthService } from "../services/loginService"

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({ authenticate: false, user: null });
  const [loading, setLoading] = useState(false);

  async function handleRegisterUser(formData) {
    const data = await registerService(formData);
    console.log(data);
    return data;
  }

  async function loginUser(formData) {
    const data = await loginService(formData);
    if (data.success) {
      console.log(data);

      sessionStorage.setItem(
        "accessToken",
        JSON.stringify(data.token)
      );
      setAuth({
        authenticate: true,
        user: data.user,
      });
    } else {
      setAuth({
        authenticate: false,
        user: null,
      });
    }
  }

  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        setLoading(false);
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (!error?.response?.data?.success) {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  console.log(auth, "gf");

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        loginUser,
        auth,
        resetCredentials
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
