"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "../../../../../components/ui/batch"
import { ChevronDown, ChevronUp } from "lucide-react"

// Initial data
const initialBuyOrders = [
  { qty: "2.621", price: "104078.85" },
  { qty: "0.001", price: "104078.84" },
  { qty: "0.002", price: "104078.50" },
  { qty: "0.000", price: "104078.34" },
  { qty: "0.000", price: "104078.02" },
]

const initialSellOrders = [
  { qty: "4.727", price: "104078.86" },
  { qty: "0.002", price: "104079.00" },
  { qty: "0.000", price: "104079.01" },
  { qty: "0.000", price: "104079.18" },
  { qty: "0.000", price: "104079.21" },
]

export function OrderBook() {
  const [buyOrders, setBuyOrders] = useState(initialBuyOrders)
  const [sellOrders, setSellOrders] = useState(initialSellOrders)
  const [lastUpdated, setLastUpdated] = useState(0)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newBuyOrders = [...buyOrders]
      const buyIndex = Math.floor(Math.random() * buyOrders.length)
      const buyQty = (Math.random() * 5).toFixed(3)
      const buyPriceChange = Math.random() * 0.5 - 0.25
      const buyPrice = (parseFloat(buyOrders[buyIndex].price) + buyPriceChange).toFixed(2)
      newBuyOrders[buyIndex] = { qty: buyQty, price: buyPrice }

      const newSellOrders = [...sellOrders]
      const sellIndex = Math.floor(Math.random() * sellOrders.length)
      const sellQty = (Math.random() * 5).toFixed(3)
      const sellPriceChange = Math.random() * 0.5 - 0.25
      const sellPrice = (parseFloat(sellOrders[sellIndex].price) + sellPriceChange).toFixed(2)
      newSellOrders[sellIndex] = { qty: sellQty, price: sellPrice }

      setBuyOrders(newBuyOrders)
      setSellOrders(newSellOrders)
      setLastUpdated(0)
    }, 3000)

    return () => clearInterval(interval)
  }, [buyOrders, sellOrders])

  // Timer for "last updated"
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-2 flex flex-row items-center justify-between p-3 sm:p-6">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-amber-500">📊</span>
          <h3 className="text-gray-200 text-xs sm:text-sm">Live BTC/USDT Order Book</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-gray-800 text-gray-400 text-xs">
            Depth: 5
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="py-1 sm:py-2 px-2 sm:px-4 text-left">Qty</th>
                <th className="py-1 sm:py-2 px-2 sm:px-4 text-left">Price</th>
                <th className="py-1 sm:py-2 px-2 sm:px-4 text-left">Price</th>
                <th className="py-1 sm:py-2 px-2 sm:px-4 text-left">Qty</th>
              </tr>
            </thead>
            <tbody>
              {buyOrders.map((buy, index) => (
                <tr key={index} className="border-b border-gray-800">
                  <td className="py-1 sm:py-2 px-2 sm:px-4 text-emerald-400">{buy.qty}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4 text-emerald-400 flex items-center">
                    {buy.price}
                    <ChevronUp className="h-2 w-2 sm:h-3 sm:w-3 ml-1 text-emerald-400" />
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4 text-red-400 flex items-center">
                    {sellOrders[index].price}
                    <ChevronDown className="h-2 w-2 sm:h-3 sm:w-3 ml-1 text-red-400" />
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4 text-red-400">{sellOrders[index].qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-2 sm:p-3 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0">
          <span className="text-xs text-gray-400">Last updated: {lastUpdated} seconds ago</span>
          <span className="text-xs text-emerald-400">Spread: 0.01 (0.001%)</span>
        </div>
      </CardContent>
    </Card>
  )
}
