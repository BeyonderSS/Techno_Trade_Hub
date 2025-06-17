import {
  Users,
  LayoutGrid,
  Wallet,
  Bot,
  UserPlus,
  TrendingUp,
  DollarSign,
  ArrowDownCircle,
  User,
  CircleDollarSign,
  Network, // Added for Wallet History
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
          href: "/dashboard/user/reports/referral-income",
        },
        {
          label: "Salary Income",
          icon: DollarSign,
          href: "/dashboard/user/reports/salary-income",
        },
        {
          label: "Team Performance",
          icon: UserPlus,
          href: "/dashboard/user/reports/team-performance",
        },
        {
          label: "Level Income",
          icon: UserPlus,
          href: "/dashboard/user/reports/level-income", // Updated path for consistency
        },
        {
          label: "Weekly Bonus",
          icon: UserPlus,
          href: "/dashboard/user/reports/weekly-bonus", // Updated path for consistency
        },
        {
          label: "Trade history",
          icon: TrendingUp,
          href: "/dashboard/user/reports/trade-history", // Updated path for consistency
        },
      ],
    },
  ],

  admin: [
    {
      label: "Users",
      icon: User,
      href: "/dashboard/admin/users"
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
          href: "/dashboard/admin/reports/referral-income",
        },
        {
          label: "Salary Income",
          icon: CircleDollarSign,
          href: "/dashboard/admin/reports/salary-income",
        },
        {
          label: "Team Performance",
          icon: UserPlus,
          href: "/dashboard/admin/reports/team-performance",
        },
        {
          label: "Level Income",
          icon: Network ,
          href: "/dashboard/admin/reports/level-income", // Updated path for consistency
        },
        {
          label: "Weekly Bonus",
          icon: UserPlus,
          href: "/dashboard/admin/reports/weekly-bonus", // Updated path for consistency
        },
        
      ],
    },

  ],
};