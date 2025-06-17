"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, User, DollarSign, CheckCircle, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "react-router-dom";

// Import your API function
import { fetchUsers } from "../../../../api/adminuser";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsersCount, setTotalUsersCount] = useState(0); // To display total users in dashboard cards
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ITEMS_PER_PAGE = 10; // Matches your backend's default limit, or you can make this dynamic

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sortBy: 'createdAt', // Default sort
        sortOrder: -1,       // Newest first

      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (statusFilter !== "all") {
        // Your backend expects a boolean for isEmailVerified.
        // Assuming 'approved' implies verified and 'pending'/'rejected' implies not verified.
        // You might need to adjust this based on how 'status' maps to 'isEmailVerified' in your backend logic.
        // For now, let's map 'approved' to true, and others to false, if 'status' is indeed meant to control 'isEmailVerified'.
        // If 'status' is a separate field, you'd need a backend filter for it.
        // For demonstration, let's assume `statusFilter` directly correlates with `isEmailVerified`
        // or you'd introduce a new filter parameter for a user approval status.
        params.isEmailVerified = statusFilter === 'approved';
      }

      const data = await fetchUsers(params);
      // console.log("frontend page", data);
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotalUsersCount(data.totalUsers); // Update total users count
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter]); // Dependencies for useCallback

  useEffect(() => {
    loadUsers();
  }, [loadUsers]); // Reload users when loadUsers changes (due to dependencies)

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page on new filter
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusBadgeClass = (isEmailVerified) => {
    // Assuming 'isEmailVerified' from backend is the primary status
    if (isEmailVerified) {
      return "bg-green-600 text-white";
    }
    return "bg-yellow-400 text-black"; // For unverified/pending
  };

  // Dummy data for dashboard cards (you'll need to fetch real stats from your backend)
  const totalDeposits = "You will need a new API endpoint for this"; // Example, needs backend
  const approvedUsersCount = "You will need an API endpoint or derive from fetched data"; // Example, needs backend
  const pendingApprovalsCount = "You will need an API endpoint or derive from fetched data"; // Example, needs backend


  if (loading) {
    return <div className="p-6 text-white">Loading users...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-black/">
      <div>
        <h1 className="text-3xl font-bold text-white">Users Management</h1>
        <p className="text-gray-400 text-sm">
          View and manage user accounts and approval status
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className=" from-black/70 to-gray-900 border border-gray-700 ">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold ">{totalUsersCount}</div>
            <p className="text-xs text-muted-foreground">+9% from last month</p> {/* This static text needs to be dynamic */}
          </CardContent>
        </Card>
        {/* <Card className="border border-amber-100 hover:bg-black/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <DollarSign className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeposits}</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card className="border border-amber-100 hover:bg-black/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved Users</CardTitle>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedUsersCount}</div>
            <p className="text-xs text-muted-foreground">40% of total users</p>
          </CardContent>
        </Card>
        <Card className="border border-amber-100 hover:bg-black/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="w-5 h-5 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovalsCount}</div>
            <p className="text-xs text-muted-foreground">40% of total users</p>
          </CardContent>
        </Card> */}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Input
          className="max-w-sm"
          placeholder="Search users by name, email, contact, referral code..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filter by Email Verification: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="approved">Verified</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pending">Unverified</DropdownMenuRadioItem>
              {/* Note: 'rejected' status isn't directly mapped to isEmailVerified in your backend. */}
              {/* You might need a separate 'userStatus' field in your User model if you have such approval workflow */}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-black/30 text-white">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">User</th>
              <th>Wallet Balance</th>
              <th>Monthly Trades</th>
              <th>Direct Referrals</th>
              <th>Referral Code</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-white divide-y divide-gray-800">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}> {/* Use user._id from MongoDB */}
                  <td className="truncate">
                    <Link
                      to={`/dashboard/admin/user/${user._id}`}
                      className="text-blue-400 hover:underline"
                    >
                      {user._id || NA}
                    </Link>
                    </td>
                  <td className="p-4">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-gray-400 text-xs">{user.email}</div>
                  </td>
                  <td>${user.walletBalance ? user.walletBalance.toFixed(2) : '0.00'}</td>
                  <td>{user.monthlyTradesCompleted || 0}</td>
                  <td>
                    <Badge
                      className={`${getStatusBadgeClass(user.directReferrals.length)}`}
                    >
                      {user.directReferrals.length}
                    </Badge>
                  </td>
                  <td>{user.referralCode || 'N/A'}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td> {/* Format date */}
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem> {/* Changed from Edit as no edit functionality yet */}
                        <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem> {/* This would require a delete API call */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={i + 1 === currentPage}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}