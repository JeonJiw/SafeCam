import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import ErrorMessage from "../components/UI/ErrorMessage";
import { PasswordRules } from "../components/Auth/PasswordRule";
import GoogleAuthButton from "../components/Auth/GoogleAuthButton";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordRules, setPasswordRules] = useState({
    hasLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    //Check password rules
    if (name === "password") {
      setPasswordRules({
        hasLength: value.length >= 8,
        hasUpperCase: /[A-Z]/.test(value),
        hasLowerCase: /[a-z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecial: /[!@#$%^&*]/.test(value),
      });
    }

    //Check password match
    if (name === "password" || name === "confirmPassword") {
      if (name === "password") {
        setPasswordMatch(value === formData.confirmPassword);
      } else {
        setPasswordMatch(formData.password === value);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isPasswordValid = Object.values(passwordRules).every((rule) => rule);

    if (!isPasswordValid) {
      setError("Password does not meet all requirements");
      return;
    }

    if (!passwordMatch) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await fetch("http://localhost:3002/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log("res: ", response);
      if (response.ok) {
        alert("Sign up successful!");
        navigate("/login");
      } else {
        setError("Sign up failed. Please try again.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your Account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <GoogleAuthButton type="signup" />

          {/* Regular Sign Up Form */}
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
              <div>
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  icon={Lock}
                  required
                />
                <PasswordRules rules={passwordRules} />
              </div>
              <div>
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  icon={Lock}
                  required
                />
                {formData.confirmPassword && (
                  <div
                    className={`text-sm ${
                      passwordMatch ? "text-green-600" : "text-red-600"
                    } mt-1`}
                  >
                    {passwordMatch
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </div>
                )}
              </div>

              <Input
                label="Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                icon={User}
                required
              />

              <Button type="submit" variant="primary" fullWidth>
                Sign Up
              </Button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6">
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
