"use client";

import { Copy, Users, HandCoins, TrendingUp, Banknote, Wallet, Calendar, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAdminHome } from "../../../../api/admin";
import { frontEndUrl } from "@/constants/config";
import image from "@/assets/cardImg.png"; // Welcome image

const Button5 = ({ onClick, name }) => (
  <button
    onClick={onClick}
    className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
  >
    {name}
  </button>
);

const SSDataTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 bg-black/50 rounded-lg shadow-sm text-gray-400 text-center border border-white/90">
        No direct referral history found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-sm border border-white/90">
      <table className="min-w-full bg-black/50 text-gray-200">
        <thead className="bg-black/50 border-b border-gray-600">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">#</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Joining Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Investment</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Total Payout</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((row, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{row.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{row.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{row.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(row.joiningDate).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">${row.investmentAmount?.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">${row.totalPayout?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const iconMap = {
  "Total Users": <Users className="w-5 h-5 text-yellow-400" />,
  "Total Income": <HandCoins className="w-5 h-5 text-green-400" />,
  "Total Investment": <TrendingUp className="w-5 h-5 text-blue-400" />,
  "Total Payout": <Banknote className="w-5 h-5 text-pink-400" />,
  "Total Weekly Distributed": <Calendar className="w-5 h-5 text-purple-400" />,
  "Total Monthly Distributed": <Wallet className="w-5 h-5 text-cyan-400" />,
  "Total Roi Distributed": <DollarSign className="w-5 h-5 text-emerald-400" />,
};

const IncomeCard = ({ title, value, showDollar = true }) => (
  <div className="flex items-center justify-between p-5 bg-gradient-to-br from-black/70 to-gray-900 border border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition duration-300  min-h-[110px] sm:min-h-[120px] ease-in-out">
    <div className="flex flex-col">
      <h5 className="text-gray-400 text-sm">{title}</h5>
      <p className="text-2xl font-extrabold text-white mt-1 tracking-tight">
        {showDollar ? `$${value}` : value}
      </p>
    </div>
    <div className="flex-shrink-0 rounded-full p-2 bg-gray-800 shadow-inner">
      {iconMap[title]}
    </div>
  </div>
);

const AdminHome = () => {
  const [adminData, setAdminData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetchAdminHome();
        console.log(response.dashboardData, "frontend res");
        setAdminData(response?.admin);
        setDashboardData(response?.dashboardData);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="text-white text-center p-6">Loading...</div>;
  }

  const referCode = `${adminData?.referralCode}`;

  return (
    <div className="p-4 sm:p-6 bg-black/50 min-h-screen text-gray-100">
      {/* Welcome Section */}
      <div className="mb-6">
        <div className="bg-black/50 rounded-lg shadow-md p-6  relative overflow-hidden">
          <h5 className="text-2xl font-bold text-white">
            Welcome{" "}
            <span className="capitalize text-blue-400">
              {adminData?.name || "Admin"}
            </span>
            !
          </h5>
          <p className="text-gray-300 text-lg mb-4">
            Monitor overall platform activity below.
          </p>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {/* <Button5 onClick={() => console.log("Admin clicked action")} name="Take Action" /> */}
            <div className="flex-shrink-0 hidden lg:block">
              <img
                src={image}
                alt="Welcome Image"
                className="w-40 h-40 object-contain absolute right-20 -top-3  animate-bounce-slow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6 h-auto">
        <IncomeCard title="Total Users" value={dashboardData?.totalUsers || 0} showDollar={false} />
        <IncomeCard title="Total Income" value={dashboardData?.totalIncome || 0} />
        <IncomeCard title="Total Investment" value={dashboardData?.totalInvestment || 0} />
        <IncomeCard title="Total Payout" value={dashboardData?.totalPayout || 0} />
        <IncomeCard title="Total Weekly Distributed" value={dashboardData?.totalWeeklyDistributed || 0} />
        <IncomeCard title="Total Monthly Distributed" value={dashboardData?.totalMonthlySalaryDistributed || 0} />
        <IncomeCard title="Total Roi Distributed" value={dashboardData?.totalRoiDistributed || 0} />
      </div>

      {/* Referral Code */}
      <div className="bg-black/50 rounded-lg shadow-md p-6 mb-6 border border-white/90">
        <p className="text-lg font-semibold text-gray-300 mb-2">Admin Referral Code</p>
        <div className="flex items-center bg-black/50 rounded-md p-3 border border-gray-600">
          <span className="flex-grow text-gray-100 font-mono text-sm break-all">{referCode}</span>
          <button
            onClick={() => handleCopy(referCode)}
            className="ml-3 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {copied ? <span className="text-xs">Copied!</span> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Bounce animation */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 20%, 53%, 80%, 100% {
            transform: translateY(0px);
          }
          40% {
            transform: translateY(-15px);
          }
          70% {
            transform: translateY(-7px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminHome