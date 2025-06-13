"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "../../../../../components/ui/batch"
import { ChevronDown, ChevronUp } from "lucide-react"

// Dummy data
const buyOrders = [
  { qty: "2.621", price: "104078.85" },
  { qty: "0.001", price: "104078.84" },
  { qty: "0.002", price: "104078.50" },
  { qty: "0.000", price: "104078.34" },
  { qty: "0.000", price: "104078.02" },
]

const sellOrders = [
  { qty: "4.727", price: "104078.86" },
  { qty: "0.002", price: "104079.00" },
  { qty: "0.000", price: "104079.01" },
  { qty: "0.000", price: "104079.18" },
  { qty: "0.000", price: "104079.21" },
]

export function OrderBook() {
  return (
    <Card className="bg-gray-900 border-gray-800 w-full">
      <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 text-lg">📊</span>
          <h3 className="text-gray-200 text-base font-semibold">
            Live BTC/USDT Order Book
          </h3>
        </div>
        <Badge variant="outline" className="bg-gray-800 text-gray-400">
          Depth: 5
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="py-2 px-4 text-left">Qty</th>
                <th className="py-2 px-4 text-left">Price</th>
                <th className="py-2 px-4 text-left">Price</th>
                <th className="py-2 px-4 text-left">Qty</th>
              </tr>
            </thead>
            <tbody>
              {buyOrders.map((buy, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="py-2 px-4 text-emerald-400">{buy.qty}</td>
                  <td className="py-2 px-4 text-emerald-400 flex items-center">
                    {buy.price}
                    <ChevronUp className="h-3 w-3 ml-1 text-emerald-400" />
                  </td>
                  <td className="py-2 px-4 text-red-400 flex items-center">
                    {sellOrders[index].price}
                    <ChevronDown className="h-3 w-3 ml-1 text-red-400" />
                  </td>
                  <td className="py-2 px-4 text-red-400">{sellOrders[index].qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-2 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <span className="text-xs text-gray-400">Last updated: 2 seconds ago</span>
          <span className="text-xs text-emerald-400">Spread: 0.01 (0.001%)</span>
        </div>
      </CardContent>
    </Card>
  )
}
