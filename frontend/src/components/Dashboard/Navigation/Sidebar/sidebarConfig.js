import {
  Users,
  LayoutGrid,
  Wallet,
  Bot,
  UserPlus,
  TrendingUp,
  DollarSign,
  ArrowDownCircle,
  User, // Added for Wallet History
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
      href: "/dashboard/ai-trade-engine",

    },
    {
      label: "Withdraw",
      icon: ArrowDownCircle,
      href: "/dashbaord/withdraw", // Updated path for consistency

    },
    {
      label: "Report",
      icon: Users,
      items: [
        {
          label: "Referral Income",
          icon: Users,
          href: "/dashbaord/reports/referral",
        },
        {
          label: "Salary Income",
          icon: DollarSign,
          href: "/dashbaord/reports/salary-income",
        },
        {
          label: "Team Performance",
          icon: UserPlus,
          href: "/dashbaord/reports/team-performance",
        },
        {
          label: "Level Income",
          icon: UserPlus,
          href: "/dashbaord/reports/level-income", // Updated path for consistency
        },
        {
          label: "Weekly Bonus",
          icon: UserPlus,
          href: "/dashbaord/reports/weekly-bonus", // Updated path for consistency
        },
        {
          label: "Trade history",
          icon: TrendingUp,
          href: "/dashbaord/reports/trade-history", // Updated path for consistency
        },
      ],
    },
  ],

  admin: [
    {
      label: "Users",
      icon: User,
      href: "/dashboard/users"
    }
    ,
    {
      label: "Withdraw",
      icon: ArrowDownCircle,
      href: "/dashbaord/withdraw", // Updated path for consistency

    },
    {
      label: "Report",
      icon: Users,
      items: [
        {
          label: "Referral Income",
          icon: Users,
          href: "/dashbaord/reports/referral",
        },
        {
          label: "Salary Income",
          icon: DollarSign,
          href: "/dashbaord/reports/salary-income",
        },
        {
          label: "Team Performance",
          icon: UserPlus,
          href: "/dashbaord/reports/team-performance",
        },
        {
          label: "Level Income",
          icon: UserPlus,
          href: "/dashbaord/reports/level-income", // Updated path for consistency
        },
        {
          label: "Weekly Bonus",
          icon: UserPlus,
          href: "/dashbaord/reports/weekly-bonus", // Updated path for consistency
        },
        {
          label: "Trade history",
          icon: TrendingUp,
          href: "/dashbaord/reports/trade-history", // Updated path for consistency
        },
      ],
    },

  ],
};