import { useState } from "react";
import { MdRemoveRedEye } from "react-icons/md";
import { IoEyeOffSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export const Login = () => {
  const [state, setState] = useState("Login");
  const [eyeIcon, setEyeIcon] = useState(false);
  const [type, setType] = useState("password");

  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateInputs = () => {
    if (state === "Sign Up" && (!name || !email || !password)) {
      alert("Please fill in all fields");
      return false;
    }
    if (state === "Login" && (!email || !password)) {
      alert("Please fill in email and password");
      return false;
    }
    return true;
  };


  const handleEyeIcon = () => {
    setEyeIcon((prev) => !prev);
    setType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  const toggleState = () => {
    setState((prev) => (prev === "Login" ? "Sign Up" : "Login"));
    // Clear form when switching
    setName("");
    setEmail("");
    setPassword("");
    setLoading(false);
    setButtonDisabled(false);
  };

  return (
    <div>
      <div className="bg-gray-50 bg-linear-to-b from-indigo-400 to-white rounded-3xl">
        <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
          <div className="max-w-120 w-full">
           

            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <h1 className="text-slate-900 text-center text-3xl font-semibold">
                {state}
              </h1>

              <form
                className="mt-12 space-y-6"
                onSubmit={(e) => e.preventDefault()}
              >
                {state === "Sign Up" && (
                  <div>
                    <label
                      htmlFor="fullName"
                      className="text-slate-900 text-sm font-medium mb-2 block"
                    >
                      Full name
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                        placeholder="Enter Full Name"
                      />
                      <FaUser className="absolute right-4 text-xl cursor-pointer" />
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="text-slate-900 text-sm font-medium mb-2 block"
                  >
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                      placeholder="Enter Your Email"
                    />
                    <MdEmail className="absolute right-4 text-xl cursor-pointer" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="text-slate-900 text-sm font-medium mb-2 block"
                  >
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="password"
                      name="password"
                      type={type}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                      placeholder="Enter password"
                    />
                    {eyeIcon === false ? (
                      <IoEyeOffSharp
                        onClick={handleEyeIcon}
                        className="absolute right-4 text-xl cursor-pointer"
                        type="button"
                      />
                    ) : (
                      <MdRemoveRedEye
                        onClick={handleEyeIcon}
                        className="absolute right-4 text-xl cursor-pointer"
                        type="button"
                      />
                    )}
                  </div>
                </div>

                {state === "Sign Up" ? (
                  <div className="mt-12!">
                    <button
                      type="button"
                      disabled={buttonDisabled}
                      className={`w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white focus:outline-none ${
                        buttonDisabled
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      }`}
                      onClick=""
                    >
                      {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-12!">
                    <button
                      type="button"
                      disabled={buttonDisabled}
                      className={`w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white focus:outline-none ${
                        buttonDisabled
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      }`}
                      onClick=""
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </div>
                )}

                {state === "Sign Up" ? (
                  <p className="text-slate-900 text-sm mt-6! text-center">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleState}
                      className="text-blue-600 hover:underline font-semibold bg-none border-none cursor-pointer"
                    >
                      Click Here
                    </button>
                  </p>
                ) : (
                  <p className="text-slate-900 text-sm mt-6! text-center">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleState}
                      className="text-blue-600 hover:underline font-semibold bg-none border-none cursor-pointer"
                    >
                      Register here
                    </button>
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
