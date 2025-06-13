"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function MobileTradeCard({ trade }) {
  return (
    <Card className="bg-gray-900 border-gray-800 mb-2 sm:hidden">
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{trade.pair}</span>
              <span
                className={`px-1 py-0.5 rounded text-[10px] ${
                  trade.type === "buy" ? "bg-emerald-900/30 text-emerald-400" : "bg-red-900/30 text-red-400"
                }`}
              >
                {trade.type.toUpperCase()}
              </span>
            </div>
            <div className="text-gray-400 text-[10px] mt-1">{trade.time}</div>
          </div>
          <div className="flex items-center">
            <span className={`text-sm ${trade.profit.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>
              {trade.profit}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 text-[10px]">
          <div>
            <div className="text-gray-400">Amount</div>
            <div>{trade.amount}</div>
          </div>
          <div>
            <div className="text-gray-400">Price</div>
            <div>{trade.price}</div>
          </div>
          <div>
            <div className="text-gray-400">Value</div>
            <div>{trade.value} USDT</div>
          </div>
        </div>

        {trade.confidence != null && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400">AI Confidence</span>
              <span className="text-[10px]">{trade.confidence}%</span>
            </div>
            <Progress
              value={trade.confidence}
              className="h-1 bg-gray-800"
              indicatorClassName={trade.type === "buy" ? "bg-emerald-500" : "bg-red-500"}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
