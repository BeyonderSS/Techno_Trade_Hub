"use client"

import { Card, CardContent } from "@/components/ui/card"

const tradeHistory = [
  {
    id: "t-9876",
    pair: "BTC/USDT",
    type: "buy",
    amount: "0.0215",
    price: "103845.32",
    value: "2232.67",
    time: "2 hours ago",
    status: "completed",
    profit: "+2.1%",
  },
  {
    id: "t-9875",
    pair: "ETH/USDT",
    type: "sell",
    amount: "0.125",
    price: "3245.78",
    value: "405.72",
    time: "3 hours ago",
    status: "completed",
    profit: "+1.8%",
  },
  {
    id: "t-9874",
    pair: "BTC/USDT",
    type: "buy",
    amount: "0.0185",
    price: "103756.45",
    value: "1919.49",
    time: "5 hours ago",
    status: "completed",
    profit: "-0.5%",
  },
  {
    id: "t-9873",
    pair: "SOL/USDT",
    type: "buy",
    amount: "2.5",
    price: "145.32",
    value: "363.30",
    time: "8 hours ago",
    status: "completed",
    profit: "+3.2%",
  },
  {
    id: "t-9872",
    pair: "ETH/USDT",
    type: "sell",
    amount: "0.085",
    price: "3234.56",
    value: "274.94",
    time: "12 hours ago",
    status: "completed",
    profit: "+1.4%",
  },
]

export function TradeHistory() {
  return (
    <Card className="bg-gray-900 border-gray-800 w-full">
      <CardContent className="p-0">
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="py-3 px-4 text-left">Pair</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Value</th>
                <th className="py-3 px-4 text-left">Time</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-right">Profit</th>
              </tr>
            </thead>
            <tbody>
              {tradeHistory.map((trade) => (
                <tr key={trade.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="py-3 px-4 font-medium text-gray-100">{trade.pair}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        trade.type === "buy"
                          ? "bg-emerald-900/30 text-emerald-400"
                          : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {trade.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-100">{trade.amount}</td>
                  <td className="py-3 px-4 text-gray-100">{trade.price}</td>
                  <td className="py-3 px-4 text-gray-100">{trade.value} USDT</td>
                  <td className="py-3 px-4 text-gray-400">{trade.time}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-900/30 text-blue-400">
                      {trade.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`font-medium ${
                        trade.profit.startsWith("+") ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {trade.profit}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
