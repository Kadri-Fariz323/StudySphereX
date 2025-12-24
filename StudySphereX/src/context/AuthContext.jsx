// import { initialSignInFormData, initialSignUpFormData } from '../config/index'

// export default function AuthProvider({ children }) {
//   const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
//   const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);

//   async function handleRegisterUser(event) {
//     event.preventDefault();
//     const data = await registerService(signUpFormData);

//     console.log(data)
//   }

//   return <AuthContext.Provider value={{
//     signInFormData, setSignInFormData,signUpFormData, setSignUpFormData, handleRegisterUser }}>{children}</AuthContext.Provider>;
// }

import { createContext, useState } from "react";
export const AuthContext = createContext(null);
import { initialSignInFormData, initialSignUpFormData } from '../config/index'
import { registerService } from '../services/registerService'
import { loginService } from '../services/loginService'

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);

  async function handleRegisterUser(formData) {
    const data = await registerService(formData);
    console.log(data);
    return data;
  }

  async function loginUser(formData) {
    const data = await loginService(formData);
    console.log(data);
    return data;
  }

  return <AuthContext.Provider value={{
    signInFormData, setSignInFormData, signUpFormData, setSignUpFormData, handleRegisterUser, loginUser }}>{children}</AuthContext.Provider>;
}
