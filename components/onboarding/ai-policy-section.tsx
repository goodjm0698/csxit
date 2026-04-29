"use client"

import { Sparkles, FileText } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AIPolicySectionProps {
  responseStyle: string
  setResponseStyle: (value: "friendly" | "formal" | "professional") => void
  storePolicy: string
  setStorePolicy: (value: string) => void
}

const responseStyles = [
  { value: "friendly", label: "친절한", description: "따뜻하고 친근한 톤으로 응대" },
  { value: "formal", label: "격식있는", description: "정중하고 예의 바른 톤으로 응대" },
  { value: "professional", label: "전문적인", description: "전문적이고 신뢰감 있는 톤으로 응대" },
]

const policyPlaceholder = `예시:

[환불 규정]
- 상품 수령 후 7일 이내 환불 가능
- 사용 흔적이 있는 경우 환불 불가
- 단순 변심의 경우 왕복 배송비 고객 부담

[배송 지연 정책]
- 주문 후 영업일 기준 2-3일 내 발송
- 재고 부족 시 개별 연락 후 발송 일정 안내
- 천재지변으로 인한 지연 시 사전 공지

[교환 정책]
- 상품 하자 시 무료 교환
- 단순 변심 교환 시 추가 배송비 발생`

export function AIPolicySection({
  responseStyle,
  setResponseStyle,
  storePolicy,
  setStorePolicy,
}: AIPolicySectionProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">AI 초개인화 및 정책 설정</h2>
          <p className="text-sm text-muted-foreground">AI가 고객에게 응대하는 방식을 설정해주세요</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="response-style" className="text-sm font-medium text-card-foreground">
            답변 스타일
          </Label>
          <Select value={responseStyle} onValueChange={setResponseStyle}>
            <SelectTrigger id="response-style" className="w-full">
              <SelectValue placeholder="답변 스타일을 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {responseStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{style.label}</span>
                    <span className="text-xs text-muted-foreground">{style.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="store-policy" className="text-sm font-medium text-card-foreground">
              스토어 정책 입력
            </Label>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span>환불 규정, 배송 지연 정책 등</span>
            </div>
          </div>
          <Textarea
            id="store-policy"
            value={storePolicy}
            onChange={(e) => setStorePolicy(e.target.value)}
            placeholder={policyPlaceholder}
            className="h-64 resize-none font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            입력하신 정책은 AI가 고객 문의에 응대할 때 참고합니다. 자세할수록 정확한 응대가 가능합니다.
          </p>
        </div>
      </div>
    </div>
  )
}
