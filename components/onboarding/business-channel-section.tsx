"use client"

import { Store, Globe, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface BusinessChannelSectionProps {
  storeName: string
  setStoreName: (value: string) => void
  websiteUrl: string
  setWebsiteUrl: (value: string) => void
  selectedChannels: string[]
  toggleChannel: (channelId: string) => void
}

const channels = [
  {
    id: "naver",
    name: "네이버 스마트스토어",
    logo: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#03C75A">
        <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z" />
      </svg>
    ),
  },
  {
    id: "coupang",
    name: "쿠팡",
    logo: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#F03D1F">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 16.394c-1.606 1.606-3.751 2.49-6.044 2.49s-4.438-.884-6.044-2.49c-.28-.28-.28-.735 0-1.015.28-.28.735-.28 1.015 0 1.335 1.335 3.11 2.07 5.029 2.07s3.694-.735 5.029-2.07c.28-.28.735-.28 1.015 0 .28.28.28.735 0 1.015zM8.5 10.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm7 0c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5z" />
      </svg>
    ),
  },
  {
    id: "kakao",
    name: "카카오톡",
    logo: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#3C1E1E">
        <path d="M12 3C6.477 3 2 6.463 2 10.736c0 2.755 1.809 5.175 4.535 6.545-.197.738-1.269 4.75-1.301 5.037 0 0-.025.199.105.275.13.076.284.02.284.02.374-.053 4.334-2.82 5.016-3.299.439.065.895.098 1.361.098 5.523 0 10-3.463 10-7.676S17.523 3 12 3z" />
      </svg>
    ),
  },
  {
    id: "email",
    name: "이메일",
    logo: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
]

export function BusinessChannelSection({
  storeName,
  setStoreName,
  websiteUrl,
  setWebsiteUrl,
  selectedChannels,
  toggleChannel,
}: BusinessChannelSectionProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Store className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">사업체 및 채널 설정</h2>
          <p className="text-sm text-muted-foreground">스토어 정보와 연동할 채널을 선택해주세요</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="store-name" className="text-sm font-medium text-card-foreground">
            스토어 이름
          </Label>
          <div className="relative">
            <Store className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="store-name"
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="예: 행복한 생활용품점"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website-url" className="text-sm font-medium text-card-foreground">
            웹사이트 URL
          </Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="website-url"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://www.example.com"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-card-foreground">연동 채널 선택</Label>
          <p className="text-xs text-muted-foreground">CS-Xit을 연결할 판매 채널을 선택해주세요 (복수 선택 가능)</p>
          <div className="grid grid-cols-2 gap-3">
            {channels.map((channel) => {
              const isSelected = selectedChannels.includes(channel.id)

              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => toggleChannel(channel.id)}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:border-muted-foreground/30 hover:bg-muted/50"
                  )}
                >
                  {isSelected && (
                    <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">{channel.logo}</div>
                  <span className="text-sm font-medium text-card-foreground">{channel.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
