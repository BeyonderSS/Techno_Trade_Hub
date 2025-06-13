"use client"

import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

// Generate candle data
const generateCandleData = (count) => {
  const data = []
  let price = 60000
  const volatility = 0.01
  const trend = 0.001

  for (let i = 0; i < count; i++) {
    const randomFactor = Math.random() * 2 - 1
    const change = price * volatility * randomFactor + price * trend
    const open = price
    price = Math.max(open + change, open * 0.95)

    const highFactor = Math.random() * 0.005 + 0.001
    const lowFactor = Math.random() * 0.005 + 0.001

    const high = Math.max(open, price) * (1 + highFactor)
    const low = Math.min(open, price) * (1 - lowFactor)

    const date = new Date()
    date.setDate(date.getDate() - (count - i))

    data.push({
      date: date.toISOString().split("T")[0],
      open,
      close: price,
      high,
      low,
      volume: Math.floor(Math.random() * 1000) + 500,
    })
  }

  return data
}

const generateIndicatorData = (candleData, baseValue, volatility, correlation = 0.7) => {
  return candleData.map((candle, i) => {
    const priceChange =
      i > 0 ? (candle.close - candleData[i - 1].close) / candleData[i - 1].close : 0
    const correlatedMove = baseValue * correlation * priceChange * 100
    const randomNoise = (Math.random() - 0.5) * volatility

    let value = baseValue + correlatedMove + randomNoise
    value = Math.max(0, Math.min(100, value))

    return {
      date: candle.date,
      value,
    }
  })
}

const candleData = generateCandleData(100)
const rsiData = generateIndicatorData(candleData, 50, 5, 0.6)
const adlData = generateIndicatorData(candleData, 70, 8, 0.4)

const volumeData = candleData.map((item) => ({
  date: item.date,
  volume: item.volume,
  color: item.close > item.open ? "#22c55e" : "#ef4444",
}))

export function TradingChart() {
  const [timeframe, setTimeframe] = useState("1D")
  const [indicators, setIndicators] = useState({ rsi: true, adl: true, volume: true })

  return (
    <div className="bg-gray-900 text-gray-200 p-2 sm:p-4 min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] w-full">
      {/* Header - Responsive Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3 sm:gap-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base">BTC/USDT</span>
            <span className="text-emerald-400 text-sm sm:text-base">64.56%</span>
          </div>
          <span className="text-xs text-gray-400">104078.85</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-6 sm:h-7 text-xs border-gray-700 bg-gray-800 px-2 sm:px-3"
          >
            <span className="hidden sm:inline">Indicators</span>
            <span className="sm:hidden">Ind</span>
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
          
          <Tabs defaultValue="1D" className="w-auto">
            <TabsList className="bg-gray-800 h-6 sm:h-7 p-0.5">
              <TabsTrigger value="1H" className="text-xs h-4 sm:h-5 px-1.5 sm:px-2">1H</TabsTrigger>
              <TabsTrigger value="4H" className="text-xs h-4 sm:h-5 px-1.5 sm:px-2">4H</TabsTrigger>
              <TabsTrigger value="1D" className="text-xs h-4 sm:h-5 px-1.5 sm:px-2">1D</TabsTrigger>
              <TabsTrigger value="1W" className="text-xs h-4 sm:h-5 px-1.5 sm:px-2">1W</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Chart - Responsive Height */}
      <div className="h-[280px] sm:h-[350px] md:h-[400px] lg:h-[450px] mb-3 sm:mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={candleData} 
            margin={{ 
              top: 5, 
              right: 10, 
              left: 5, 
              bottom: 5 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              dataKey="date"
              stroke="#666"
              tick={{ fill: "#666", fontSize: 10 }}
              tickLine={{ stroke: "#666" }}
              interval="preserveStartEnd"
              tickFormatter={(value) => {
                const date = new Date(value)
                return window.innerWidth < 640 
                  ? `${date.getDate()}` 
                  : `${date.getDate()}/${date.getMonth() + 1}`
              }}
            />
            <YAxis
              stroke="#666"
              tick={{ fill: "#666", fontSize: 10 }}
              tickLine={{ stroke: "#666" }}
              domain={["auto", "auto"]}
              width={window.innerWidth < 640 ? 40 : 60}
              tickFormatter={(value) =>
                window.innerWidth < 640
                  ? `${(value / 1000).toFixed(0)}k`
                  : value.toLocaleString(undefined, { maximumFractionDigits: 0 })
              }
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: "#222", 
                borderColor: "#444",
                fontSize: "12px",
                padding: "8px"
              }}
              itemStyle={{ color: "#ddd" }}
              labelStyle={{ color: "#999" }}
              formatter={(value) =>
                value.toLocaleString(undefined, { maximumFractionDigits: 2 })
              }
              labelFormatter={(label) => {
                const date = new Date(label)
                return date.toLocaleDateString()
              }}
            />
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#22c55e" 
              dot={false} 
              strokeWidth={window.innerWidth < 640 ? 1.5 : 2} 
            />
            <Line 
              type="monotone" 
              dataKey="open" 
              stroke="#ef4444" 
              dot={false} 
              strokeWidth={window.innerWidth < 640 ? 1.5 : 2} 
            />
            <Line 
              type="monotone" 
              dataKey="high" 
              stroke="#eab308" 
              dot={false} 
              strokeWidth={1} 
              opacity={0.7} 
            />
            <Line 
              type="monotone" 
              dataKey="low" 
              stroke="#8b5cf6" 
              dot={false} 
              strokeWidth={1} 
              opacity={0.7} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Chart - Responsive Height */}
      {indicators.volume && (
        <div className="h-[80px] sm:h-[100px] md:h-[120px] mb-3 sm:mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={volumeData} 
              margin={{ 
                top: 5, 
                right: 10, 
                left: 5, 
                bottom: 5 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="date"
                stroke="#666"
                tick={{ fill: "#666", fontSize: 10 }}
                tickLine={{ stroke: "#666" }}
                interval="preserveStartEnd"
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return window.innerWidth < 640 
                    ? `${date.getDate()}` 
                    : `${date.getDate()}/${date.getMonth() + 1}`
                }}
              />
              <YAxis 
                stroke="#666" 
                tick={{ fill: "#666", fontSize: 10 }} 
                tickLine={{ stroke: "#666" }} 
                width={window.innerWidth < 640 ? 40 : 60}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "#222", 
                  borderColor: "#444",
                  fontSize: "12px",
                  padding: "8px"
                }}
                itemStyle={{ color: "#ddd" }}
                labelStyle={{ color: "#999" }}
              />
              <Area type="monotone" dataKey="volume" stroke="#3b82f6" fill="#3b82f680" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Indicators - Responsive Layout */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center sm:justify-start">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400 rounded-full" />
          <span className="text-xs text-gray-400">ADL 104.23</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full" />
          <span className="text-xs text-gray-400">RSI 73.31</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-400 rounded-full" />
          <span className="text-xs text-gray-400">MACD 0.31</span>
        </div>
      </div>
    </div>
  )
}