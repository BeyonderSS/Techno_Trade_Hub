import React from "react";
import Home from "./AiTradeBot";
import { useSession } from "../../../../context/SessionContext";
import InvestDialog from "../../../../components/InvestDialog";

function AiTradeEngineHome() {
  const { user, loading } = useSession();

  if (loading) {
    return <>Loading...</>;
  }
  if (user?.walletBalance > 30) {
    return <Home />;
  } else {
    return (
      <>
        It looks like you have no active investment <InvestDialog />
      </>
    );
  }
}

export default AiTradeEngineHome;
