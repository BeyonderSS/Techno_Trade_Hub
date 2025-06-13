import React from "react";
import { useSession } from "../../../../context/SessionContext";
import AdminWithdrawalsPage from "./AdminWithdrawalsPage";
import UserWithdrawalsPage from "./UserWithdrawlPage";

function WithdrawalsPage() {
  const { user, loading } = useSession();
  if (loading) {
    return <>loading...</>;
  }
  if (user?.roles === "user") {
    return <UserWithdrawalsPage />;
  } else {
    return <AdminWithdrawalsPage />;
  }
}

export default WithdrawalsPage;
