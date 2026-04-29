"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MessageSquare } from "lucide-react"

interface QuotaWidgetProps {
  used: number
  total: number
}

export function QuotaWidget({ used = 15, total = 20 }: QuotaWidgetProps) {
  const percentage = (used / total) * 100
  const isNearLimit = percentage >= 80

  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-foreground">무료 답변 사용량</span>
              <span className={`text-sm font-bold ${isNearLimit ? "text-status-progress" : "text-primary"}`}>
                {used}/{total}
              </span>
            </div>
            <Progress 
              value={percentage} 
              className={`h-2 ${isNearLimit ? "[&>[data-slot=progress-indicator]]:bg-status-progress" : ""}`}
            />
            {isNearLimit && (
              <p className="text-xs text-status-progress mt-1.5">
                무료 한도가 거의 소진되었습니다
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
