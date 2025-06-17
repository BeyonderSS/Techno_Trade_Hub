// src/pages/UserDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUserDetailsById } from "../../../../api/adminuser"; // 👈 Import the new service

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, Calendar, Hash, Mail, Phone, BarChart2, CheckCircle, XCircle } from "lucide-react";

export default function UserDetails() {
  const { id } = useParams();

  // State for storing user data, loading status, and errors
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("No user ID provided.");
      setLoading(false);
      return;
    }

    const loadUserDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchUserDetailsById(id);
        setUserData(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load user data.");
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserDetails();
  }, [id]); // Re-run the effect if the ID in the URL changes

  // ⚙️ Render states
  if (loading) {
    return <div className="p-6 text-center text-white">Loading user details...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  if (!userData) {
    return <div className="p-6 text-center text-white">User not found.</div>;
  }

  const { user, financialSummary, referralSummary, investments } = userData;

  return (
    <div className="p-6 text-white space-y-6 bg-black min-h-screen">
      <h2 className="text-3xl font-bold">User Details</h2>

      {/* === User Profile Card === */}
      <Card className="bg-black/60 border border-gray-700 shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              {user.name}
              <Badge variant={user.isEmailVerified ? "default" : "destructive"} className={user.isEmailVerified ? "bg-green-600" : "bg-red-600"}>
                {user.isEmailVerified ? <CheckCircle className="w-4 h-4 mr-1"/> : <XCircle className="w-4 h-4 mr-1"/>}
                {user.isEmailVerified ? "Verified" : "Not Verified"}
              </Badge>
            </CardTitle>
            <CardDescription className="text-gray-400 flex items-center gap-2 pt-1">
              <Mail className="w-4 h-4" /> {user.email}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
          <div><p className="text-gray-400 text-sm flex items-center gap-1"><Phone className="w-4 h-4"/> Contact</p><p>{user.contactNumber}</p></div>
          <div><p className="text-gray-400 text-sm flex items-center gap-1"><Calendar className="w-4 h-4"/> Member Since</p><p>{new Date(user.memberSince).toLocaleDateString()}</p></div>
          <div><p className="text-gray-400 text-sm flex items-center gap-1"><Hash className="w-4 h-4"/> Referral Code</p><p className="font-mono">{user.referralCode}</p></div>
          <div><p className="text-gray-400 text-sm flex items-center gap-1"><DollarSign className="w-4 h-4"/> Wallet Balance</p><p className="font-bold text-green-400">${user.walletBalance}</p></div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* === Financial Summary Card === */}
        <Card className="bg-black/60 border border-gray-700">
          <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="text-green-500"/> Financial Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span>Total Principal Invested:</span> <span className="font-bold">${user.totalPrincipalInvested}</span></div>
            <div className="flex justify-between"><span>Total ROI Earned:</span> <span className="font-bold">${financialSummary.totalRoiEarned}</span></div>
            <div className="flex justify-between"><span>Weekly Bonus Received:</span> <span className="font-bold">${financialSummary.totalWeeklyBonusReceived}</span></div>
            <div className="flex justify-between"><span>Monthly Salary Received:</span> <span className="font-bold">${financialSummary.totalMonthlySalaryReceived}</span></div>
          </CardContent>
        </Card>

        {/* === Referral Summary Card === */}
        <Card className="bg-black/60 border border-gray-700">
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="text-purple-400"/> Referral Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
             <div className="flex justify-between"><span>User Level (Max Depth):</span> <span className="font-bold">{referralSummary.userLevel}</span></div>
             <div className="flex justify-between"><span>Direct Referrals:</span> <span className="font-bold">{referralSummary.directReferralsCount}</span></div>
             <div className="flex justify-between"><span>Total Team Size:</span> <span className="font-bold">{referralSummary.teamSize}</span></div>
             <div className="flex justify-between"><span>Referrals Today:</span> <span className="font-bold">{referralSummary.referralsAddedToday}</span></div>
             <div className="flex justify-between"><span>Referrals This Month:</span> <span className="font-bold">{referralSummary.referralsAddedThisMonth}</span></div>
          </CardContent>
        </Card>
      </div>
      
      {/* === Investments List Card === */}
      <Card className="bg-black/60 border border-gray-700">
        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart2 className="text-blue-400"/> User Investments ({investments.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.length > 0 ? investments.map(inv => (
              <div key={inv.id} className="p-3 bg-gray-900/50 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                  <div><p className="text-gray-400 text-sm">Amount</p><p className="font-bold">${inv.amount}</p></div>
                  <div><p className="text-gray-400 text-sm">Status</p><Badge variant={inv.status === 'active' ? 'default' : 'secondary'} className={inv.status === 'active' ? 'bg-green-600' : 'bg-gray-500'}>{inv.status}</Badge></div>
                  <div><p className="text-gray-400 text-sm">Start Date</p><p>{new Date(inv.startDate).toLocaleDateString()}</p></div>
                  <div><p className="text-gray-400 text-sm">ROI Earned</p><p className="font-bold">${inv.totalRoiEarned}</p></div>
              </div>
            )) : <p className="text-gray-400">This user has not made any investments yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}