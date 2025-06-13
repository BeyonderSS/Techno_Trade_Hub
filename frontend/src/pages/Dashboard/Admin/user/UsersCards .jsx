"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, X, Mail, Calendar } from "lucide-react"

export function UsersCards({ users, updateUserStatus }) {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-100">
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {users.length === 0 ? (
        <div className="col-span-full text-center py-12 text-muted-foreground">No users found.</div>
      ) : (
        users.map((user) => (
          <Card key={user.id} className="overflow-hidden flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex justify-between gap-4">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg mt-2">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
                <div>{getStatusBadge(user.status)}</div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {formatDate(user.joinDate)}</span>
              </div>
            </CardContent>

            <CardFooter className="mt-auto pt-4 border-t flex flex-col sm:flex-row justify-between gap-2">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                View Profile
              </Button>

              {user.status === "pending" ? (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                    onClick={() => updateUserStatus(user.id, "approved")}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={() => updateUserStatus(user.id, "rejected")}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              ) : user.status === "approved" ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => updateUserStatus(user.id, "pending")}
                >
                  Set Pending
                </Button>
              ) : null}
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}
