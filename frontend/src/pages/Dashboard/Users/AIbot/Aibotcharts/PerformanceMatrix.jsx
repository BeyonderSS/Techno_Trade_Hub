import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "@/components/ui/chart"

// Generate performance data
const generatePerformanceData = () => {
  const data = []
  let value = 25000

  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    const change = Math.random() * 400 - 150 + (i > 15 ? 50 : 100)
    value += change

    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(value),
    })
  }

  return data
}

const performanceData = generatePerformanceData()

export function PerformanceMetrics() {
  const startValue = performanceData[0].value
  const currentValue = performanceData[performanceData.length - 1].value
  const totalProfit = currentValue - startValue
  const profitPercentage = (currentValue / startValue - 1) * 100

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="p-3 sm:p-6 pb-0">
        <CardTitle className="text-sm sm:text-base">Performance</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-xs text-gray-400">Total Profit</p>
            <p className="text-lg font-bold text-emerald-400">+{totalProfit.toLocaleString()} USDT</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">ROI</p>
            <p className="text-lg font-bold text-emerald-400">+{profitPercentage.toFixed(2)}%</p>
          </div>
        </div>

        <div className="h-32 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <XAxis dataKey="date" hide={true} />
              <YAxis hide={true} domain={["dataMin - 1000", "dataMax + 1000"]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "0.375rem" }}
                labelFormatter={(label) => {
                  const date = new Date(label)
                  return date.toLocaleDateString()
                }}
                formatter={(value) => [`${value.toLocaleString()} USDT`, "Balance"]}
              />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="bg-gray-800 p-2 rounded-md">
            <p className="text-[10px] sm:text-xs text-gray-400">Win Rate</p>
            <p className="text-xs sm:text-sm font-medium text-emerald-400">94.3%</p>
          </div>
          <div className="bg-gray-800 p-2 rounded-md">
            <p className="text-[10px] sm:text-xs text-gray-400">Avg. Profit</p>
            <p className="text-xs sm:text-sm font-medium text-emerald-400">1.8%</p>
          </div>
          <div className="bg-gray-800 p-2 rounded-md">
            <p className="text-[10px] sm:text-xs text-gray-400">Total Trades</p>
            <p className="text-xs sm:text-sm font-medium text-white">142</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
