import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import ErrorMessage from "../components/UI/ErrorMessage";
import GoogleAuthButton from "../components/UI/GoogleAuthButton";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API Call
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <GoogleAuthButton />

          <form onSubmit={handleSubmit}>
            <ErrorMessage message={error} />

            <div className="space-y-6">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                required
              />

              <Button type="submit" variant="primary" fullWidth>
                Sign In
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-sm text-center">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
