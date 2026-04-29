"use client"

import { cn } from "@/lib/utils"
import { LayoutDashboard, Ticket, Settings, CreditCard, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  active?: boolean
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "대시보드", href: "#", active: true },
  { icon: Ticket, label: "티켓 목록", href: "#" },
  { icon: Settings, label: "설정", href: "#" },
  { icon: CreditCard, label: "구독 관리", href: "#" },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 h-screen sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
          <span className="text-primary-foreground font-bold text-sm">CS</span>
        </div>
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight">CS-Xit</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  item.active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse Button */}
      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  )
}
