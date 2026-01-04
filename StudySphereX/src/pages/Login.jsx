// import { useContext, useState } from "react";
// import { MdRemoveRedEye } from "react-icons/md";
// import { IoEyeOffSharp } from "react-icons/io5";
// import { FaUser } from "react-icons/fa";
// import { MdEmail } from "react-icons/md";
// import { AuthContext } from "../context/AuthContext";


// export const Login = () => {
//   const {
//     signInFormData,
//     setSignInFormData,
//     signUpFormData,
//     setSignUpFormData,
//     handleRegisterUser: contextHandleRegisterUser,
//     loginUser,
//      authenticated,
//   user,
//   } = useContext(AuthContext);

//   const [state, setState] = useState("Login");
//   const [eyeIcon, setEyeIcon] = useState(false);
//   const [type, setType] = useState("password");
//   const [loading, setLoading] = useState(false);
//   const [buttonDisabled, setButtonDisabled] = useState(false);
//   const [auth, setAuth] = useState({
//     authenticate: false,
//     user: null,
//   });



//   const handleEyeIcon = () => {
//     setEyeIcon((prev) => !prev);
//     setType((prev) => (prev === "password" ? "text" : "password"));
//   };

//   const toggleState = () => {
//     setState((prev) => (prev === "Login" ? "Sign Up" : "Login"));
//     setLoading(false);
//     setAuth({ authenticate: false, user: null });
//     setEyeIcon(false);
//     setType("password");
//     setButtonDisabled(false);
//   };

//   const validateInputs = () => {
//     if (
//       state === "Sign Up" &&
//       (!signUpFormData.name ||
//         !signUpFormData.email ||
//         !signUpFormData.password)
//     ) {
//       alert("Please fill in all fields");
//       return false;
//     }

//     if (
//       state === "Login" &&
//       (!signInFormData.email || !signInFormData.password)
//     ) {
//       alert("Please fill in email and password");
//       return false;
//     }

//     return true;
//   };

//   const handleRegister = async () => {
//     if (!validateInputs()) return;

//     try {
//       setLoading(true);
//       setButtonDisabled(true);
//       await contextHandleRegisterUser(signUpFormData);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//       setButtonDisabled(false);
//     }
//   };

//   const handleLogin = async () => {
//     if (!validateInputs()) return;

//     try {
//       setLoading(true);
//       setButtonDisabled(true);
//       await loginUser(signInFormData);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//       setButtonDisabled(false);
//     }
//   };


// console.log(signInFormData);
// console.log(signUpFormData);




//   return (
//     <div className="bg-gray-50 bg-linear-to-b from-indigo-400 to-white rounded-3xl">
//       <div className="min-h-screen flex items-center justify-center px-4">
//         <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border">
//           <h1 className="text-center text-3xl font-semibold mb-10">{state}</h1>

//           <form className="space-y-6">
//             {state === "Sign Up" && (
//               <div>
//                 <label className="text-sm font-medium">Full Name</label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={signUpFormData.name}
//                     onChange={(e) =>
//                       setSignUpFormData({
//                         ...signUpFormData,
//                         name: e.target.value,
//                       })
//                     }
//                     className="w-full px-4 py-3 border rounded-md"
//                     placeholder="Enter Full Name"
//                   />
//                   <FaUser className="absolute right-4 top-3.5" />
//                 </div>
//               </div>
//             )}

//             <div>
//               <label className="text-sm font-medium">Email</label>
//               <div className="relative">
//                 <input
//                   type="email"
//                   value={
//                     state === "Sign Up"
//                       ? signUpFormData.email
//                       : signInFormData.email
//                   }
//                   onChange={(e) =>
//                     state === "Sign Up"
//                       ? setSignUpFormData({
//                           ...signUpFormData,
//                           email: e.target.value,
//                         })
//                       : setSignInFormData({
//                           ...signInFormData,
//                           email: e.target.value,
//                         })
//                   }
//                   className="w-full px-4 py-3 border rounded-md"
//                   placeholder="Enter email"
//                 />
//                 <MdEmail className="absolute right-4 top-3.5" />
//               </div>
//             </div>

//             <div>
//               <label className="text-sm font-medium">Password</label>
//               <div className="relative">
//                 <input
//                   type={type}
//                   value={
//                     state === "Sign Up"
//                       ? signUpFormData.password
//                       : signInFormData.password
//                   }
//                   onChange={(e) =>
//                     state === "Sign Up"
//                       ? setSignUpFormData({
//                           ...signUpFormData,
//                           password: e.target.value,
//                         })
//                       : setSignInFormData({
//                           ...signInFormData,
//                           password: e.target.value,
//                         })
//                   }
//                   className="w-full px-4 py-3 border rounded-md"
//                   placeholder="Enter password"
//                 />
//                 {eyeIcon ? (
//                   <MdRemoveRedEye
//                     onClick={handleEyeIcon}
//                     className="absolute right-4 top-3.5 cursor-pointer"
//                   />
//                 ) : (
//                   <IoEyeOffSharp
//                     onClick={handleEyeIcon}
//                     className="absolute right-4 top-3.5 cursor-pointer"
//                   />
//                 )}
//               </div>
//             </div>

//             <button
//               type="button"
//               disabled={buttonDisabled}
//               onClick={state === "Sign Up" ? handleRegister : handleLogin}
//               className={`w-full py-3 text-white rounded-md ${
//                 buttonDisabled ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {loading
//                 ? state === "Sign Up"
//                   ? "Creating Account..."
//                   : "Logging in..."
//                 : state}
//             </button>

//             <p className="text-center text-sm">
//               {state === "Sign Up"
//                 ? "Already have an account?"
//                 : "Don't have an account?"}{" "}
//               <button
//                 type="button"
//                 onClick={toggleState}
//                 className="text-blue-600 font-semibold"
//               >
//                 {state === "Sign Up" ? "Login" : "Register"}
//               </button>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };
