"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger, // Import DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Import toast for notifications

import { ethers } from "ethers"; // Ensure ethers is installed (npm install ethers or yarn add ethers)
import { useSession } from "../context/SessionContext";
import { createInvestmentApi } from "../api/investment.api";

// --- Constants for USDT Payment (for demonstration on a test network) ---
// **IMPORTANT**: Replace with actual contract address and ABI for your network/USDT token.
// This is a dummy example for Sepolia/Goerli ERC20 standard token.
// For testing on Sepolia, you might use a known ERC-20 token contract or deploy your own.
// Example of a WETH (Wrapped Ether) contract on Sepolia for demonstration purposes,
// as a general ERC-20 contract for testing. You'd replace this with actual USDT.
const USDT_CONTRACT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // Placeholder: Replace with a real USDT contract on your testnet (e.g., Sepolia)
const USDT_ABI = [
  // Minimal ABI for transfer function
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];
const USDT_DECIMALS = 6; // USDT typically has 6 decimal places

const WalletConnectIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17 12.75L12.75 17L7 11.25L11.25 7L17 12.75Z"
      fill="#3B99FC"
    />
  </svg>
);

export function InvestDialog() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [isSubmittingInvestment, setIsSubmittingInvestment] = useState(false);

  const { user, loading: userSessionLoading } = useSession(); // Get user object from session

  const MIN_INVESTMENT_USD = 0.01;
  const TARGET_WALLET_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; 

  useEffect(() => {
    // This effect runs only on the client side after initial render
    const connected = localStorage.getItem("isWalletConnected") === "true";
    const storedAddress = localStorage.getItem("walletAddress");
    setIsWalletConnected(connected);
    if (connected && storedAddress) {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        provider
          .listAccounts()
          .then((accounts) => {
            if (
              accounts.length > 0 &&
              accounts[0].address.toLowerCase() === storedAddress.toLowerCase()
            ) {
              setWalletAddress(accounts[0].address);
            } else if (accounts.length > 0) {
              // If connected but active account changed, update it
              const newAddress = accounts[0].address;
              setWalletAddress(newAddress);
              localStorage.setItem("walletAddress", newAddress);
              toast.info("Wallet address updated to active account.");
            } else {
              // No accounts found in wallet, clear connection
              setIsWalletConnected(false);
              setWalletAddress("");
              localStorage.removeItem("isWalletConnected");
              localStorage.removeItem("walletAddress");
              toast.info(
                "Wallet was connected in localStorage but no active accounts found. Disconnected."
              );
            }
          })
          .catch((err) => {
            console.error("Failed to get accounts on mount:", err);
            setIsWalletConnected(false);
            setWalletAddress("");
            localStorage.removeItem("isWalletConnected");
            localStorage.removeItem("walletAddress");
            toast.error(
              "Failed to verify connected wallet. Please reconnect."
            );
          });
      } else {
        // Metamask/window.ethereum not detected, clear connection
        setIsWalletConnected(false);
        setWalletAddress("");
        localStorage.removeItem("isWalletConnected");
        localStorage.removeItem("walletAddress");
        toast.error("MetaMask not detected. Please install it.");
      }
    }
  }, []);

  const resetDialogState = () => {
    setErrorMessage("");
    setInvestmentAmount("");
    setIsSubmittingPayment(false);
    setIsSubmittingInvestment(false);
  };

  const connectWallet = async (walletType) => {
    setErrorMessage("");
    try {
      if (walletType === "MetaMask" && typeof window !== "undefined" && window.ethereum) {
        setIsSubmittingPayment(true); // Indicate connection attempt
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          const address = accounts[0];
          setIsWalletConnected(true);
          setWalletAddress(address);
          localStorage.setItem("isWalletConnected", "true");
          localStorage.setItem("walletAddress", address);
          toast.success("MetaMask connected successfully!");
        } else {
          setErrorMessage("No accounts found in MetaMask.");
          toast.error("No accounts found in MetaMask.");
        }
      } else if (walletType === "SafePal" || walletType === "WalletConnect") {
        setErrorMessage(
          `${walletType} integration requires a specific SDK. Please use MetaMask for this demo.`
        );
        toast.info(
          `${walletType} integration requires a specific SDK. Please use MetaMask for this demo.`
        );
      } else {
        setErrorMessage(
          "No compatible wallet detected or selected wallet not supported. Please install MetaMask."
        );
        toast.error(
          "No compatible wallet detected. Please install MetaMask."
        );
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        setErrorMessage("Wallet connection rejected by user.");
        toast.error("Wallet connection rejected by user.");
      } else {
        setErrorMessage(
          `Failed to connect wallet: ${error.message || "An unknown error occurred."
          }`
        );
        toast.error(
          `Failed to connect wallet: ${error.message || "An unknown error occurred."
          }`
        );
      }
    } finally {
      setIsSubmittingPayment(false); // Reset connection attempt loading
    }
  };

  const handlePaymentAndInvest = async () => {
    setErrorMessage("");
    const amount = parseFloat(investmentAmount);

    if (isNaN(amount) || amount < MIN_INVESTMENT_USD) {
      const msg = `Investment amount must be at least $${MIN_INVESTMENT_USD}.`;
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (!isWalletConnected || (typeof window !== "undefined" && !window.ethereum)) {
      const msg = "Wallet not connected or MetaMask not detected. Please connect your wallet first.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (!user?.id) {
      const msg = "User session not found. Please log in again to invest.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setIsSubmittingPayment(true); // Start payment submission loading
    let paymentToastId = toast.loading("Sending USDT payment... Please confirm in your wallet.");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(); // No need for index

      // --- USDT Payment Logic ---
      const usdtContract = new ethers.Contract(
        USDT_CONTRACT_ADDRESS,
        USDT_ABI,
        signer
      );

      // Convert USD amount to USDT (with 6 decimals for USDT)
      // **IMPORTANT**: In a real app, you'd convert USD to USDT using a reliable oracle or exchange rate.
      // For this demo, we're assuming 1 USD = 1 USDT, so we just use the amount directly with USDT decimals.
      const amountInUsdtUnits = ethers.parseUnits(
        amount.toString(),
        USDT_DECIMALS
      );

      // Check if user has enough USDT balance
      const userUsdtBalance = await usdtContract.balanceOf(
        await signer.getAddress()
      );
      if (userUsdtBalance < amountInUsdtUnits) {
        const msg =
          "Insufficient USDT balance in your wallet for this investment.";
        setErrorMessage(msg);
        toast.dismiss(paymentToastId);
        toast.error(msg);
        return;
      }

      // Perform USDT transfer
      const transactionResponse = await usdtContract.transfer(
        TARGET_WALLET_ADDRESS,
        amountInUsdtUnits
      );
      const receipt = await transactionResponse.wait(); // Wait for transaction to be mined

      if (receipt.status === 0) {
        // Transaction failed
        throw new Error("USDT transfer failed on blockchain.");
      }

      toast.dismiss(paymentToastId); // Dismiss loading toast
      toast.success(
        "USDT payment successful! Now processing your investment on the backend."
      );
      console.log("USDT Transaction confirmed:", receipt.hash);

      // --- Backend Investment API Call ---
      setIsSubmittingInvestment(true); // Start backend investment submission loading
      const investmentResponse = await createInvestmentApi(user.id, amount); // Pass USD amount to backend
      toast.success(
        investmentResponse.message || "Investment successfully recorded!"
      );
      setDialogOpen(false); // Close dialog on success
      resetDialogState();
    } catch (error) {
      toast.dismiss(paymentToastId); // Dismiss any loading toasts
      console.error("Error during payment or investment:", error);
      let displayErrorMessage =
        "An unknown error occurred during payment or investment.";

      if (error.code === "ACTION_REJECTED") {
        displayErrorMessage = "Transaction rejected by user.";
      } else if (error.message && error.message.includes("insufficient funds")) {
        displayErrorMessage = "Insufficient ETH for gas or USDT balance for transaction.";
      } else if (error.message) {
        // Attempt to extract a more user-friendly message from the error
        displayErrorMessage = error.message.includes("user rejected transaction")
          ? "Transaction rejected by user."
          : error.message.includes("insufficient funds")
            ? "Insufficient funds for transaction."
            : error.message.includes("contract not deployed")
              ? "USDT contract not found on the current network. Please check the contract address and network."
              : error.message;
      }
      setErrorMessage(displayErrorMessage);
      toast.error(displayErrorMessage);
    } finally {
      setIsSubmittingPayment(false); // End payment submission loading
      setIsSubmittingInvestment(false); // End backend investment submission loading
    }
  };

  const handleOpenChange = (open) => {
    setDialogOpen(open);
    if (!open) {
      resetDialogState(); // Reset state when dialog closes
    }
  };

  const isAnySubmitting = isSubmittingPayment || isSubmittingInvestment;
  const isButtonDisabled = isAnySubmitting || userSessionLoading; // Disable if user session is loading

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="px-8 py-4 rounded-xl text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 transform hover:scale-105">
          {isWalletConnected ? "Invest Now" : "Connect Wallet and Invest Now"}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-gray-100 border-gray-800 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-purple-400">
            {isWalletConnected ? "Invest in Crypto" : "Connect Your Wallet"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400 mt-2">
            {isWalletConnected
              ? `You are connected with: ${walletAddress.substring(
                0,
                6
              )}...${walletAddress.substring(
                walletAddress.length - 4
              )}. Enter the amount you wish to invest.`
              : "Connect a crypto wallet to proceed with your investment."}
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <p className="text-red-400 text-sm mt-4 p-2 bg-red-900/30 rounded-md border border-red-700 text-center">
            {errorMessage}
          </p>
        )}

        {isWalletConnected ? (
          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label
                htmlFor="amount"
                className="text-right sm:text-left text-gray-300"
              >
                Amount (USD)
              </Label>
              <Input
                id="amount"
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder={`Minimum $${MIN_INVESTMENT_USD}`}
                className="col-span-full sm:col-span-3 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500"
                min={MIN_INVESTMENT_USD}
                step="0.01"
                disabled={isAnySubmitting}
              />
            </div>
            {parseFloat(investmentAmount) > 0 && (
              <p className="text-sm text-gray-400 text-center">
                This will transfer{" "}
                <strong className="text-white">
                  {parseFloat(investmentAmount).toFixed(2)} USDT
                </strong>{" "}
                to the platform wallet.
                <br />
                Please ensure you have sufficient USDT and ETH (for gas) in your
                connected wallet.
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-3 py-6 text-lg font-medium border-2 border-gray-700 hover:border-blue-500 hover:bg-gray-800 text-gray-100 transition duration-200 shadow-md rounded-lg"
              onClick={() => connectWallet("MetaMask")}
              disabled={isAnySubmitting}
            >
              <img
                src="https://img.icons8.com/color/48/metamask-logo.png"
                className="h-8 w-8" // Adjusted image size for better fit
                alt="MetaMask Icon"
              />{" "}
              Connect MetaMask
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-3 py-6 text-lg font-medium border-2 border-gray-700 hover:border-blue-500 hover:bg-gray-800 text-gray-100 transition duration-200 shadow-md rounded-lg"
              onClick={() => connectWallet("SafePal")}
              disabled={true} // SafePal is not supported in this demo
            >
              <img
                src="https://altoran.ai/assets/safepal-DMCHLOSM.png"
                className="h-8 w-8" // Adjusted image size for better fit
                alt="SafePal Icon"
              />{" "}
              Connect SafePal (SDK required)
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-3 py-6 text-lg font-medium border-2 border-gray-700 hover:border-blue-500 hover:bg-gray-800 text-gray-100 transition duration-200 shadow-md rounded-lg"
              onClick={() => connectWallet("WalletConnect")}
              disabled={true} // WalletConnect is not supported in this demo
            >
              <WalletConnectIcon /> Connect WalletConnect (SDK required)
            </Button>
            <p className="text-sm text-gray-500 text-center mt-4">
              Please ensure you have the respective wallet extension or app
              installed.
            </p>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          {isWalletConnected ? (
            <>
              <Button
                type="submit"
                onClick={handlePaymentAndInvest}
                disabled={
                  isButtonDisabled ||
                  parseFloat(investmentAmount) < MIN_INVESTMENT_USD ||
                  !user?.id // Disable if user is not logged in
                }
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 py-3 px-6 rounded-lg font-semibold shadow-md transition duration-200"
              >
                {isSubmittingPayment
                  ? "Sending Payment..."
                  : isSubmittingInvestment
                    ? "Finalizing Investment..."
                    : "Pay USDT and Invest"}
              </Button>
              <Button
                onClick={() => {
                  setIsWalletConnected(false);
                  setWalletAddress("");
                  localStorage.removeItem("isWalletConnected");
                  localStorage.removeItem("walletAddress");
                  resetDialogState();
                  toast.info("Wallet disconnected.");
                }}
                variant="destructive" // Using destructive variant for disconnect
                className="py-3 px-6 rounded-lg font-semibold shadow-md transition duration-200 bg-red-600 hover:bg-red-700 text-gray-100"
                disabled={isAnySubmitting}
              >
                Disconnect Wallet
              </Button>
            </>
          ) : (
            <DialogClose asChild>
              <Button
                variant="outline"
                className="py-3 px-6 rounded-lg font-semibold border-2 border-gray-700 hover:border-gray-600 text-gray-100 transition duration-200 bg-gray-800 hover:bg-gray-700"
                disabled={isAnySubmitting}
              >
                Close
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default InvestDialog;
