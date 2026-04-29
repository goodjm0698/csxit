"use client"

import { Crown, Phone, Mail, Calendar, ShoppingBag, MessageSquare, ChevronRight, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Inquiry } from "@/lib/inquiries"

interface CustomerPanelProps {
  inquiry: Inquiry
}

export function CustomerPanel({ inquiry }: CustomerPanelProps) {
  return (
    <div className="p-5">
      <h2 className="mb-4 text-lg font-semibold text-foreground">고객 정보</h2>

      <div className="mb-6 rounded-xl bg-secondary p-4">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[oklch(0.55_0.15_250)]">
            <span className="text-lg font-semibold text-white">{inquiry.customerInitial}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{inquiry.customerName}</h3>
              <Badge className="gap-1 border-0 bg-[oklch(0.95_0.08_85)] text-xs font-medium text-[oklch(0.50_0.15_85)]">
                <Crown className="h-3 w-3" />
                {inquiry.customerTier}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">회원번호: {inquiry.memberId}</p>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <span className="text-foreground">{inquiry.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <span className="text-foreground">{inquiry.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">가입일:</span>
            <span className="text-foreground">{inquiry.joinedAt}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-card p-3 text-center">
            <p className="text-lg font-bold text-[oklch(0.55_0.15_250)]">{inquiry.totalSpent}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">총 구매금액</p>
          </div>
          <div className="rounded-lg bg-card p-3 text-center">
            <p className="text-xl font-bold text-foreground">{inquiry.totalOrders}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">총 주문건수</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            이전 구매 내역
          </h3>
          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs font-medium text-primary hover:text-primary/80">
            전체보기
            <ChevronRight className="ml-0.5 h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-2">
          {inquiry.purchaseHistory.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer rounded-lg bg-secondary p-3 transition-colors hover:bg-secondary/80"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.date}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="whitespace-nowrap text-sm font-medium text-foreground">{item.price}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            과거 상담 이력
          </h3>
          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs font-medium text-primary hover:text-primary/80">
            전체보기
            <ChevronRight className="ml-0.5 h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-2">
          {inquiry.consultHistory.length > 0 ? (
            inquiry.consultHistory.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer rounded-lg bg-secondary p-3 transition-colors hover:bg-secondary/80"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground transition-colors group-hover:text-primary">
                      {item.subject}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <Badge className="flex-shrink-0 border-0 bg-[oklch(0.92_0.05_155)] text-xs font-medium text-[oklch(0.45_0.12_155)]">
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
              이전 상담 이력이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
