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
    // URL에서 access_token과 user 정보를 직접 파싱
    const params = new URLSearchParams(window.location.search);
    console.log("4. Received URL params:", Object.fromEntries(params));

    const accessToken = params.get("access_token");
    const userInfo = params.get("user");
    console.log("5. Extracted tokens:", { accessToken, userInfo });

    if (accessToken) {
      try {
        localStorage.setItem("access_token", accessToken);
        if (userInfo) {
          localStorage.setItem("user", userInfo);
          console.log("6. Stored in localStorage:", {
            access_token: localStorage.getItem("access_token"),
            user: localStorage.getItem("user"),
          });
        }
        navigate("/dashboard");
      } catch (err) {
        console.error("Error processing auth callback:", err);
        setError(err.message || "Authentication failed");
      }
    }
  }, [navigate]);

  return { handleGoogleAuth, error };
};
