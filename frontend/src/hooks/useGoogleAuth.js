import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleGoogleAuth = async () => {
    try {
      const backendURL = "http://localhost:3002";
      const response = await fetch(`${backendURL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      setError("Google authentication failed");
    }
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
