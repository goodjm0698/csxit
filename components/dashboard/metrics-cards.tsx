"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Play, Clock, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getApiBaseUrl } from "@/lib/api"

interface MetricCardProps {
  title: string
  count: number
  icon: React.ElementType
  color: "new" | "progress" | "waiting" | "complete"
  trend?: {
    value: number
    isUp: boolean
  }
}

const colorStyles = {
  new: {
    bg: "bg-status-new/10",
    border: "border-status-new/20",
    icon: "bg-status-new text-white",
    text: "text-status-new",
  },
  progress: {
    bg: "bg-status-progress/10",
    border: "border-status-progress/20",
    icon: "bg-status-progress text-white",
    text: "text-status-progress",
  },
  waiting: {
    bg: "bg-status-waiting/10",
    border: "border-status-waiting/20",
    icon: "bg-status-waiting text-white",
    text: "text-status-waiting",
  },
  complete: {
    bg: "bg-status-complete/10",
    border: "border-status-complete/20",
    icon: "bg-status-complete text-white",
    text: "text-status-complete",
  },
}

function MetricCard({ title, count, icon: Icon, color, trend }: MetricCardProps) {
  const styles = colorStyles[color]

  return (
    <Card className={cn("border", styles.border, styles.bg)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn("text-3xl font-bold mt-1", styles.text)}>{count}</p>
            {trend && (
              <p className="text-xs text-muted-foreground mt-2">
                전일 대비{" "}
                <span className={trend.isUp ? "text-status-complete" : "text-destructive"}>
                  {trend.isUp ? "+" : "-"}{trend.value}%
                </span>
              </p>
            )}
          </div>
          <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg", styles.icon)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MetricsCards() {
  const [counts, setCounts] = useState({
    new: 0,
    progress: 0,
    waiting: 0,
    complete: 0,
  })

  useEffect(() => {
    let active = true

    async function loadMetrics() {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/inquiries/metrics`, {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("Failed to load inquiry metrics")
        }

        const data = (await response.json()) as {
          new: number
          progress: number
          waiting: number
          complete: number
        }

        if (active) {
          setCounts(data)
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadMetrics()

    return () => {
      active = false
    }
  }, [])

  const metrics: MetricCardProps[] = useMemo(
    () => [
      { title: "신규", count: counts.new, icon: Plus, color: "new" },
      { title: "진행 중", count: counts.progress, icon: Play, color: "progress" },
      { title: "대기 중", count: counts.waiting, icon: Clock, color: "waiting" },
      { title: "완료", count: counts.complete, icon: CheckCircle2, color: "complete" },
    ],
    [counts]
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  )
}
