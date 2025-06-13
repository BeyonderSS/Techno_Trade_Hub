"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import ReportHeader from "@/components/report-header";
import { Badge } from "../../../../components/ui/batch";
import { DollarSign, Calendar } from "lucide-react";

// Mock data
const mockData = [
  {
    _id: "65h87c0d3f9a4b007f7i9j1d",
    userId: {
      _id: "65a0c9e2b3f4d5a6b7c8e9f0",
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
    amount: 100.0,
    transactionDate: "2024-05-27T00:00:00.000Z",
    status: "completed",
    type: "weekly_bonus",
    txnId: "WB-001-VWX",
    adminActionNotes: "Weekly bonus for referrals in week 21.",
  },
  {
    _id: "65i98d1e4g0b5c008g8j0k2e",
    userId: {
      _id: "65a0c9e2b3f4d5a6b7c8e9f0",
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
    amount: 75.0,
    transactionDate: "2024-05-20T00:00:00.000Z",
    status: "completed",
    type: "weekly_bonus",
    txnId: "WB-002-YZA",
    adminActionNotes: "Weekly bonus for referrals in week 20.",
  },
];

export default function WeeklyBonusPage() {
  const [data] = useState(mockData);

  const columns = [
    {
      accessorKey: "txnId",
      header: "Transaction ID",
    },
    {
      accessorKey: "userId.name",
      header: "User",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.userId.name}</div>
          <div className="text-sm text-muted-foreground">{row.original.userId.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-medium text-right">${row.original.amount.toFixed(2)}</div>
      ),
    },
    {
      accessorKey: "transactionDate",
      header: "Date",
      cell: ({ row }) => (
        <div>{new Date(row.original.transactionDate).toLocaleDateString()}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "completed" ? "success" : "default"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "adminActionNotes",
      header: "Notes",
      cell: ({ row }) => (
        <div
          className="max-w-[250px] truncate text-sm sm:text-base"
          title={row.original.adminActionNotes}
        >
          {row.original.adminActionNotes}
        </div>
      ),
    },
  ];

  const stats = [
    {
      label: "Total Weekly Bonuses",
      value: "$175.00",
      change: "+33% from previous week",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "Latest Bonus Week",
      value: "Week 21",
      icon: <Calendar className="h-5 w-5" />,
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <ReportHeader
        title="Weekly Bonus"
        description="View your weekly bonus earnings based on referral activity"
        stats={stats}
      />
      <div className="bg-black/50  border  border-amber-50 rounded-xl shadow-sm p-4 sm:p-6">
        <DataTable columns={columns} data={data} searchColumn="txnId" />
      </div>
    </div>
  );
}
