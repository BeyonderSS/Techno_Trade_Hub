"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, Users, DollarSign, CheckCircle, Clock } from "lucide-react"
import { UsersTable } from "./users-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all")

  // Mock users data - in a real app, this would come from an API or database
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "Developer",
      status: "approved",
      joinDate: "2023-05-15",
      avatar: "/placeholder.svg?height=40&width=40",
      deposit: 2500,
    },
    {
      id: 2,
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: "Designer",
      status: "pending",
      joinDate: "2023-06-22",
      avatar: "/placeholder.svg?height=40&width=40",
      deposit: 1800,
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      role: "Manager",
      status: "approved",
      joinDate: "2023-04-10",
      avatar: "/placeholder.svg?height=40&width=40",
      deposit: 3200,
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      role: "Content Writer",
      status: "pending",
      joinDate: "2023-07-05",
      avatar: "/placeholder.svg?height=40&width=40",
      deposit: 950,
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david@example.com",
      role: "Developer",
      status: "approved",
      joinDate: "2023-03-18",
      avatar: "/placeholder.svg?height=40&width=40",
      deposit: 4100,
    },
  ])

  // Filter users based on search query and status filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filter === "all" || user.status === filter

    return matchesSearch && matchesFilter
  })

  // Calculate summary statistics
  const totalUsers = users.length
  const totalDeposit = users.reduce((sum, user) => sum + (user.deposit || 0), 0)
  const approvedUsers = users.filter((user) => user.status === "approved").length
  const pendingUsers = users.filter((user) => user.status === "pending").length

  // Function to approve or reject a user
  const updateUserStatus = (userId: number, status: "approved" | "pending" | "rejected") => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status } : user)))
  }

  // Function to update the filter
  const updateFilter = (newFilter: "all" | "pending" | "approved") => {
    setFilter(newFilter)
  }

  return (
    <ThemeProvider forcedTheme="dark" storageKey="theme-preference">
      <div className="container mx-auto py-8 space-y-6 bg-background dark">
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Users Management</h1>
            <ThemeToggle />
          </div>
          <p className="text-muted-foreground">View and manage user accounts and approval status</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border hover:bg-card/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 10)}% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border hover:bg-card/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalDeposit.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 15)}% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border hover:bg-card/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Approved Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedUsers}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((approvedUsers / totalUsers) * 100)}% of total users
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border hover:bg-card/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingUsers}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((pendingUsers / totalUsers) * 100)}% of total users
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8 w-full sm:w-[300px] bg-background/50 border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div>
          <UsersTable
            users={filteredUsers}
            updateUserStatus={updateUserStatus}
            currentFilter={filter}
            updateFilter={updateFilter}
          />
        </div>
      </div>
    </ThemeProvider>
  )
}
