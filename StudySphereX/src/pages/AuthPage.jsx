import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/UI/Card";

import { signInFormControls, signUpFormControls } from "../config/index"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/UI/tabs";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { CommonForm } from "@/components/UI/common-form/CommonForm";


export const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("signin");

  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    loginUser,
  } = useContext(AuthContext);

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.email !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.name?.trim() !== "" &&
      signUpFormData.email?.trim() !== "" &&
      signUpFormData.password?.trim() !== "" &&
      signUpFormData.role?.trim() !== ""
    );
  }

  // 👇 wrapper to auto switch after signup
  const handleSignupAndSwitch = async (e) => {
    await handleRegisterUser(e);
    setActiveTab("signin");
  };

  return (
    <div className="flex items-center justify-center min-h-screen 
      bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
      
      <Tabs
        value={activeTab}
        defaultValue="signin"
        onValueChange={handleTabChange}
        className="w-full max-w-md"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <Card className="p-6 space-y-4 shadow-xl rounded-2xl backdrop-blur-sm transition-all">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome back 👋</CardTitle>
              <CardDescription>
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <CommonForm
                formControls={signInFormControls}
                buttonText={"Sign In"}
                formData={signInFormData}
                setFormData={setSignInFormData}
                handleSubmit={loginUser}
                isButtonDisabled={!checkIfSignInFormIsValid()}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card className="p-6 space-y-4 shadow-xl rounded-2xl backdrop-blur-sm transition-all">
            <CardHeader>
              <CardTitle className="text-2xl">Create an account 🚀</CardTitle>
              <CardDescription>
                Enter your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <CommonForm
                formControls={signUpFormControls}
                buttonText={"Sign Up"}
                formData={signUpFormData}
                setFormData={setSignUpFormData}
                handleSubmit={handleSignupAndSwitch}
                isButtonDisabled={!checkIfSignUpFormIsValid()}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

