
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
  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(event) {
    event.preventDefault();
    const data = await registerService(signUpFormData);
    console.log(data);
    return data;
  }

async function loginUser(event) {
    event.preventDefault();

  const data = await loginService(signInFormData);

  if (data.success) {
    sessionStorage.setItem("accessToken", data.data.token);
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
}


async function checkAuthUser() {
  setLoading(true);

  const token = sessionStorage.getItem("accessToken");
  if (!token) {
    setAuth({ authenticate: false, user: null });
    setLoading(false);
    return;
  }

  try {
    const data = await checkAuthService();

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
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

console.log(auth);

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
      {children}
    </AuthContext.Provider>
  );
}
