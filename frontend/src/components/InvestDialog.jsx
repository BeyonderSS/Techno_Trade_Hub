import React, { useState, useEffect } from "react";
import { ethers } from "ethers"; // Ensure ethers is installed (npm install ethers or yarn add ethers)
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const MetaMaskIcon = () => (

  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8"
  >
    <circle cx="12" cy="12" r="10" fill="#F6851B" />
    <path
      d="M12.0001 7.2L9.00012 9L12.0001 10.8L15.0001 9L12.0001 7.2Z"
      fill="#FFFFFF"
    />
    <path
      d="M12.0001 11.4L9.00012 13.2L12.0001 15L15.0001 13.2L12.0001 11.4Z"
      fill="#FFFFFF"
    />
    <path
      d="M12.0001 5.4L7.00012 8.4L12.0001 11.4L17.0001 8.4L12.0001 5.4Z"
      fill="#FFA500"
    />
    <path
      d="M12.0001 10.2L7.00012 13.2L12.0001 16.2L17.0001 13.2L12.0001 10.2Z"
      fill="#DE4500"
    />
  </svg>
);

const SafePalIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8"
  >
    <rect x="2" y="2" width="20" height="20" rx="4" fill="#007bff" />
    <path
      d="M7 12L10 15L17 8"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

function InvestDialog() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const MIN_INVESTMENT_USD = 30;
  // Replace with your actual target wallet address for receiving payments
  const TARGET_WALLET_ADDRESS = "0x742d35Cc6634C0539F35dD42fBbeA798C4Bc786d"; // A dummy address for demonstration

  // useEffect to check wallet connection status from localStorage on component mount
  useEffect(() => {
    const connected = localStorage.getItem("isWalletConnected") === "true";
    const storedAddress = localStorage.getItem("walletAddress");
    setIsWalletConnected(connected);
    if (connected && storedAddress) {
      setWalletAddress(storedAddress);
      // Attempt to get the connected address from window.ethereum if still available
      // This re-establishes context in case the user's wallet app changed accounts or disconnected.
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          provider
            .listAccounts()
            .then((accounts) => {
              if (
                accounts.length > 0 &&
                accounts[0].address.toLowerCase() ===
                  storedAddress.toLowerCase()
              ) {
                setWalletAddress(accounts[0].address);
              } else if (accounts.length > 0) {
                // If connected to a different account, update localStorage
                const newAddress = accounts[0].address;
                setWalletAddress(newAddress);
                localStorage.setItem("walletAddress", newAddress);
                console.log("Wallet address updated:", newAddress);
              } else {
                // No accounts found, force disconnect if localStorage says connected
                setIsWalletConnected(false);
                setWalletAddress("");
                localStorage.removeItem("isWalletConnected");
                localStorage.removeItem("walletAddress");
                console.warn(
                  "Wallet was connected in localStorage but no active accounts found. Disconnected."
                );
              }
            })
            .catch((err) => {
              console.error("Failed to get accounts on mount:", err);
              // If error, assume disconnected
              setIsWalletConnected(false);
              setWalletAddress("");
              localStorage.removeItem("isWalletConnected");
              localStorage.removeItem("walletAddress");
            });
        }
      } catch (e) {
        console.error("Error checking wallet address on mount:", e);
        // If error, assume disconnected
        setIsWalletConnected(false);
        setWalletAddress("");
        localStorage.removeItem("isWalletConnected");
        localStorage.removeItem("walletAddress");
      }
    }
  }, []);

  // Helper to reset dialog specific states
  const resetDialogState = () => {
    setErrorMessage("");
    setInvestmentAmount("");
  };

  const connectWallet = async (walletType) => {
    setErrorMessage(""); // Clear previous errors
    try {
      if (walletType === "MetaMask" && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []); // Request accounts
        if (accounts.length > 0) {
          const address = accounts[0];
          setIsWalletConnected(true);
          setWalletAddress(address);
          localStorage.setItem("isWalletConnected", "true");
          localStorage.setItem("walletAddress", address);
          console.log("MetaMask connected:", address);
          // Dialog will automatically transform due to state change
        } else {
          setErrorMessage(
            "No accounts found in MetaMask. Please ensure your MetaMask is unlocked and has accounts."
          );
        }
      } else if (walletType === "SafePal") {
        // SafePal often integrates via WalletConnect or its own injected provider.
        // This is a placeholder for a real integration.
        console.log("Attempting to connect with SafePal...");
        setErrorMessage(
          "SafePal connection requires specific SDK integration. Please use MetaMask if available or another compatible wallet."
        );
        // For demo, if you want to simulate success:
        // setIsWalletConnected(true);
        // setWalletAddress('0xSafePalSimulatedAddress');
        // localStorage.setItem('isWalletConnected', 'true');
        // localStorage.setItem('walletAddress', '0xSafePalSimulatedAddress');
      } else if (walletType === "WalletConnect") {
        // WalletConnect requires a separate library (e.g., @web3modal/ethers)
        // This is a placeholder for a real integration.
        console.log("Attempting to connect with WalletConnect...");
        setErrorMessage(
          "WalletConnect integration requires the WalletConnect library. Please use MetaMask if available."
        );
        // For demo, if you want to simulate success:
        // setIsWalletConnected(true);
        // setWalletAddress('0xWalletConnectSimulatedAddress');
        // localStorage.setItem('isWalletConnected', 'true');
        // localStorage.setItem('walletAddress', '0xWalletConnectSimulatedAddress');
      } else {
        setErrorMessage(
          "No compatible wallet detected or selected wallet not supported. Please install MetaMask or similar."
        );
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        // User rejected request
        setErrorMessage("Wallet connection rejected by user.");
      } else {
        setErrorMessage(
          `Failed to connect wallet: ${
            error.message || "An unknown error occurred."
          }`
        );
      }
    }
  };

  const handlePaymentAndInvest = async () => {
    setErrorMessage(""); // Clear previous errors
    const amount = parseFloat(investmentAmount);

    if (isNaN(amount) || amount < MIN_INVESTMENT_USD) {
      setErrorMessage(
        `Investment amount must be at least $${MIN_INVESTMENT_USD}.`
      );
      return;
    }

    if (!isWalletConnected || !window.ethereum) {
      setErrorMessage(
        "Wallet not connected. Please connect your wallet first."
      );
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Convert USD amount to Ether (approximate for demo purposes).
      // In a real app, you'd likely fetch current ETH price or use stablecoins.
      const valueInWei = ethers.parseEther((amount / 2000).toString()); // Assuming 1 ETH = $2000 for demo

      const tx = {
        to: TARGET_WALLET_ADDRESS,
        value: valueInWei,
      };

      console.log("Attempting to send transaction:", tx);
      const transactionResponse = await signer.sendTransaction(tx);
      console.log("Transaction sent, waiting for confirmation...");
      console.log("Transaction Hash:", transactionResponse.hash);

      await transactionResponse.wait(); // Wait for transaction to be mined
      console.log("Transaction confirmed!");
      console.log("Payment Data:", {
        from: await signer.getAddress(),
        to: TARGET_WALLET_ADDRESS,
        amountUSD: amount,
        amountWei: valueInWei.toString(),
        transactionHash: transactionResponse.hash,
      });

      setDialogOpen(false); // Close dialog on success
      setErrorMessage("Payment successful! Details logged to console."); // Provide success feedback in UI
      resetDialogState();
    } catch (error) {
      console.error("Error during payment:", error);
      if (error.code === "ACTION_REJECTED") {
        // Specific to MetaMask user rejection
        setErrorMessage("Transaction rejected by user.");
      } else if (error.message.includes("insufficient funds")) {
        setErrorMessage("Insufficient funds for transaction.");
      } else {
        setErrorMessage(
          `Payment failed: ${error.message || "An unknown error occurred."}`
        );
      }
    }
  };

  const handleOpenChange = (open) => {
    setDialogOpen(open);
    if (!open) {
      resetDialogState(); // Reset state when dialog closes
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 font-sans antialiased">
      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger onClick={() => setDialogOpen(true)}>
          <Button className="px-8 py-4 rounded-xl text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 transform hover:scale-105">
            {isWalletConnected ? "Invest Now" : "Connect Wallet and Invest Now"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-800">
              {isWalletConnected ? "Invest in Crypto" : "Connect Your Wallet"}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 mt-2">
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
            <p className="text-red-600 text-sm mt-4 p-2 bg-red-50 rounded-md border border-red-200 text-center">
              {errorMessage}
            </p>
          )}

          {isWalletConnected ? (
            <div className="grid gap-6 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right sm:text-left">
                  Amount (USD)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder={`Minimum $${MIN_INVESTMENT_USD}`}
                  className="col-span-full sm:col-span-3"
                  min={MIN_INVESTMENT_USD}
                  step="0.01"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 py-6 text-lg font-medium border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition duration-200 shadow-md rounded-lg"
                onClick={() => connectWallet("MetaMask")}
              >
                <MetaMaskIcon /> Connect MetaMask
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 py-6 text-lg font-medium border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition duration-200 shadow-md rounded-lg"
                onClick={() => connectWallet("SafePal")}
              >
                <SafePalIcon /> Connect SafePal
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 py-6 text-lg font-medium border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition duration-200 shadow-md rounded-lg"
                onClick={() => connectWallet("WalletConnect")}
              >
                <WalletConnectIcon /> Connect WalletConnect
              </Button>
              <p className="text-sm text-gray-500 text-center mt-4">
                Please ensure you have the respective wallet extension or app
                installed.
              </p>
            </div>
          )}

          <DialogFooter>
            {isWalletConnected ? (
              <>
                <Button
                  type="submit"
                  onClick={handlePaymentAndInvest}
                  className="bg-green-600 text-white hover:bg-green-700 py-3 px-6 rounded-lg font-semibold shadow-md transition duration-200"
                >
                  Pay and Invest
                </Button>
                <Button
                  onClick={() => {
                    setIsWalletConnected(false);
                    setWalletAddress("");
                    localStorage.removeItem("isWalletConnected");
                    localStorage.removeItem("walletAddress");
                    resetDialogState();
                    console.log("Wallet disconnected.");
                  }}
                  variant="destructive" // Using destructive variant for disconnect
                  className="py-3 px-6 rounded-lg font-semibold shadow-md transition duration-200"
                >
                  Disconnect Wallet
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setDialogOpen(false)}
                variant="outline"
                className="py-3 px-6 rounded-lg font-semibold border-2 border-gray-200 hover:border-gray-300 transition duration-200"
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default InvestDialog;
