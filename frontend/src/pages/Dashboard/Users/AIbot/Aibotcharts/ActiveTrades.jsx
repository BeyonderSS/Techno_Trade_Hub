"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function ActiveTrades({ trades, onCancel }) {
  if (trades.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">No active trades. Place a trade to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="py-3 px-4 text-left">Pair</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Value</th>
                <th className="py-3 px-4 text-left">Time</th>
                <th className="py-3 px-4 text-left">Profit</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b border-gray-800">
                  <td className="py-3 px-4 font-medium">{trade.pair}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        trade.type === "buy"
                          ? "bg-emerald-900/30 text-emerald-400"
                          : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {trade.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">{trade.amount}</td>
                  <td className="py-3 px-4">{trade.price}</td>
                  <td className="py-3 px-4">{trade.value} USDT</td>
                  <td className="py-3 px-4 text-gray-400">{trade.time}</td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        trade.profit.startsWith("+")
                          ? "text-emerald-400"
                          : "text-red-400"
                      }
                    >
                      {trade.profit}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-red-900/30"
                      onClick={() => onCancel(trade.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Cancel trade</span>
                    </Button>
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
