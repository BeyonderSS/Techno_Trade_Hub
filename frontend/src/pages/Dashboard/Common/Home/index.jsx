import React from "react";
import AdminHome from "./AdminHome";
import UserHome from "./UserHome";
import { useSession } from "../../../../context/SessionContext";
import { LucideClockFading } from "lucide-react";

function DashboardHome() {
  const { user, loading } = useSession();
  if (loading) {
    return <div>loading... </div>;
  }
  console.log(user);
  const role = user?.roles;
  if (role === "admin") {
    return <AdminHome />;
  } else {
    return <UserHome />;
  }
}

export default DashboardHome;
