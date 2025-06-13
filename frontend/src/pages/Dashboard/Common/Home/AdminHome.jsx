import { Copy } from "lucide-react";
import { useState, useEffect } from "react"; // Import useEffect
import image from "../../../../assets/cardImg.png"
import { frontEndUrl } from "../../../../constants/config";
import { getUserHomeApi } from "../../../../api/users.api";

// Dummy component for Button5 (replace with your actual Button5 if it's a styled component)
const Button5 = ({ onClick, name }) => (
  <button
    onClick={onClick}
    className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
  >
    {name}
  </button>
);

// SSDataTable component adapted to display direct referral history from the API
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
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              Joining Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              Investment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              Total Payout
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((row, index) => (
            <tr key={index}> {/* Using index as key, consider unique ID if available from backend */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {row.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {row.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {row.phone}
              </td>
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

const AdminHome = () => {
  const [userData, setUserData] = useState(null); // State to store fetched user data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage error messages
  const [copiedText1, setCopiedText1] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const data = await getUserHomeApi();
        setUserData(data.data); // Assuming API returns { success: true, message: ..., data: { ... } }
      } catch (err) {
        console.error("Failed to fetch user home data:", err);
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false); // Set loading to false after fetch attempt
      }
    };

    fetchHomeData();
  }, []); // Empty dependency array ensures this runs once on mount

  const location = frontEndUrl; // Dummy origin, using a constant
  const referCode = `${location}/register?referralCode=${userData?.referralCode}`;

  const formatDate = (dateString) => {
    if (!dateString) return "NA";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const aboutMeData = {
    username: userData?.name || "N/A", // Use 'name' from backend
    date_of_joining: formatDate(userData?.dateOfJoining),
    date_of_activation: userData?.activeDate ? formatDate(userData?.activeDate) : "NA",
    renewal_status: userData?.totalInvestment && userData.totalInvestment > 0 ? "Active" : "Inactive", // Assuming active if there's investment
  };

  const handleCopy = (text, setCopiedState) => {
    // Using `document.execCommand('copy')` as `navigator.clipboard.writeText()` might not work in some environments (like iframes)
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
      console.log(`Copied: ${text}`);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Optionally provide user feedback that copying failed
    }
    document.body.removeChild(textarea);
  };

  const IncomeCard = ({ title, value, img, showDollar = true }) => (
    <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out border border-white/90">
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

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-black/50 min-h-screen text-gray-100 flex justify-center items-center">
        <div className="text-white text-lg">Loading user data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-black/50 min-h-screen text-gray-100 flex justify-center items-center">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-4 sm:p-6 bg-black/50 min-h-screen text-gray-100 flex justify-center items-center">
        <div className="text-gray-400 text-lg">No user data available.</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-black/50 min-h-screen text-gray-100">
      {/* Welcome Card */}
      <div className="mb-6">
        <div className="bg-black/50 rounded-lg shadow-md p-6 border border-white/90 relative overflow-hidden">
          <div className="mb-4">
            <h5 className="text-2xl font-bold text-white">
              Welcome{" "}
              <span className="capitalize text-blue-400">
                {userData?.name || "User"}
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
        <IncomeCard
          title="Total Income"
          value={userData?.totalIncome?.toFixed(2) || "0"}
          img="https://img.icons8.com/3d-fluency/94/cash-in-hand.png"
        />
        <IncomeCard
          title="Wallet Balance"
          value={userData?.walletBalance?.toFixed(2) || "0"}
          img="https://img.icons8.com/3d-fluency/94/coin-wallet.png"
        />
        <IncomeCard
          title="Total Investment"
          value={userData?.totalInvestment?.toFixed(2) || "0"}
          img="https://img.icons8.com/3d-fluency/94/growing-money.png"
        />
        <IncomeCard
          title="Referral Income"
          value={userData?.totalReferralIncome?.toFixed(2) || "0"}
          img="https://img.icons8.com/3d-fluency/94/expensive-price.png"
        />
        <IncomeCard
          title="Trade Income"
          value={userData?.tradeIncome?.toFixed(2) || "0"}
          img="https://img.icons8.com/3d-fluency/94/business-management.png"
        />
        <IncomeCard
          title="Level Income"
          value={userData?.levelIncome?.toFixed(2) || "0"}
          img="https://img.icons8.com/isometric/50/no-connection.png"
        />
        <IncomeCard
          title="Referral Member"
          value={userData?.referralMemberCount || "0"}
          img="https://img.icons8.com/isometric/50/user.png"
          showDollar={false}
        />
        <IncomeCard
          title="Current Weekly Reward"
          value={userData?.totalWeeklyReward?.toFixed(2) || "0"}
          img="https://img.icons8.com/3d-fluency/94/money-transfer.png"
        />
        <IncomeCard
          title="Total Monthly Salary"
          value={userData?.totalMonthlySalary?.toFixed(2) || "0"}
          img="https://img.icons8.com/3d-fluency/94/money-transfer.png"
        />
        <IncomeCard
          title="Total Payouts"
          value={userData?.totalPayout?.toFixed(2) || "0"}
          img="https://img.icons8.com/3d-fluency/94/money-mouth-face-1.png"
        />
      </div>

      {/* About Me & Referral Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-black/50 rounded-lg shadow-md p-6 border border-white/90">
          <h5 className="text-xl font-bold text-white mb-4">About Me</h5>
          <div className="overflow-x-auto">
            <table className="min-w-full text-gray-200">
              <tbody>
                {Object.entries(aboutMeData).map(([key, value]) => (
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

        <div className="bg-black/50 rounded-lg shadow-md p-6 flex flex-col justify-between border border-white/90">
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
      <div className="bg-black/50 rounded-lg shadow-md p-6 border border-white/90">
        <h5 className="text-xl font-bold text-white mb-4">
          Direct Referral History
        </h5>
        <SSDataTable data={userData?.directReferralHistory} />
      </div>
    </div>
  );
};

export default AdminHome;
