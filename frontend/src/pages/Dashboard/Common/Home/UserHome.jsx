import {
  BadgeDollarSign,
  Coins,
  Copy,
  CreditCard,
  DollarSign,
  Gift,
  HandCoins,
  PiggyBank,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useState, useEffect } from "react";
import image from "../../../../assets/cardImg.png";
import { frontEndUrl } from "../../../../constants/config";
import { getUserHomeApi } from "../../../../api/users.api";

// Dummy component for Button5
const Button5 = ({ onClick, name }) => (
  <button
    onClick={onClick}
    className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
  >
    {name}
  </button>
);

// SSDataTable component
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
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {new Date(row.joiningDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                ${row.investmentAmount?.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                ${row.totalPayout?.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Component
const UserHome = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedText1, setCopiedText1] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const data = await getUserHomeApi();
        setUserData(data.data);
      } catch (err) {
        console.error("Failed to fetch user home data:", err);
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const location = frontEndUrl;
  const referCode = `${location}/register?referralCode=${userData?.referralCode}`;

  const formatDate = (dateString) => {
    if (!dateString) return "NA";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const aboutMeData = {
    username: userData?.name || "N/A",
    date_of_joining: formatDate(userData?.dateOfJoining),
    date_of_activation: userData?.activeDate ? formatDate(userData?.activeDate) : "NA",
    renewal_status: userData?.totalInvestment && userData.totalInvestment > 0 ? "Active" : "Inactive",
  };

  const handleCopy = (text, setCopiedState) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
    document.body.removeChild(textarea);
  };

  // ✅ Neon Card
  const IncomeCard = ({ title, value, icon: Icon, showDollar = true }) => (
    <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-xl shadow-md border border-[#00f2ff]/30 hover:shadow-[0_0_15px_#00f2ff] transition-all duration-300 group min-h-[120px] sm:min-h-[120px]">
      <div className="flex flex-col">
        <h5 className="text-gray-400 text-sm font-medium">{title}</h5>
        <p className="text-2xl font-extrabold text-white mt-1">
          {showDollar ? `$${value}` : value}
        </p>
      </div>
      <div className="flex-shrink-0 bg-[#00f2ff]/10 p-3 rounded-full border border-[#00f2ff]/40 group-hover:scale-110 transition-transform duration-300">
        <Icon className="text-[#00f2ff] w-5 h-5" />
      </div>
    </div>
  );


  if (loading || !userData)
    return (
      <div className="p-4 sm:p-6 bg-black/50 min-h-screen text-gray-100 flex justify-center items-center">
        <div className="text-white text-lg">
          {loading ? "Loading user data..." : "No user data available."}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-4 sm:p-6 bg-black/50 min-h-screen text-gray-100 flex justify-center items-center">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 bg-black/50 min-h-screen text-gray-100">
      {/* Welcome Card */}
      <div className="mb-6">
        <div className="bg-black/50 rounded-lg shadow-md p-6 border border-white/90 relative overflow-hidden">
          <h5 className="text-2xl font-bold text-white mb-2">
            Welcome{" "}
            <span className="capitalize text-blue-400">{userData?.name || "User"}</span>!
          </h5>
          <p className="text-gray-300 text-lg mb-4">We're happy to have you on board.</p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-lg font-semibold text-gray-200 block mb-1">
                Ready to get started?
              </span>
              <p className="text-gray-300">Check out your dashboard to begin!</p>
              <div className="mt-4">
                <Button5 onClick={() => console.log("Buy Plan")} name={"Buy Plan"} />
              </div>
            </div>
            <div className="flex-shrink-0 hidden lg:block">
              <img
                src={image}
                alt="welcome"
                className="w-70 h-50 object-contain animate-bounce-slow absolute right-6 top-2"
              />
            </div>

          </div>
        </div>
      </div>

      {/* Bounce Keyframe */}
      <style jsx>{`
  @keyframes bounce-slow {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-15px);
    }
    60% {
      transform: translateY(-7px);
    }
  }

  .animate-bounce-slow {
    animation: bounce-slow 2.5s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    .animate-bounce-slow {
      animation-duration: 2s;
    }
  }

  @media (max-width: 480px) {
    .animate-bounce-slow {
      animation-duration: 1.6s;
    }
  }
`}</style>

      {/* Income Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        <IncomeCard title="Total Income" value={userData?.totalIncome?.toFixed(2) || "0"} icon={DollarSign} />
        <IncomeCard title="Wallet Balance" value={userData?.walletBalance?.toFixed(2) || "0"} icon={Wallet} />
        <IncomeCard title="Total Investment" value={userData?.totalInvestment?.toFixed(2) || "0"} icon={PiggyBank} />
        <IncomeCard title="Referral Income" value={userData?.totalReferralIncome?.toFixed(2) || "0"} icon={Gift} />
        <IncomeCard title="Trade Income" value={userData?.tradeIncome?.toFixed(2) || "0"} icon={TrendingUp} />
        <IncomeCard title="Level Income" value={userData?.levelIncome?.toFixed(2) || "0"} icon={BadgeDollarSign} />
        <IncomeCard title="Referral Member" value={userData?.referralMemberCount || "0"} icon={Users} showDollar={false} />
        <IncomeCard title="Current Weekly Reward" value={userData?.totalWeeklyReward?.toFixed(2) || "0"} icon={HandCoins} />
        <IncomeCard title="Total Monthly Salary" value={userData?.totalMonthlySalary?.toFixed(2) || "0"} icon={CreditCard} />
        <IncomeCard title="Total Payouts" value={userData?.totalPayout?.toFixed(2) || "0"} icon={Coins} />
      </div>

      {/* About Me & Refer Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-black/50 rounded-lg shadow-md p-6 border border-white/90">
          <h5 className="text-xl font-bold text-white mb-4">About Me</h5>
          <table className="min-w-full text-gray-200">
            <tbody>
              {Object.entries(aboutMeData).map(([key, value]) => (
                <tr key={`detail-${key}`} className="border-b border-gray-700 last:border-b-0">
                  <td className="py-2 pr-4 font-medium capitalize">{key.replaceAll("_", " ")}:</td>
                  <td className="py-2">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-black/50 rounded-lg shadow-md p-6 flex flex-col justify-between border border-white/90">
          <div>
            <p className="text-lg font-semibold text-gray-300 mb-2">Your Refer Code</p>
            <div className="flex items-center bg-black/50 rounded-md p-3 border border-gray-600">
              <span className="flex-grow text-gray-100 font-mono text-sm break-all">{referCode}</span>
              <button
                onClick={() => handleCopy(referCode, setCopiedText1)}
                className="ml-3 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                title={copiedText1 ? "Copied!" : "Copy to clipboard"}
              >
                {copiedText1 ? <span className="text-xs">Copied!</span> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Referral History */}
      <div className="bg-black/50 rounded-lg shadow-md p-6 border border-white/90">
        <h5 className="text-xl font-bold text-white mb-4">Direct Referral History</h5>
        <SSDataTable data={userData?.directReferralHistory} />
      </div>
    </div>
  );
};

export default UserHome;
