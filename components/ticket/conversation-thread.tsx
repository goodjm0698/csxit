"use client"

import { useState } from "react"
import { Sparkles, Send, Pencil, RefreshCw, Paperclip, Image as ImageIcon, Smile, Clock, CheckCheck, Crown, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Inquiry } from "@/lib/inquiries"

interface ConversationThreadProps {
  inquiry: Inquiry
}

export function ConversationThread({ inquiry }: ConversationThreadProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftText, setDraftText] = useState(inquiry.aiDraft)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleRegenerate = () => {
    setIsRegenerating(true)
    setTimeout(() => {
      setDraftText(inquiry.aiDraft)
      setIsRegenerating(false)
    }, 1200)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-3">
              <h1 className="text-lg font-semibold text-foreground">{inquiry.title}</h1>
              <Badge className="gap-1 border-0 bg-[oklch(0.95_0.05_25)] text-xs font-medium text-[oklch(0.55_0.15_25)]">
                <Clock className="h-3 w-3" />
                {inquiry.status === "complete" ? "완료" : "대기중"}
              </Badge>
              <Badge className="gap-1 border-0 bg-[oklch(0.92_0.05_250)] text-xs font-medium text-[oklch(0.50_0.15_250)]">
                <Tag className="h-3 w-3" />
                {inquiry.category}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {inquiry.productName} | 주문번호 {inquiry.orderNumber} | 티켓 #{inquiry.ticketNumber}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>응답 대기시간:</span>
            <span className="font-semibold text-foreground">{inquiry.waitTime}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {inquiry.conversation.map((msg) => (
          <div key={msg.id}>
            {msg.type === "customer" ? (
              <div className="flex gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[oklch(0.55_0.15_250)]">
                  <span className="font-semibold text-white">{inquiry.customerInitial}</span>
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-medium text-foreground">{msg.name}</span>
                    <Badge className="gap-1 border-0 bg-[oklch(0.95_0.08_85)] text-xs font-medium text-[oklch(0.50_0.15_85)]">
                      <Crown className="h-3 w-3" />
                      {inquiry.customerTier}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <div className="max-w-[85%] rounded-xl rounded-tl-sm border border-border bg-card p-4 shadow-sm">
                    <p className="leading-relaxed text-foreground">{msg.message}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5">
                  <CheckCheck className="h-3 w-3 text-[oklch(0.55_0.15_155)]" />
                  <span className="text-xs text-muted-foreground">{msg.message}</span>
                  <span className="text-xs text-muted-foreground">| {msg.time}</span>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="mt-8">
          <div className="rounded-xl border-2 border-[oklch(0.80_0.10_250)] bg-[oklch(0.96_0.03_250)] p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.55_0.15_250)]">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI 답변 초안</h3>
                <p className="text-xs text-muted-foreground">스토어 정책 기반 자동 생성</p>
              </div>
              <Badge className="ml-auto border-0 bg-[oklch(0.92_0.05_250)] font-medium text-[oklch(0.50_0.15_250)]">
                자동 생성됨
              </Badge>
            </div>

            {isEditing ? (
              <Textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                className="min-h-[200px] resize-none border-border bg-card text-foreground focus:ring-2 focus:ring-primary"
              />
            ) : (
              <div className="whitespace-pre-wrap rounded-lg border border-border bg-card p-4 leading-relaxed text-foreground">
                {draftText}
              </div>
            )}

            <div className="mt-5 flex items-center gap-3">
              <Button className="gap-2 bg-[oklch(0.55_0.15_250)] px-6 text-white hover:bg-[oklch(0.50_0.15_250)]">
                <Send className="h-4 w-4" />
                답변 전송
              </Button>
              <Button
                variant="outline"
                className={cn("gap-2 border-border hover:bg-secondary", isEditing && "bg-secondary")}
                onClick={() => setIsEditing(!isEditing)}
              >
                <Pencil className="h-4 w-4" />
                {isEditing ? "편집 완료" : "수정하기"}
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-border hover:bg-secondary"
                onClick={handleRegenerate}
                disabled={isRegenerating}
              >
                <RefreshCw className={cn("h-4 w-4", isRegenerating && "animate-spin")} />
                다시 생성
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-card p-4">
        <div className="rounded-xl bg-secondary p-4">
          <Textarea
            placeholder="직접 답변을 입력하거나 AI 초안을 수정하세요..."
            className="max-h-[120px] min-h-[60px] resize-none border-0 bg-transparent p-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
          />
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-card hover:text-foreground">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-card hover:text-foreground">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-card hover:text-foreground">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">Ctrl + Enter로 전송</span>
              <Button size="sm" className="gap-2 bg-[oklch(0.55_0.15_250)] text-white hover:bg-[oklch(0.50_0.15_250)]">
                <Send className="h-4 w-4" />
                전송
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
