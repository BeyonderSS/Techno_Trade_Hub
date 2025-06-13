import {
  Users,
  LayoutGrid,
  Wallet,
  Bot,
  UserPlus,
  TrendingUp,
  DollarSign,
  ArrowDownCircle, // Added for Wallet History
} from "lucide-react";

export const sidebarConfig = {
  shared: [
    {
      label: "Dashboard",
      icon: LayoutGrid,
      href: "/dashboard", // Added href for dashboard
    },
  ],

  user: [

    {
      label: "AI bot",
      icon: Bot,
      href: "/user/aibot/aitradebot",

    },


    {
      label: "Invest",
      icon: TrendingUp,
      href: "/user/wallet/deposit", // Updated path for consistency

    },
    {
      label: "Withdraw",
      icon: ArrowDownCircle,
      href: "/user/wallet/withdraw", // Updated path for consistency

    },
    {
      label: "Report",
      icon: Users,
      items: [
        {
          label: "Referral Income",
          icon: Users,
          href: "/user/income-reports/referral",
        },
        {
          label: "Salary Income",
          icon: DollarSign,
          href: "/user/income-reports/salary-income",
        },
        {
          label: "Team Performance",
          icon: UserPlus,
          href: "/user/income-reports/team-performance",
        },
        {
          label: "Level Income",
          icon: UserPlus,
          href: "/user/income-reports/level-income", // Updated path for consistency
        },
        {
          label: "Weekly Bonus",
          icon: UserPlus,
          href: "/user/income-reports/weekly-bonus", // Updated path for consistency
        },
        {
          label: "Trade history",
          icon: TrendingUp,
          href: "/user/network/trase-history", // Updated path for consistency
        },
      ],
    },




  ],

  admin: [

  ],
};