"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import ReportHeader from "@/components/report-header";
import { Badge } from "../../../../components/ui/batch";
import { DollarSign, LineChart } from "lucide-react";

// Mock data
const mockData = [
  {
    _id: "65f65a8b1d7e2f005d5g7h9b",
    userId: {
      _id: "65a0c9e2b3f4d5a6b7c8e9f0",
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
    amount: 25.0,
    transactionDate: "2024-05-25T11:00:00.000Z",
    status: "completed",
    type: "level_income",
    txnId: "LI-001-PQR",
    relatedEntityId: "65f65a8b1d7e2f005d5g7h9c",
    adminActionNotes: "Bonus from Level 2 referral activity.",
  },
  {
    _id: "65g76b9c2e8f3a006e6h8i0c",
    userId: {
      _id: "65a0c9e2b3f4d5a6b7c8e9f0",
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
    amount: 10.0,
    transactionDate: "2024-05-18T09:00:00.000Z",
    status: "completed",
    type: "level_income",
    txnId: "LI-002-STU",
    relatedEntityId: "65g76b9c2e8f3a006e6h8i0d",
    adminActionNotes: "Bonus from Level 3 referral activity.",
  },
];

export default function LevelIncomePage() {
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
      label: "Total Level Income",
      value: "$35.00",
      change: "+10% from last month",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "Level Distribution",
      value: "Level 2: $25, Level 3: $10",
      icon: <LineChart className="h-5 w-5" />,
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <ReportHeader
        title="Level Income"
        description="Track your level income transactions from your referral network"
        stats={stats}
      />
      <div className="bg-black/50  border  border-amber-50 rounded-xl shadow-sm p-4 sm:p-6">
        <DataTable columns={columns} data={data} searchColumn="txnId" />
      </div>
    </div>
  );
}
