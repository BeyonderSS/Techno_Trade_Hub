"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import ReportHeader from "@/components/report-header"
import { Progress } from "@/components/ui/progress"
import { Users, Wallet } from "lucide-react"

// Mock data
const mockData = [
  {
    userId: "65a0c9e2b3f4d5a6b7c8e9f1",
    name: "Team Member A",
    email: "team.member.a@example.com",
    walletBalance: 1200.5,
    directReferralCount: 5,
  },
  {
    userId: "65a0c9e2b3f4d5a6b7c8e9f2",
    name: "Team Member B",
    email: "team.member.b@example.com",
    walletBalance: 800.25,
    directReferralCount: 2,
  },
  {
    userId: "65a0c9e2b3f4d5a6b7c8e9f3",
    name: "Team Member C",
    email: "team.member.c@example.com",
    walletBalance: 300.0,
    directReferralCount: 0,
  },
]

export default function TeamPerformancePage() {
  const [data] = useState(mockData)

  const columns = [
    {
      accessorKey: "name",
      header: "Team Member",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "walletBalance",
      header: "Wallet Balance",
      cell: ({ row }) => (
        <div className="font-medium text-right">${row.original.walletBalance.toFixed(2)}</div>
      ),
    },
    {
      accessorKey: "directReferralCount",
      header: "Direct Referrals",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <span className="font-medium">{row.original.directReferralCount}</span>
          <Progress value={row.original.directReferralCount * 20} className="h-2 w-[80px] sm:w-[100px]" />
        </div>
      ),
    },
    {
      accessorKey: "performance",
      header: "Performance",
      cell: ({ row }) => {
        const count = row.original.directReferralCount
        let label = "Low"
        let color = "text-red-500"

        if (count >= 5) {
          label = "Excellent"
          color = "text-green-500"
        } else if (count >= 3) {
          label = "Good"
          color = "text-amber-500"
        } else if (count >= 1) {
          label = "Average"
          color = "text-blue-500"
        }

        return <span className={`font-medium ${color}`}>{label}</span>
      },
    },
  ]

  const stats = [
    {
      label: "Total Team Members",
      value: "3",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Total Referrals",
      value: "7",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Total Wallet Balance",
      value: "$2,300.75",
      icon: <Wallet className="h-5 w-5" />,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <ReportHeader
        title="Team Performance"
        description="Analyze your team's performance metrics and referral counts"
        stats={stats}
      />
      <div className="bg-black/50  border  border-amber-50 dark:bg-black/50 rounded-xl shadow p-4 sm:p-6">
        <DataTable columns={columns} data={data} searchColumn="name" />
      </div>
    </div>
  )
}
