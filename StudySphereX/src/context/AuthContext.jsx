
import { createContext, useState, useEffect } from "react";
export const AuthContext = createContext(null);
import { initialSignInFormData, initialSignUpFormData } from "../config/index";
import { registerService } from "../services/registerService";
import { loginService } from "../services/loginService";
import { checkAuthService } from "../services/loginService"
import { Skeleton } from "@/components/UI/skeleton";

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
 const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(event) {
    event.preventDefault();
    const data = await registerService(signUpFormData);
    console.log(data);
    return data;
  }

async function loginUser(event) {
  event.preventDefault();
  try {
    const data = await loginService(signInFormData);

    if (data.success) {
      localStorage.setItem("accessToken", data.data.token);
      setAuth({ authenticate: true, user: data.data.user });
  console.log("AUTH USER FROM API:", data.data.user);

    } else {
      setAuth({ authenticate: false, user: null });
    }
  } catch (err) {
    setAuth({ authenticate: false, user: null });
  }

}


async function checkAuthUser() {
  setLoading(true);

  const token = localStorage.getItem("accessToken");
  if (!token) {
    setAuth({ authenticate: false, user: null });
    setLoading(false);
    return;
  }
  try {
    const data = await checkAuthService();

    try {
      if (data.success) {
      setAuth({
        authenticate: true,
        user: data.data.user,
      });
    } else {
      setAuth({
        authenticate: false,
        user: null,
      });
    }
    } catch (error) {
      console.log(error);
    }
    
  } catch {
    setAuth({
      authenticate: false,
      user: null,
    });
  } finally {
    setLoading(false);
  }
}
function resetCredentials() {
  localStorage.removeItem("accessToken");
  setAuth({
    authenticate: false,
    user: null,
  });
}


  useEffect(() => {
    checkAuthUser();
  }, []);



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
        loading,
        resetCredentials
      }}
    >
       {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
