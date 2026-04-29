"use client"

import { Search, Bell, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-card border-b border-border">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="티켓, 고객, 키워드 검색..."
          className="pl-10 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      {/* Revenue Widget */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <TrendingUp className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">이번 달 매출 전환 수익</p>
            <p className="text-lg font-bold text-primary">120,000원</p>
          </div>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium">관리자</p>
            <p className="text-xs text-muted-foreground">admin@csxit.com</p>
          </div>
          <Avatar className="w-9 h-9">
            <AvatarImage src="/placeholder-user.jpg" alt="관리자" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">관</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
