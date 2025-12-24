import { createContext, useState } from "react";
export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);

  async function handleRegisterUser(event) {
    event.preventDefault();
    const data = await registerService(signUpFormData);
  }

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
}

export { AuthProvider };
