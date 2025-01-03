import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleAuth = () => {
      const accessToken = decodeURIComponent(searchParams.get("access_token"));
      const userInfo = searchParams.get("user");

      console.log("AuthCallback: Extracted Access Token:", accessToken);
      console.log("AuthCallback: User Info:", userInfo);

      if (
        accessToken &&
        accessToken !== "null" &&
        accessToken !== "undefined"
      ) {
        login(accessToken);

        if (userInfo) {
          localStorage.setItem("user_info", userInfo);
        }

        console.log("AuthCallback: Attempting to navigate to dashboard");
        navigate("/dashboard");
      } else {
        console.error("AuthCallback: Invalid or missing access token");
        navigate("/login");
      }
    };

    handleAuth();
  }, [navigate, searchParams, login]);

  return <div>Google login...</div>;
}

export default AuthCallback;
