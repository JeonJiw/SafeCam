import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleGoogleAuth = () => {
    const backendURL = "http://localhost:3002";
    window.location.href = `${backendURL}/auth/google`;
  };

  // Callback after Google Auth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } else if (error) {
      setError("Google authentication failed");
    }
  }, [navigate]);

  return { handleGoogleAuth, error };
};
