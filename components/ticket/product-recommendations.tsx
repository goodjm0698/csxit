"use client"

import { useState } from "react"
import { TrendingUp, Link2, Check, Star, Sparkles, ChevronRight, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const recommendedProducts = [
  {
    id: 1,
    name: "프리미엄 이어폰 케이스",
    description: "충격 방지 실리콘 소재, 무선 충전 호환",
    price: "29,000",
    originalPrice: "39,000",
    discount: "25%",
    rating: 4.8,
    reviews: 324,
    tag: "베스트셀러",
    reason: "현재 문의 제품과 호환",
  },
  {
    id: 2,
    name: "고급 이어팁 세트 (6쌍)",
    description: "메모리폼 소재, S/M/L 사이즈 포함",
    price: "19,000",
    originalPrice: "25,000",
    discount: "24%",
    rating: 4.9,
    reviews: 567,
    tag: "추천",
    reason: "VIP 고객 선호 제품",
  },
]

export function ProductRecommendations() {
  const [insertedLinks, setInsertedLinks] = useState<number[]>([])

  const handleInsertLink = (productId: number) => {
    if (!insertedLinks.includes(productId)) {
      setInsertedLinks([...insertedLinks, productId])
    }
  }

  return (
    <div className="p-5">
      <div className="mb-5">
        <div className="mb-1 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.95_0.08_85)]">
            <TrendingUp className="h-5 w-5 text-[oklch(0.55_0.15_85)]" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">매출 전환 상품 추천</h2>
            <p className="text-xs text-muted-foreground">이 고객에게 적합한 상품을 답변에 추가하세요</p>
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-[oklch(0.85_0.08_250)] bg-[oklch(0.96_0.03_250)] p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-[oklch(0.55_0.15_250)]" />
          <div>
            <p className="text-sm font-medium text-foreground">AI 추천 인사이트</p>
            <p className="mt-1 text-xs text-muted-foreground">
              이 고객은 액세서리 구매 확률이 <span className="font-semibold text-[oklch(0.55_0.15_250)]">78%</span>로 높습니다
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {recommendedProducts.map((product) => {
          const isInserted = insertedLinks.includes(product.id)

          return (
            <div
              key={product.id}
              className="overflow-hidden rounded-xl border border-border bg-secondary transition-colors hover:border-primary/30"
            >
              <div className="relative flex h-32 items-center justify-center bg-muted">
                <Package className="h-10 w-10 text-muted-foreground/30" />
                <Badge
                  className={cn(
                    "absolute left-2 top-2 border-0 text-xs font-medium",
                    product.tag === "베스트셀러"
                      ? "bg-[oklch(0.95_0.08_85)] text-[oklch(0.50_0.15_85)]"
                      : "bg-[oklch(0.92_0.05_250)] text-[oklch(0.50_0.15_250)]"
                  )}
                >
                  {product.tag}
                </Badge>
                <Badge className="absolute right-2 top-2 border-0 bg-[oklch(0.60_0.20_25)] text-xs font-medium text-white">
                  {product.discount} 할인
                </Badge>
              </div>

              <div className="p-4">
                <h3 className="mb-1 line-clamp-1 text-sm font-semibold text-foreground">{product.name}</h3>
                <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>

                <div className="mb-3 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-[oklch(0.75_0.15_85)] text-[oklch(0.75_0.15_85)]" />
                  <span className="text-xs font-semibold text-foreground">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>

                <div className="mb-3 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-foreground">{product.price}원</span>
                  <span className="text-sm text-muted-foreground line-through">{product.originalPrice}원</span>
                </div>

                <div className="mb-4 flex items-center gap-1.5 text-xs text-[oklch(0.50_0.15_250)]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="font-medium">{product.reason}</span>
                </div>

                <Button
                  className={cn(
                    "w-full gap-2 font-medium transition-all",
                    isInserted
                      ? "bg-[oklch(0.92_0.05_155)] text-[oklch(0.45_0.12_155)] hover:bg-[oklch(0.90_0.06_155)]"
                      : "bg-[oklch(0.55_0.15_250)] text-white hover:bg-[oklch(0.50_0.15_250)]"
                  )}
                  onClick={() => handleInsertLink(product.id)}
                  disabled={isInserted}
                >
                  {isInserted ? (
                    <>
                      <Check className="h-4 w-4" />
                      링크가 추가됨
                    </>
                  ) : (
                    <>
                      <Link2 className="h-4 w-4" />
                      답변에 링크 삽입
                    </>
                  )}
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <Button variant="ghost" className="mt-4 w-full gap-1 text-muted-foreground hover:text-foreground">
        더 많은 추천 상품 보기
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="mt-6 rounded-xl bg-secondary p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">이번 달 전환 성과</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-card p-3 text-center">
            <p className="text-xl font-bold text-[oklch(0.55_0.15_250)]">23건</p>
            <p className="mt-0.5 text-xs text-muted-foreground">링크 클릭</p>
          </div>
          <div className="rounded-lg bg-card p-3 text-center">
            <p className="text-xl font-bold text-foreground">8건</p>
            <p className="mt-0.5 text-xs text-muted-foreground">실제 구매</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm text-muted-foreground">전환율</span>
          <span className="text-sm font-bold text-[oklch(0.55_0.15_155)]">34.8%</span>
        </div>
      </div>
    </div>
  )
}
