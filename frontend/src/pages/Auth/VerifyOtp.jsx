"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
// Import your actual API functions
import {
  verifyOtp as verifyOtpApi,
  resendOtp as resendOtpApi,
} from "../../api/auth";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef(null); // Ref to hold the interval ID
  const navigate = useNavigate();
  const location = useLocation();

  // Extract userId and email from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId"); // Note: Your backend verifyOtp doesn't use userId, only email and otp
  const email = queryParams.get("email");

  // Timer logic
  useEffect(() => {
    // Only start timer if email is present
    if (email) {
      clearInterval(timerRef.current); // Clear any existing timer
      setCanResend(false); // Reset resend state when timer starts
      setTimeLeft(300); // Reset timer to initial 5 minutes

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setCanResend(true); // Allow resend when timer runs out
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      // If no email, allow resend immediately (or handle error)
      setCanResend(true);
      setTimeLeft(0);
    }

    // Cleanup function to clear interval on component unmount
    return () => clearInterval(timerRef.current);
  }, [email]); // Re-run effect if email changes

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email address is missing. Cannot resend OTP.");
      return;
    }

    setResendLoading(true);
    setCanResend(false); // Disable button immediately after clicking resend

    try {
      // Call your actual resendOtp API function
      const result =  toast.promise(
        await resendOtpApi({ email }), // Pass email as a payload object
        {
          loading: "Resending OTP...",
          success: (data) => {
            // Reset timer on success and restart it
            setTimeLeft(300);
            clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
              setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                  clearInterval(timerRef.current);
                  setCanResend(true);
                  return 0;
                }
                return prevTime - 1;
              });
            }, 1000);
            return data.message || "OTP resent successfully!";
          },
          error: (err) => {
            // Access the error message from the backend response
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Failed to resend OTP.";
            throw new Error(errorMessage); // Throw to be caught by toast.promise error handler
          },
        }
      );
    } catch (error) {
      console.error("Resend OTP error:", error);
      // toast.promise already handles showing the error, so no extra toast here.
    } finally {
      setResendLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");

    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits.");
      return;
    }

    if (!email) {
      toast.error("Email address is missing. Please try registering again.");
      return;
    }

    setLoading(true);

    try {
      // Call your actual verifyOtp API function
      const result =  toast.promise(
        await verifyOtpApi({ email, otp }), // Pass email and otp as a payload object
        {
          loading: "Verifying OTP...",
          success: (data) => {
            // Check if a token is received and store it
            if (data.token) {
              // <--- ADDED THIS CHECK
              localStorage.setItem("authToken", data.token); // <--- ADDED THIS LINE
            }
            return data.message || "Email verified successfully!";
          },
          error: (err) => {
            // Access the error message from the backend response
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Invalid OTP or server error.";
            throw new Error(errorMessage); // Throw to be caught by toast.promise error handler
          },
        }
      );

      // If successful, navigate to dashboard
      // This will only be reached if the toast.promise 'success' handler completes without throwing
      navigate("/dashboard");
    } catch (error) {
      console.error("OTP Verify Error:", error);
      // toast.promise already handles showing the error, so no extra toast here.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-[#313132] text-white">
      {/* Left - Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-md bg-[#1f1f1f] border-none text-white shadow-xl rounded-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
              Verify OTP
            </CardTitle>
            <CardDescription className="text-center text-green-100 text-sm sm:text-base">
              Enter the OTP sent to{" "}
              <span className="font-semibold text-green-300">
                {email || "your email address"}
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="flex w-full justify-center items-center px-4 py-6">
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              {/* OTP Input */}
              <div className="flex flex-col items-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => {
                    setOtp(value);
                    setOtpError(""); // Clear error on change
                  }}
                  className="mx-auto"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {otpError && (
                  <p className="text-red-500 text-xs mt-2">{otpError}</p>
                )}
              </div>

              <div className="text-center text-sm font-medium text-green-200">
                Time left: {formatTime(timeLeft)}
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={loading || otp.length !== 6 || !email} // Disable if OTP not 6 digits or email missing
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify OTP
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col text-sm text-green-200 mt-4">
            <div className="text-center">
              Didn't receive the OTP?{" "}
              <button
                onClick={handleResendOtp}
                className="text-green-300 underline hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canResend || resendLoading || !email} // Also disable if email is missing
              >
                {resendLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                ) : (
                  "Resend OTP"
                )}
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Right - Image and Quote */}
      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="text-center max-w-lg">
          <img
            src="https://altoran.ai/assets/Character-working-laptop-while-sitting-chair-zizl6Ypq.png"
            alt="Visual"
            className="max-w-full max-h-96 mx-auto "
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
