import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/auth/callback") {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");

      if (token) {
        localStorage.setItem("access_token", token);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    }

    // cleanup
    return () => {
      console.log("AuthCallback cleanup");
    };
  }, [navigate, location]);

  return <div>Google login...</div>;
}

export default AuthCallback;
