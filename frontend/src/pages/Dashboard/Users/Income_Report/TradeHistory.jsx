"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import ReportHeader from "@/components/report-header";
import { Badge } from "../../../../components/ui/batch";
import { DollarSign, TrendingUp } from "lucide-react";

// Mock data
const mockData = [
  {
    _id: "65j09e2f5h1c6d009h9k1l3f",
    userId: {
      _id: "65a0c9e2b3f4d5a6b7c8e9f0",
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
    amount: 10.5,
    transactionDate: "2024-05-28T08:00:00.000Z",
    status: "completed",
    type: "roi_payout",
    txnId: "ROI-001-MNB",
    relatedEntityId: {
      _id: "65c32d5f8a4b9c002a2d4c6f",
      amount: 1500.0,
      startDate: "2024-05-18T09:00:00.000Z",
      status: "active",
    },
    adminFeeApplied: 0.5,
  },
  {
    _id: "65k10f3a6i2d7e000i0l2m4g",
    userId: {
      _id: "65a0c9e2b3f4d5a6b7c8e9f0",
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
    amount: 20.0,
    transactionDate: "2024-05-21T08:00:00.000Z",
    status: "completed",
    type: "roi_payout",
    txnId: "ROI-002-QWE",
    relatedEntityId: {
      _id: "65c32d5f8a4b9c002a2d4c6f",
      amount: 1500.0,
      startDate: "2024-05-18T09:00:00.000Z",
      status: "active",
    },
    adminFeeApplied: 1.0,
  },
];

export default function TradeHistoryPage() {
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
      accessorKey: "relatedEntityId.amount",
      header: "Investment Amount",
      cell: ({ row }) => (
        <div className="font-medium text-right">
          ${row.original.relatedEntityId.amount.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "adminFeeApplied",
      header: "Admin Fee",
      cell: ({ row }) => (
        <div className="text-right">${row.original.adminFeeApplied.toFixed(2)}</div>
      ),
    },
  ];

  const stats = [
    {
      label: "Total ROI Payouts",
      value: "$30.50",
      change: "+90% from last week",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "Investment Amount",
      value: "$1,500.00",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      label: "Total Admin Fees",
      value: "$1.50",
      icon: <DollarSign className="h-5 w-5" />,
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <ReportHeader
        title="Trade History"
        description="Track your ROI payout transactions from investments"
        stats={stats}
      />
      <div className="bg-black  border  border-amber-50 rounded-xl shadow-sm p-4 sm:p-6">
        <DataTable columns={columns} data={data} searchColumn="txnId" />
      </div>
    </div>
  );
}
