import { createContext, useState, useEffect } from "react";
import { initialSignInFormData, initialSignUpFormData } from "../config/index";
import { registerService } from "../services/registerService";
import { loginService } from "../services/loginService";
import { checkAuthService } from "../services/loginService";
import { Skeleton } from "@/components/UI/skeleton";
import { toast } from "sonner";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  
  const isStudent = auth.user?.role === "student";
  const isInstructor = auth.user?.role === "instructor";

  async function handleRegisterUser(event) {
  event.preventDefault();

  try {
    const data = await registerService(signUpFormData);

    if (data.success) {
      toast.success("New user registered successfully");
      return data;
    } else {
      // backend responded but registration failed
      toast.error(data.message || "User already exists");
    }
  } catch (error) {
    // axios-style error handling
    const message =
      error?.response?.data?.message || "User already exists";
    toast.error(message);
  }
}


async function loginUser(event) {
  event.preventDefault();

  try {
    const data = await loginService(signInFormData);

    if (data.success) {
      localStorage.setItem("accessToken", data.data.token);
      setAuth({ authenticate: true, user: data.data.user });
      toast.success("Login successful");
    } else {
      setAuth({ authenticate: false, user: null });
      toast.error(data.message || "Invalid email or password");
    }
  } catch (error) {
    setAuth({ authenticate: false, user: null });

    const message =
      error?.response?.data?.message || "Invalid email or password";

    toast.error(message);
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
        resetCredentials,
        isStudent,
        isInstructor,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
