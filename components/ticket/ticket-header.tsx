"use client"

import { Search, Bell, TrendingUp, MessageSquare, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Inquiry } from "@/lib/inquiries"

interface TicketHeaderProps {
  inquiry: Inquiry
}

export function TicketHeader({ inquiry }: TicketHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="max-w-md flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="티켓, 고객, 키워드 검색..."
            className="h-9 w-full rounded-lg border-0 bg-secondary pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge className="gap-2 rounded-full bg-[oklch(0.92_0.05_155)] px-4 py-2 text-[oklch(0.40_0.12_155)]">
          <TrendingUp className="h-4 w-4" />
          이번 달 매출 전환 수익 120,000원
        </Badge>

        <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">무료 답변 사용량</span>
          <span className="text-sm font-semibold text-foreground">15/20</span>
        </div>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <div className="flex items-center gap-2 border-l border-border pl-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">관리자</p>
            <p className="text-xs text-muted-foreground">{inquiry.customerName} 티켓 처리 중</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive">
            <User className="h-5 w-5 text-destructive-foreground" />
          </div>
        </div>
      </div>
    </header>
  )
}
