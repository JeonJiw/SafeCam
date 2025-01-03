import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/auth";

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleGoogleAuth = () => {
    authAPI.initiateGoogleAuth();
  };

  useEffect(() => {
    const handleCallback = async () => {
      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        try {
          console.log("callback with code:", code);
          const response = await authAPI.handleGoogleCallback(
            window.location.search
          );
          console.log("Backend response:", response);

          if (response && response.data) {
            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate("/dashboard");
          } else {
            console.error("Unexpected response structure:", response);
            setError("Invalid response format");
          }
        } catch (err) {
          console.error("Detailed auth error:", err);
          setError(err.message || "Authentication failed");
        }
      }
    };

    handleCallback();
  }, [navigate]);

  return { handleGoogleAuth, error };
};
