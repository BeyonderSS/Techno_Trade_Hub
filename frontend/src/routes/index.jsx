import DashboardLayout from "../layout/DashboardLayout";
import MainLayout from "../layout/MainLayout";
import Home from "../pages"; // Assuming this is your public home page
import DashboardHome from "../pages/Dashboard/Common/Home"; // Renamed from Dashboard/Common/Home to User/Dashboard
import ReferralIncomeReports from "../pages/Dashboard/Users/Income_Report/ReferralIncomeReports"; // New import
// import MonthlySalaryReport from "../pages/Dashboard/Users/Income_Report/MonthlySalaryReport";
import AiTradeBot from "../pages/Dashboard/Users/AIbot/AiTradeBot";
import SalaryIncomePage from "../pages/Dashboard/Users/Income_Report/SalaryIncome";
import TeamPerformance from "../pages/Dashboard/Users/Income_Report/TeamPerformance";
import LevelIncomePage from "../pages/Dashboard/Users/Income_Report/LevelIncome";
import WeeklyBonusPage from "../pages/Dashboard/Users/Income_Report/WeeklyBonus";
import TradeHistoryPage from "../pages/Dashboard/Users/Income_Report/TradeHistory";
import Login from "../pages/Auth/Login";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import Register from "../pages/Auth/Register";
import AiTradeEngineHome from "../pages/Dashboard/Users/AIbot";
import WithdrawalsPage from "../pages/Dashboard/Common/Withdrawl";

const routes = [
  {
    path: "/",
    element: (
      <MainLayout>
        <Home />
      </MainLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <MainLayout>
        <Login />
      </MainLayout>
    ),
  },
  {
    path: "/register", // Route for the signup page
    element: (
      <MainLayout>
        <Register />
      </MainLayout>
    ),
  },
  {
    path: "/verify-otp",
    element: (
      <MainLayout>
        <VerifyOtp />
      </MainLayout>
    ),
  },
  {
    // This path can be the base for all user-specific dashboard routes
    // or you can define each dashboard page separately if you prefer.
    // For now, let's keep it simple and point the /dashboard to the user's home dashboard.
    path: "/dashboard",
    element: (
      <DashboardLayout>
        <DashboardHome />
      </DashboardLayout>
    ),
  },
  {
    // This is for the main user dashboard page, matching sidebarConfig path
    path: "/user/dashboard",
    element: (
      <DashboardLayout>
        <DashboardHome />
      </DashboardLayout>
    ),
  },
  {
    // Route for Referral Income Reports
    path: "/user/income-reports/referral",
    element: (
      <DashboardLayout>
        <ReferralIncomeReports />
      </DashboardLayout>
    ),
  },

  {
    path: "/user/income-reports/salary-income",
    element: (
      <DashboardLayout>
        <SalaryIncomePage />
      </DashboardLayout>
    ),
  },
  {
    path: "/user/income-reports/team-performance",
    element: (
      <DashboardLayout>
        <TeamPerformance />
      </DashboardLayout>
    ),
  },
  {
    path: "/user/income-reports/level-income",
    element: (
      <DashboardLayout>
        <LevelIncomePage />
      </DashboardLayout>
    ),
  },
  {
    path: "/user/income-reports/weekly-bonus",
    element: (
      <DashboardLayout>
        <WeeklyBonusPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/user/network/trase-history",
    element: (
      <DashboardLayout>
        <TradeHistoryPage />
      </DashboardLayout>
    ),
  },

  {
    path: "/dashboard/ai-trade-engine",
    element: (
      <DashboardLayout>
        <AiTradeEngineHome />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashbaord/withdraw",
    element: (
      <DashboardLayout>
        <WithdrawalsPage />
      </DashboardLayout>
    ),
  },

  {
    path: "*", // Catch-all route for any undefined paths
    element: <h1>404 - Page Not Found</h1>,
  },
];

export default routes;
