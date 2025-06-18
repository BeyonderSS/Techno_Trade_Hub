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
import UsersPage from "../pages/Dashboard/Admin/user/Userpage";
import UserDetails from "../pages/Dashboard/Admin/user/UsersDetailsPage";
import AdminLevelIncomePage from "../pages/Dashboard/Admin/reports/AdminLevelIncome";
import AdminMonthlySalaryReport from "../pages/Dashboard/Admin/reports/AdminMonthlySalaryReport";
import AdminTeamPerformancePage from "../pages/Dashboard/Admin/reports/AdminTeamPerformance";
import AdminReferralIncomePage from "../pages/Dashboard/Admin/reports/AdminReferralIncomeReports";
import AdminWeeklyBonusPage from "../pages/Dashboard/Admin/reports/AdminWeeklyBonus";

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
      <Login />
    ),
  },
  {
    path: "/register", // Route for the signup page
    element: (
      <Register />
    ),
  },
  {
    path: "/verify-otp",
    element: (
      
        <VerifyOtp />
      
    ),
  },

  // admin paths
  {
    path: "/dashboard/admin/reports/referral-income",
    element: (
      <DashboardLayout>
        <AdminReferralIncomePage />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashboard/admin/reports/salary-income",
    element: (
      <DashboardLayout>
        <AdminMonthlySalaryReport />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashboard/admin/reports/team-performance",
    element: (
      <DashboardLayout>
        <AdminTeamPerformancePage />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashboard/admin/reports/level-income",
    element: (
      <DashboardLayout>
        <AdminLevelIncomePage />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashboard/admin/reports/weekly-bonus",
    element: (
      <DashboardLayout>
        <AdminWeeklyBonusPage />
      </DashboardLayout>
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
    path: "/dashboard/user/reports/referral-income",
    element: (
      <DashboardLayout>
        <ReferralIncomeReports />
      </DashboardLayout>
    ),
  },

  {
    path: "/dashboard/user/reports/salary-income",
    element: (
      <DashboardLayout>
        <SalaryIncomePage />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashboard/user/reports/team-performance",
    element: (
      <DashboardLayout>
        <TeamPerformance />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashboard/user/reports/level-income",
    element: (
      <DashboardLayout>
        <LevelIncomePage />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashboard/user/reports/weekly-bonus",
    element: (
      <DashboardLayout>
        <WeeklyBonusPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashboard/user/reports/trade-history",
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
    path: "/dashboard/withdraw",
    element: (
      <DashboardLayout>
        <WithdrawalsPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashboard/admin/users",
    element: (
      <DashboardLayout>
        <UsersPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashboard/admin/user/:id",
    element: (
      <DashboardLayout>
        <UserDetails />
      </DashboardLayout>
    ),
  },

  {
    path: "*", // Catch-all route for any undefined paths  path="/dashboard/admin/users/:id"
    element: <h1>404 - Page Not Found</h1>,
  },
];

export default routes;
