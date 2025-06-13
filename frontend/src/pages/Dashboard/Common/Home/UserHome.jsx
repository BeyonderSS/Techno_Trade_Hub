/* eslint-disable react/no-unescaped-entities */
import { Copy } from "lucide-react";
import { useState } from "react";
import image from "../../../../assets/cardImg.png"
// Dummy component for Button5 (replace with your actual Button5 if it's a styled component)
const Button5 = ({ onClick, name }) => (
  <button
    onClick={onClick}
    className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
  >
    {name}
  </button>
);

// Dummy SSDataTable component for demonstration
const SSDataTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 bg-black/50 rounded-lg shadow-sm text-gray-400 text-center border border-white/90"> {/* Added border here */}
        No direct referral history found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-sm border border-white/90"> {/* Added border here */}
      <table className="min-w-full bg-black/50 text-gray-200">
        <thead className="bg-black/50 border-b border-gray-600">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((row) => (
            <tr key={row.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {row.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {row.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {row.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === "Active"
                    ? "bg-green-700 text-green-100"
                    : "bg-red-700 text-red-100"
                    }`}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UserHome = () => {
  // Dummy user data
  const dummyUser = {
    username: "DemoUser123",
    createdAt: "2023-01-15T10:00:00Z",
    activeDate: "2023-01-20T12:00:00Z",
    status: true,
    referralCode: "DEMOABC123",
    totalEarnings: 1500.75,
    currentEarnings: 350.20,
    totalInvestment: 1000.00,
    directReferalAmount: 250.50,
    dailyRoi: 75.30,
    levelIncome: 120.00,
    referedUsers: [
      { id: 1, username: "ReferralOne", date: "2023-02-01", status: "Active" },
      { id: 2, username: "ReferralTwo", date: "2023-02-10", status: "Inactive" },
      { id: 3, username: "ReferralThree", date: "2023-02-15", status: "Active" },
      { id: 4, username: "ReferralFour", date: "2023-03-01", status: "Active" },
      { id: 5, username: "ReferralFive", date: "2023-03-05", status: "Inactive" },
    ],
    monthlyRewards: 50.00,
    totalMonthlyRewards: 150.00,
    teamRewards: 200.00,
    totalTeamRewards: 400.00,
    totalPayouts: 700.50,
  };

  const [copiedText1, setCopiedText1] = useState(false);

  const user = dummyUser;

  const location = "http://localhost:3000"; // Dummy origin
  const referCode = `${location}/register?referral=${user?.referralCode}`;

  const formatDate = (dateString) => {
    if (!dateString) return "NA";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const userData = {
    username: user?.username,
    date_of_joining: formatDate(user?.createdAt) || "NA",
    date_of_activation: user?.activeDate ? formatDate(user?.activeDate) : "NA",
    renewal_status: user?.status ? "Active" : "Inactive",
  };

  const handleCopy = (text, setCopiedState) => {
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
    console.log(`Simulated copy: ${text}`);
  };

  const IncomeCard = ({ title, value, img, showDollar = true }) => (
    <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out border border-white/90"> {/* Added border here */}
      <div className="flex flex-col">
        <h5 className="text-gray-400 text-sm font-medium">{title}</h5>
        <p className="text-xl font-bold text-white mt-1">
          {showDollar ? `$${value}` : value}
        </p>
      </div>
      <div className="flex-shrink-0">
        <img src={img} alt={title} className="w-12 h-12 object-contain" />
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 bg-black/50 min-h-screen text-gray-100">
      {/* Welcome Card */}   
      <div className="mb-6">
  <div className="bg-black/50 rounded-lg shadow-md p-6 border border-white/90 relative overflow-hidden">
    <div className="mb-4">
      <h5 className="text-2xl font-bold text-white">
        Welcome{" "}
        <span className="capitalize text-blue-400">
          {user?.username || "User"}
        </span>
        !
      </h5>
    </div>
    <p className="text-gray-300 text-lg mb-4">
      We're happy to have you on board.
    </p>
    <div className="flex flex-col items-start justify-between gap-4">
      <div className="flex-grow w-full pr-16 sm:pr-20 md:pr-24 lg:pr-32">
        <span className="text-lg font-semibold text-gray-200 block mb-1">
          Ready to get started?
        </span>
        <p className="text-gray-300">Check out your dashboard to begin!</p>
        <div className="mt-4">
          <Button5
            onClick={() => console.log("Navigating to Buy Plan")}
            name={"Buy Plan"}
          />
        </div>
      </div>
      
      {/* Responsive Image Container */}
      <div className="flex-shrink-0 hidden sm:block lg:w-auto">
        <img
          src={image}
          alt="welcome image"
          className="
            w-32 h-32 sm:w-40 sm:h-40 md:w-68 md:h-48 lg:w-56 lg:h-56 xl:w-74 xl:h-74
            object-contain
            animate-bounce-slow
            transition-all duration-200 ease-in-out
            hover:scale-105
            absolute right-6 top-7 lg:right-8 lg:-top-5
          "
        />
      </div>
    </div>
  </div>
</div>

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
  
  @media (max-width: 1023px) {
    .animate-bounce-slow {
      animation: bounce-slow 2.5s ease-in-out infinite;
    }
  }
  
  @media (max-width: 767px) {
    .animate-bounce-slow {
      animation: bounce-slow 2s ease-in-out infinite;
    }
  }
`}</style>

      {/* Income Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {/* IncomeCard component already has the border added inside its definition */}
        <IncomeCard
          title="Total Income"
          value={user?.totalEarnings?.toFixed(2) || "0"}
          img="https://img.icons8.com/3d-fluency/94/cash-in-hand.png"
        />
        <IncomeCard
          title="Wallet Balance"
          value={user?.currentEarnings?.toFixed(2) || "0"}
          img="https://img.icons8.com/3d-fluency/94/coin-wallet.png"
        />
        <IncomeCard
          title="Total Investment"
          value={user?.totalInvestment?.toFixed(2) || "0"}
          img="https://img.icons8.com/3d-fluency/94/growing-money.png"
        />
        <IncomeCard
          title="Referral Income"
          value={user?.directReferalAmount?.toFixed(2) || "0"}
          img="https://img.icons8.com/3d-fluency/94/expensive-price.png"
        />
        <IncomeCard
          title="Trade Income"
          value={user?.dailyRoi?.toFixed(2) || "0"}
          img="https://img.icons8.com/3d-fluency/94/business-management.png"
        />
        <IncomeCard
          title="Level Income"
          value={user?.levelIncome?.toFixed(2) || "0"}
          img="https://img.icons8.com/isometric/50/no-connection.png"
        />
        <IncomeCard
          title="Referral Member"
          value={user?.referedUsers?.length || "0"}
          img="https://img.icons8.com/isometric/50/user.png"
          showDollar={false}
        />
        <IncomeCard
          title="Current Monthly Salary"
          value={user?.monthlyRewards.toFixed(2) || "0"}
          img="https://img.icons8.com/3d-fluency/94/money-transfer.png"
        />
        <IncomeCard
          title="Total Monthly Salary"
          value={user?.totalMonthlyRewards.toFixed(2) || "0"}
          img="https://img.icons8.com/3d-fluency/94/money-transfer.png"
        />
        <IncomeCard
          title="One Time Team Reward"
          value={user?.teamRewards.toFixed(2) || "0"}
          img="https://img.icons8.com/3d-fluency/94/conference.png"
        />
        <IncomeCard
          title="Total Team Reward"
          value={user?.totalTeamRewards.toFixed(2) || "0"}
          img="https://img.icons8.com/3d-fluency/94/conference.png"
        />
        <IncomeCard
          title="Total Payouts"
          value={user?.totalPayouts?.toFixed(2) || "0"}
          img="https://img.icons8.com/3d-fluency/94/money-mouth-face-1.png"
        />
      </div>

      {/* About Me & Referral Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-black/50 rounded-lg shadow-md p-6 border border-white/90"> {/* Added border here */}
          <h5 className="text-xl font-bold text-white mb-4">About Me</h5>
          <div className="overflow-x-auto">
            <table className="min-w-full text-gray-200">
              <tbody>
                {Object.entries(userData).map(([key, value]) => (
                  <tr key={`detail-${key}`} className="border-b border-gray-700 last:border-b-0">
                    <td className="py-2 pr-4 font-medium capitalize">
                      {key.replaceAll("_", " ")}:
                    </td>
                    <td className="py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-black/50 rounded-lg shadow-md p-6 flex flex-col justify-between border border-white/90"> {/* Added border here */}
          <div>
            <p className="text-lg font-semibold text-gray-300 mb-2">Your Refer Code</p>
            <div className="flex items-center bg-black/50 rounded-md p-3 border border-gray-600">
              <span className="flex-grow text-gray-100 font-mono text-sm break-all">
                {referCode}
              </span>
              <button
                onClick={() => handleCopy(referCode, setCopiedText1)}
                className="ml-3 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                title={copiedText1 ? "Copied!" : "Copy to clipboard"}
              >
                {copiedText1 ? (
                  <span className="text-xs">Copied!</span>
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Referral History */}
      <div className="bg-black/50 rounded-lg shadow-md p-6 border border-white/90"> {/* Added border here */}
        <h5 className="text-xl font-bold text-white mb-4">
          Direct Referral History
        </h5>
        <SSDataTable data={user?.referedUsers} />
      </div>
    </div>
  );
};

export default UserHome;