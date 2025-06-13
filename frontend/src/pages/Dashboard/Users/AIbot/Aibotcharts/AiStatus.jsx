import { Progress } from "@/components/ui/progress"
import { BrainCircuit, Zap } from "lucide-react"

export function AiStatus({ progress, nextTradeTime }) {
  return (
    <div className="p-3 sm:p-6 space-y-3 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-emerald-400" />
          <span className="text-xs sm:text-sm font-medium">AI Engine Status</span>
        </div>
        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Active</span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Analyzing market data...</span>
          <span className="text-emerald-400">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5 bg-gray-800" indicatorClassName="bg-emerald-500" />
      </div>

      <div className="flex items-center justify-between text-xs sm:text-sm pt-2">
        <div className="flex items-center gap-1.5">
          <Zap className="h-3 w-3 text-yellow-400" />
          <span className="text-gray-300">Next trade in:</span>
        </div>
        <span className="font-mono bg-gray-800 px-2 py-0.5 rounded text-yellow-400">
          {Math.floor(nextTradeTime / 60)}:{(nextTradeTime % 60).toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}
