"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import ReportHeader from "@/components/report-header";
import { Badge } from "../../../../components/ui/batch";
import { DollarSign, Calendar } from "lucide-react";

// Mock salary data
const mockData = [
  {
    _id: "65d43e6f9b5c0d003b3e5d7f",
    userId: {
      _id: "65a0c9e2b3f4d5a6b7c8e9f0",
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
    amount: 1500.0,
    transactionDate: "2024-05-01T00:00:00.000Z",
    status: "completed",
    type: "monthly_salary",
    txnId: "MSAL-001-XYZ",
    adminActionNotes: "Monthly salary for May 2024.",
  },
  {
    _id: "65e54f7a0c6d1e004c4f6e8a",
    userId: {
      _id: "65a0c9e2b3f4d5a6b7c8e9f0",
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
    amount: 1500.0,
    transactionDate: "2024-04-01T00:00:00.000Z",
    status: "completed",
    type: "monthly_salary",
    txnId: "MSAL-002-ABC",
    adminActionNotes: "Monthly salary for April 2024.",
  },
];

export default function SalaryIncomePage() {
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
        <div className="max-w-[250px] truncate" title={row.original.adminActionNotes}>
          {row.original.adminActionNotes}
        </div>
      ),
    },
  ];

  const stats = [
    {
      label: "Total Salary Income",
      value: "$3,000.00",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "Last Payment",
      value: "May 1, 2024",
      icon: <Calendar className="h-5 w-5" />,
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <ReportHeader
        title="Salary Income"
        description="View your monthly salary transactions"
        stats={stats}
      />
      <div className="bg-black/50 border  border-amber-50 rounded-xl shadow-sm p-4 sm:p-6">
        <DataTable columns={columns} data={data} searchColumn="txnId" />
      </div>
    </div>
  );
}
