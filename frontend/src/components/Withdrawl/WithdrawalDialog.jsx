"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useSession } from "../../context/SessionContext"; // Assuming this context provides user data
import { raiseWithdrawalRequestApi } from "../../api/investment.api"; // Corrected import path based on the previous conversation
import { toast } from "sonner";

const MINIMUM_WITHDRAWL_AMT = 10;
const TRANSACTION_FEE_PERCENTAGE = 0.05; // 5% fee

export function WithdrawalDialog({ open, onOpenChange,onSucceess }) {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user, loading } = useSession(); // Destructure user and loading from useSession hook

  // Initialize walletAddress from localStorage if connected, when the dialog opens
  useEffect(() => {
    if (open) {
      const isWalletConnected = localStorage.getItem("isWalletConnected");
      const walletAddressIfConnected = localStorage.getItem("walletAddress");
      if (isWalletConnected === "true" && walletAddressIfConnected) {
        setWalletAddress(walletAddressIfConnected);
      }
    }
  }, [open]); // Run this effect when the dialog's open state changes

  const walletBalance = user?.walletBalance;

  // Calculate fee and net amount dynamically
  const parsedAmount = parseFloat(amount);
  const adminFeeApplied = useMemo(() => {
    return isNaN(parsedAmount) || parsedAmount <= 0
      ? 0
      : parsedAmount * TRANSACTION_FEE_PERCENTAGE;
  }, [parsedAmount]);

  const totalAmountToDeduct = useMemo(() => {
    return isNaN(parsedAmount) || parsedAmount <= 0
      ? 0
      : parsedAmount + adminFeeApplied;
  }, [parsedAmount, adminFeeApplied]);

  const netReceiveAmount = useMemo(() => {
    return isNaN(parsedAmount) || parsedAmount <= 0
      ? 0
      : parsedAmount - adminFeeApplied;
  }, [parsedAmount, adminFeeApplied]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Validate input
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (parsedAmount < MINIMUM_WITHDRAWL_AMT) {
      setError(`Minimum withdrawal amount is $${MINIMUM_WITHDRAWL_AMT}.`);
      return;
    }

    if (walletBalance !== undefined && totalAmountToDeduct > walletBalance) {
      setError(
        `Insufficient wallet balance. You need $${totalAmountToDeduct.toFixed(
          2
        )} (including $${adminFeeApplied.toFixed(
          2
        )} fee) to withdraw $${parsedAmount.toFixed(2)}.`
      );
      return;
    }

    if (!walletAddress || walletAddress.trim().length < 10) {
      // Basic length validation
      setError("Please enter a valid crypto wallet address.");
      return;
    }

    if (!user?.id) {
      // Use _id as per Mongoose ObjectId
      setError("User session not found. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await raiseWithdrawalRequestApi(
        user.id,
        parsedAmount,
        walletAddress
      );
      // console.log("Withdrawal request submitted successfully:", response); // Removed console.log
      toast.success(
        response.message || "Withdrawal request submitted successfully!"
      ); // Show success toast
      onOpenChange(false); // Close dialog on success
      setAmount(""); // Reset form fields
      onSucceess()
      setWalletAddress(localStorage.getItem("walletAddress") || ""); // Reset to connected wallet or empty
    } catch (err) {
      console.error("Failed to submit withdrawal request:", err);
      const errorMessage =
        err.message || "Failed to submit withdrawal request. Please try again.";
      setError(errorMessage); // Set local error state for dialog
      toast.error(errorMessage); // Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-gray-100 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl text-purple-400">
            Raise a Withdrawal Request
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter the amount you want to withdraw and your wallet address.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-red-900/30 p-3 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="current-balance" className="text-gray-300">
              Current Balance
            </Label>
            <Input
              id="current-balance"
              type="text"
              value={
                loading ? "Loading..." : `$${(walletBalance || 0).toFixed(2)}`
              }
              readOnly
              className="bg-gray-800 border-gray-700 text-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-300">
              Amount (USD)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            {parsedAmount > 0 && (
              <p className="text-sm text-gray-400">
                A {TRANSACTION_FEE_PERCENTAGE * 100}% transaction fee of $
                {adminFeeApplied.toFixed(2)} will be charged. You will receive $
                {netReceiveAmount.toFixed(2)}.
                <br />
                Total deducted from wallet: ${totalAmountToDeduct.toFixed(2)}.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet" className="text-gray-300">
              Crypto Wallet Address
            </Label>
            <Input
              id="wallet"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-100"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting || loading || !user} // Disable if submitting, loading user, or user not logged in
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isSubmitting ? "Processing..." : "Raise Withdrawal Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
