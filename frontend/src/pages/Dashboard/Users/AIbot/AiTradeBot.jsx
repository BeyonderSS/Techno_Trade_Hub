"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "../../../../components/ui/batch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TradingChart } from "./Aibotcharts/TradingChart";
import { OrderBook } from "./Aibotcharts/OrderBook";
import { ActiveTrades } from "./Aibotcharts/ActiveTrades";
import { TradeHistory } from "./Aibotcharts/TradeHistory ";
import { BoltIcon, BarChart2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AiTradeBot () {
  const [showChart, setShowChart] = useState(true);
  const [activeTrades, setActiveTrades] = useState([
    {
      id: "t-1234",
      pair: "BTC/USDT",
      type: "buy",
      amount: "0.0125",
      price: "104078.85",
      value: "1300.99",
      time: "2 min ago",
      status: "active",
      profit: "+1.2%",
    },
  ]);

  const handleCancelTrade = (id) => {
    setActiveTrades(activeTrades.filter((trade) => trade.id !== id));
  };

  const handlePlaceTrade = () => {
    const newTrade = {
      id: `t-${Math.floor(Math.random() * 10000)}`,
      pair: "BTC/USDT",
      type: Math.random() > 0.5 ? "buy" : "sell",
      amount: (Math.random() * 0.05).toFixed(4),
      price: (104000 + Math.random() * 200).toFixed(2),
      value: (Math.random() * 2000 + 500).toFixed(2),
      time: "just now",
      status: "active",
      profit: `${Math.random() > 0.5 ? "+" : "-"}${(Math.random() * 2).toFixed(1)}%`,
    };
    setActiveTrades([newTrade, ...activeTrades]);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-4 sticky top-0 z-10 bg-black">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-emerald-400">Trading Bot</h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Badge className="bg-gray-800 text-emerald-400 border border-emerald-400">
                Balance: 25,432.56 USDT
              </Badge>
              <Badge className="bg-gray-800 text-yellow-400 border border-yellow-400">
                Profit Today: +521.34 USDT
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-emerald-600">AT</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <span>Hii, ALT6938205522</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gray-900 border border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <BoltIcon className="h-5 w-5 text-yellow-500" />
                  <h2 className="text-xl font-bold text-emerald-400">AI TRADE BOT</h2>
                </div>
                <Badge className="bg-emerald-600">LEVEL 1</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Profit Range:</span>
                    <span className="text-emerald-400">1.5% - 2.1%</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Success Rate:</span>
                    <span className="text-emerald-400">94.3%</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Daily Trades:</span>
                    <span className="text-emerald-400">12-18</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <OrderBook />

            <div className="flex justify-center">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white w-64 py-6 rounded-lg"
                onClick={handlePlaceTrade}
              >
                <span className="text-lg">Place Trade</span>
              </Button>
            </div>

            <p className="text-center text-gray-400 text-sm mt-4">
              Your trade profit will be automatically calculated after 30 seconds based on market depth. Level up to
              increase daily yield.
            </p>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Trading Dashboard</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Show Chart</span>
                  <Switch
                    checked={showChart}
                    onCheckedChange={setShowChart}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="border-gray-700">
                        <BarChart2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Chart Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {showChart && (
              <Card className="bg-gray-900 border border-gray-800 mb-6">
                <CardContent className="p-0">
                  <TradingChart />
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="bg-gray-800 w-full justify-start">
                <TabsTrigger value="active" className="data-[state=active]:bg-gray-700">
                  Active Trades
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-gray-700">
                  Trade History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="mt-4">
                <ActiveTrades trades={activeTrades} onCancel={handleCancelTrade} />
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                <TradeHistory />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <footer className="container mx-auto p-4 text-center text-gray-500 text-sm border-t border-gray-800 mt-8">
        <p>Copilot • AI Trade Bot v2.3.4</p>
      </footer>
    </div>
  );
}
