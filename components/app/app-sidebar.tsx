"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Ticket, Settings, CreditCard, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  match: (pathname: string) => boolean
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "대시보드", href: "/dashboard", match: (pathname) => pathname === "/dashboard" },
  { icon: Ticket, label: "티켓 목록", href: "/dashboard", match: (pathname) => pathname.startsWith("/tickets/") },
  { icon: Settings, label: "설정", href: "/", match: (pathname) => pathname === "/" },
  { icon: CreditCard, label: "구독 관리", href: "/dashboard", match: () => false },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">CS</span>
        </div>
        {!collapsed && <span className="text-lg font-bold tracking-tight">CS-Xit</span>}
      </div>

      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = item.match(pathname)

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg py-2 transition-colors hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  )
}
