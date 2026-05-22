import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

const GoogleLoginBtn = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/googlelogin`, {
        token: credentialResponse.credential,
      });
      localStorage.setItem("token", response.data.token);
      toast.success("Sign-In successful. Welcome, " + response.data.user.name);
      navigate("/");
    } catch (error) {
      console.error("Google Sign-In error:", error);
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    }
  };
  return (
    <div className="pt-2">
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={() => {
          toast.error("Google Sign-In failed. Please try again.");
        }}
      />
    </div>
  );
};

export default GoogleLoginBtn;
