"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MobileTradeCard } from "./MobileTradeCard"

export function ActiveTrades({ trades }) {
  if (trades.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4 sm:p-6 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">No active trades. AI is analyzing the market.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-0">
        {/* Mobile view */}
        <div className="sm:hidden space-y-2 mb-2">
          {trades.map((trade) => (
            <MobileTradeCard key={trade.id} trade={trade} />
          ))}
        </div>

        {/* Desktop view */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Pair</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Type</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Amount</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left hidden sm:table-cell">Price</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Value</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left hidden sm:table-cell">Time</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Signal</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-right">Profit</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b border-gray-800">
                  <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium">{trade.pair}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4">
                    <span
                      className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs ${
                        trade.type === "buy" ? "bg-emerald-900/30 text-emerald-400" : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {trade.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4">{trade.amount}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">{trade.price}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4">{trade.value}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-400 hidden sm:table-cell">{trade.time}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">Confidence</span>
                        <span className="text-[10px]">{trade.confidence}%</span>
                      </div>
                      <Progress
                        value={trade.confidence}
                        className="h-1 bg-gray-800"
                        indicatorClassName={trade.type === "buy" ? "bg-emerald-500" : "bg-red-500"}
                      />
                    </div>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
                    <span className={trade.profit.startsWith("+") ? "text-emerald-400" : "text-red-400"}>
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
