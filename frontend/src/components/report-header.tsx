import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"

interface ReportHeaderProps {
  title: string
  description: string
  stats?: {
    label: string
    value: string | number
    change?: string
    icon?: React.ReactNode
  }[]
}

export default function ReportHeader({ title, description, stats }: ReportHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    {stat.change && (
                      <p className={`text-xs ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                        {stat.change} from previous period
                      </p>
                    )}
                  </div>
                  {stat.icon && (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">{stat.icon}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
