"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser as loginUserApi } from "../../api/auth"; // Renamed to avoid conflict with local function

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
       toast.promise(
       await loginUserApi({ email, password }), // Call your actual API function here
        {
          loading: "Logging in...",
          success: (data) => {
            // Store the token (e.g., in localStorage) if your API returns it
            if (data.token) {
              localStorage.setItem("authToken", data.token);
            }
            return data.message || "Login successful";
          },
          error: (err) => {
            // Extract the error message from the backend response
            const errorMessage = err.response?.data?.message || err.message || "Login failed. Please try again.";
            throw new Error(errorMessage); // This will be caught by toast.promise and displayed
          },
        }
      );
      // If the toast.promise 'success' handler completes without throwing, navigate
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      // The toast.promise `error` handler already displayed the message,
      // so no extra toast here.
    } finally {
      setLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-[#313132]">
      {/* Left - Form */}
      <div className="w-full max-w-lg md:w-1/2 px-4 sm:px-6 py-10 flex justify-center items-center">
        <Card className="w-full bg-[#1f1f1f] text-white border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-green-400">
              Login
            </CardTitle>
            <CardDescription className="text-center text-gray-400 text-sm sm:text-base">
              Enter your email and password to login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-green-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 bg-[#2b2b2b] text-white border-none focus-visible:ring-green-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-green-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-[#2b2b2b] text-white border-none focus-visible:ring-green-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0 text-green-400 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
            <CardFooter className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <div className="text-center">
                Don't have an account?{" "}
                <a href="/register" className="text-green-600 hover:underline">
                  Signup here
                </a>
              </div>
            </CardFooter>
          </CardContent>
        </Card>
      </div>

      {/* Right - Visual */}
      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center p-6">
        <div className="text-center max-w-md">
          <img
            src="https://altoran.ai/assets/Character-working-laptop-while-sitting-chair-zizl6Ypq.png"
            alt="Login Visual"
            className="w-full h-auto max-h-96 object-contain mx-auto"
          />
          <h2 className="mt-6 text-xl md:text-2xl font-semibold text-green-400">
            Welcome back! Let's build something amazing together.
          </h2>
          <p className="mt-2 text-sm md:text-base italic text-gray-300">
            “Success usually comes to those who are too busy to be looking for
            it.”
            <br />— Henry David Thoreau
          </p>
        </div>
      </div>
    </div>
  );
}
