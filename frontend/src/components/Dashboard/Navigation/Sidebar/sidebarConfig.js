import {
  Users,
  UserCheck,
  LayoutGrid,
  PackageSearch, // This icon might be replaced later if needed for other income types
  Wallet,
  CreditCard,
  Bot,
  BarChart2,
  UserPlus,
  Layers3, // Corrected for Level Income
  BadgeDollarSign,
  LifeBuoy,
  MessageCircleQuestion,
  FileText,
  ShieldCheck,
  BarChart3,
  Gift,
  Settings,
  ShoppingCart,
  Ticket,
  History,
  TrendingUp,
  DollarSign, // Added for Wallet History
} from "lucide-react";

export const sidebarConfig = {
  shared: [
    {
      label: "Dashboard",
      icon: LayoutGrid,
      href: "/user/dashboard", // Added href for dashboard
    },
  ],

  user: [

    {
      label: "Report",
      icon: Users,
      items: [
        {
          label: "Referral Income",
          icon: Users ,
          href: "/user/income-reports/referral",
        },
        {
          label: "Salary Income",
          icon: DollarSign ,
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
          icon: TrendingUp ,
          href: "/user/network/trase-history", // Updated path for consistency
        },
      ],
    },


    {
      label: "Network",
      icon: Users,
      items: [
        {
          label: "Referral Income",
          icon: ShieldCheck,
          href: "/user/income-reports/referral",
        },
        {
          label: "Referrals",
          icon: UserPlus,
          href: "/user/network/referrals", // Updated path for consistency
        },
      ],
    },

    {
      label: "Income",
      icon: BarChart3,
      items: [
        {
          label: "Level Income",
          href: "/user/income-reports/level", // Corrected path for Level Income
          icon: Layers3, // Used Layers3 as you imported it for levels
        },
        {
          label: "Rewards",
          href: "/user/income-reports/rewards", // Updated path for consistency
          icon: Gift,
        },
        // Adding other income reports back based on previous discussion, just to be comprehensive
        {
            label: "Monthly Salary Income",
            href: "/user/income-reports/monthly-salary",
            icon: BarChart2, // You can choose a suitable icon
        },
        {
            label: "Team Reward Income",
            href: "/user/income-reports/team-reward",
            icon: BarChart2, // You can choose a suitable icon
        },
      ],
    },

    {
      label: "Wallet",
      icon: Wallet,
      items: [
        {
          label: "History",
          href: "/user/wallet/history", // Updated path for consistency
          icon: History,
        },
        {
          label: "Manage",
          href: "/user/wallet/manage", // Updated path for consistency
          icon: Settings,
        },
      ],
    },

    {
      label: "AI bot",
      icon: Bot,
      items: [
        {
          label: "Ai Trade Bot",
          icon: ShieldCheck,
          href: "/user/aibot/aitradebot", 
        },
        {
          label: "Trade Report",
          icon: UserPlus, // Choose a suitable icon for reports if different
          href: "/user/aibot/trade-report", 
        },
      ],
    },

    {
      label: "Tickets",
      icon: Ticket,
      href: "/user/tickets", // Updated path for consistency
    },
    // {
    //   label: "Profile Settings",
    //   icon: Settings,
    //   href: "/dashboard/profile",
    // },
  ],

  // admin: [
  //   {
  //     label: "Users",
  //     icon: Users,
  //     items: [
  //       {
  //         label: "All Users",
  //         href: "AuthenticatedRoutes.LEVEL_INCOME_REPORT",
  //       },
  //       {
  //         label: "Active Users",
  //         href: "AuthenticatedRoutes.LEVEL_INCOME_REPORT",
  //       },
  //     ],
  //   },
  //   {
  //     label: "Financial Reports",
  //     icon: BarChart2,
  //     items: [
  //       {
  //         label: "Package Purchase History",
  //         href: "AuthenticatedRoutes.LEVEL_INCOME_REPORT",
  //       },
  //       {
  //         label: "Referral Income History",
  //         href: "AuthenticatedRoutes.LEVEL_INCOME_REPORT",
  //       },
  //       {
  //         label: "Level Income History",
  //         href: "AuthenticatedRoutes.LEVEL_INCOME_REPORT",
  //       },
  //       {
  //         label: "ROI Income History",
  //         href: "AuthenticatedRoutes.LEVEL_INCOME_REPORT",
  //       },
  //       {
  //         label: "Monthly Salary Income History",
  //         href: "AuthenticatedRoutes.LEVEL_INCOME_REPORT",
  //       },
  //       {
  //         label: "Team Reward Income History",
  //         href: "AuthenticatedRoutes.LEVEL_INCOME_REPORT",
  //       },
  //     ],
  //   },
  //   {
  //     label: "Withdrawal",
  //     icon: BadgeDollarSign,
  //     items: [
  //       {
  //         label: "Withdrawal History",
  //         href: "AuthenticatedRoutes.LEVEL_INCOME_REPORT",
  //       },
  //     ],
  //   },
  //   {
  //     label: "Help & Support",
  //     icon: MessageCircleQuestion,
  //     items: [
  //       {
  //         label: "Raise Ticket History",
  //         href: "AuthenticatedRoutes.LEVEL_INCOME_REPORT",
  //       },
  //     ],
  //   },
  // ],
};