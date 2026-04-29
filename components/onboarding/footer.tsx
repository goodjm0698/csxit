"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OnboardingFooterProps {
  onSubmit: () => void
  disabled?: boolean
}

export function OnboardingFooter({ onSubmit, disabled = false }: OnboardingFooterProps) {
  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <Button
        size="lg"
        onClick={onSubmit}
        disabled={disabled}
        className="w-full max-w-md bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
      >
        설정 완료 및 시작하기
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      <p className="text-center text-xs text-muted-foreground">설정은 나중에 언제든지 변경할 수 있습니다</p>
    </div>
  )
}
