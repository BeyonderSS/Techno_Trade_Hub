"use client";

import { useState, useEffect } from "react"; // Import useEffect
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import {
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  Gift,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser as registerUserApi } from "../../api/auth"; // Renamed to avoid conflict

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState(""); // Changed from 'phone' to 'contactNumber'
  const [referralCode, setReferralCode] = useState(""); // Renamed from 'referredBy' to 'referralCode'
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access the current URL location

  // Effect to read referral code from URL on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const referralCodeFromUrl = queryParams.get("referralCode"); // Get 'referralCode' from URL (corrected typo from 'reffralCode')
    if (referralCodeFromUrl) {
      setReferralCode(referralCodeFromUrl);
    }
  }, [location.search]); // Re-run effect if URL search params change

  const validateForm = () => {
    let newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!contactNumber) {
      newErrors.contactNumber = "Phone number is required";
    } else if (!/^\d{10,}$/.test(contactNumber)) {
      newErrors.contactNumber = "Phone number must be at least 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Use your actual API function here
      const result = await registerUserApi({
        name, // Corresponds to `name` in backend
        email,
        password,
        contactNumber, // Corresponds to `contactNumber` in backend
        referralCode, // Corresponds to `referralCode` in backend
      });

      if (result.message) {
        toast.success(result.message);
        // Assuming your backend returns user.id and user.email upon successful registration
        navigate(`/verify-otp?userId=${result.user.id}&email=${result.user.email}`);
      } else {
        // Handle cases where the API returns an error message but not as a thrown error
        toast.error(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      // Check if the error object has a 'response' and 'response.data.message' for backend errors
      const errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100 dark:bg-gray-900"
      style={{ backgroundColor: "#313132" }}
    >
      {/* Right Form Section */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full bg-[#1f1f1f] text-white max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-green-600 text-center">
              Sign Up
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Create an account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    className="pl-10 bg-gray-700 text-white border-gray-600 focus-visible:ring-green-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 bg-gray-700 text-white border-gray-600 focus-visible:ring-green-500"
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
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-gray-700 text-white border-gray-600 focus-visible:ring-green-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0 text-muted-foreground hover:bg-gray-600"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Phone Number </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contactNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="pl-10 bg-gray-700 text-white border-gray-600 focus-visible:ring-green-500"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </div>
                {errors.contactNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>
                )}
              </div>

              {/* Referral Code */}
              <div className="space-y-2">
                <Label htmlFor="referralCode">Referral Code </Label>
                <div className="relative">
                  <Gift className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="referralCode"
                    placeholder="Enter referral code (if any)"
                    className="pl-10 bg-gray-700 text-white border-gray-600 focus-visible:ring-green-500"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                  />
                </div>
                {errors.referralCode && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.referralCode}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <div className="text-center">
              Already have an account?{" "}
              <a href="/login" className="text-green-600 hover:underline">
                Login here
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
      {/* Right - Image and Quote */}
      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center text-white p-4 sm:p-6 lg:p-8">
        <div className="text-center max-w-lg">
          <img
            src="https://altoran.ai/assets/Character-working-laptop-while-sitting-chair-zizl6Ypq.png"
            alt="Login Visual"
            className="max-w-full max-h-96 mx-auto"
          />
          <h2 className="mt-4 sm:mt-6 text-xl sm:text-2xl font-semibold text-green-400">
            Welcome back! Let's build something amazing together.
          </h2>
          <p className="mt-2 text-sm italic text-gray-300">
            “Success usually comes to those who are too busy to be looking for
            it.”
            <br />— Henry David Thoreau
          </p>
        </div>
      </div>
    </div>
  );
}
