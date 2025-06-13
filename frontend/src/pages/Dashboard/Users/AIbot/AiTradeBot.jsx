"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "../../../../components/ui/batch";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TradingChart } from "./Aibotcharts/TradingChart";
import { OrderBook } from "./Aibotcharts/OrderBook";
import { ActiveTrades } from "./Aibotcharts/ActiveTrades";
import { TradeHistory } from "./Aibotcharts/TradeHistory ";
import { AiStatus } from "./Aibotcharts/AiStatus";
import { PerformanceMetrics } from "./Aibotcharts/PerformanceMatrix";
import {
  BoltIcon,
  BarChart2,
  BrainCircuit,
  TrendingUp,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

export default function Home() {
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
      confidence: 87,
      signal: "Strong Buy",
    },
    {
      id: "t-1235",
      pair: "ETH/USDT",
      type: "sell",
      amount: "0.42",
      price: "3245.78",
      value: "1363.23",
      time: "5 min ago",
      status: "active",
      profit: "+0.8%",
      confidence: 72,
      signal: "Sell",
    },
  ]);

  const [aiProgress, setAiProgress] = useState(0);
  const [nextTradeTime, setNextTradeTime] = useState(45);

  useEffect(() => {
    const timer = setInterval(() => {
      setAiProgress((prev) => {
        if (prev >= 100) {
          const newTrade = {
            id: `t-${Math.floor(Math.random() * 10000)}`,
            pair: Math.random() > 0.5 ? "BTC/USDT" : "ETH/USDT",
            type: Math.random() > 0.5 ? "buy" : "sell",
            amount: (Math.random() * 0.05).toFixed(4),
            price: (104000 + Math.random() * 200).toFixed(2),
            value: (Math.random() * 2000 + 500).toFixed(2),
            time: "just now",
            status: "active",
            profit: `${Math.random() > 0.7 ? "+" : "-"}${(Math.random() * 2).toFixed(1)}%`,
            confidence: Math.floor(Math.random() * 30) + 70,
            signal: Math.random() > 0.5 ? "Strong Buy" : "Buy",
          };
          setActiveTrades((prev) => [newTrade, ...prev.slice(0, 4)]);
          setNextTradeTime(Math.floor(Math.random() * 30) + 30);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (nextTradeTime <= 0) return;

    const timer = setInterval(() => {
      setNextTradeTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextTradeTime]);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 p-3 sm:p-4 sticky top-0 z-10 bg-black/95 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-emerald-400">AI Trade Bot</h1>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Badge variant="outline" className="bg-gray-800 text-emerald-400 border-emerald-400 text-xs sm:text-sm">
                Balance: 25,432.56 USDT
              </Badge>
              <Badge variant="outline" className="bg-gray-800 text-yellow-400 border-yellow-400 text-xs sm:text-sm">
                Profit Today: +521.34 USDT
              </Badge>
            </div>
            {/* <div className="flex items-center gap-2 ml-auto sm:ml-0">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-emerald-600 text-xs sm:text-sm">AT</AvatarFallback>
              </Avatar>
              <div className="text-xs sm:text-sm">
                <span>Hii, ALT6938205522</span>
              </div>
            </div> */}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <Card className="bg-gray-900 border-gray-800 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <BoltIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                  <h2 className="text-lg sm:text-xl font-bold text-emerald-400">AI TRADE BOT</h2>
                </div>
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm">LEVEL 1</Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-3 sm:p-6 space-y-3 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs sm:text-sm">Profit Range:</span>
                    <span className="text-emerald-400 text-xs sm:text-sm">1.5% - 2.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs sm:text-sm">Success Rate:</span>
                    <span className="text-emerald-400 text-xs sm:text-sm">94.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs sm:text-sm">Daily Trades:</span>
                    <span className="text-emerald-400 text-xs sm:text-sm">12-18</span>
                  </div>
                </div>
                <AiStatus progress={aiProgress} nextTradeTime={nextTradeTime} />
              </CardContent>
            </Card>

            <OrderBook />
            <PerformanceMetrics />

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="p-3 sm:p-6 pb-0">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  AI Trading Strategy
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-400">
                  Current market analysis and strategy
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 space-y-3 text-xs sm:text-sm">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Sentiment:</span>
                    <span className="text-emerald-400">Bullish</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volatility:</span>
                    <span className="text-yellow-400">Medium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Strategy:</span>
                    <span className="text-blue-400">Momentum</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-800">
                  <p className="text-gray-300">
                    AI is currently focusing on momentum trading with BTC and ETH pairs. Market conditions show strong
                    bullish signals with moderate volatility.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold">Trading Dashboard</h2>
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm text-gray-400">Show Chart</span>
                  <Switch
                    checked={showChart}
                    onCheckedChange={setShowChart}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="h-7 w-7 sm:h-8 sm:w-8 rounded-md border border-gray-700 bg-gray-800 flex items-center justify-center">
                        <BarChart2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Chart Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {showChart && (
              <Card className="bg-gray-900 border-gray-800 mb-4 sm:mb-6">
                <CardContent className="p-0">
                  <TradingChart />
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="bg-gray-800 w-full justify-start">
                <TabsTrigger value="active" className="data-[state=active]:bg-gray-700 text-xs sm:text-sm">
                  Active Trades
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-gray-700 text-xs sm:text-sm">
                  Trade History
                </TabsTrigger>
                {/* <TabsTrigger value="signals" className="data-[state=active]:bg-gray-700 text-xs sm:text-sm">
                  AI Signals
                </TabsTrigger> */}
              </TabsList>
              <TabsContent value="active" className="mt-3 sm:mt-4">
                <ActiveTrades trades={activeTrades} />
              </TabsContent>
              <TabsContent value="history" className="mt-3 sm:mt-4">
                <TradeHistory />
              </TabsContent>
              <TabsContent value="signals" className="mt-3 sm:mt-4">
                {/* Keep signal cards here exactly as you had them */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <footer className="container mx-auto p-3 sm:p-4 text-center text-gray-500 text-xs sm:text-sm border-t border-gray-800 mt-4 sm:mt-8">
        <p>Copilot • AI Trade Bot v2.3.4</p>
      </footer>
    </div>
  );
}
