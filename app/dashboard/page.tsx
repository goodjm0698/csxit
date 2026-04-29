import { AppSidebar } from "@/components/app/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { InquiryTable } from "@/components/dashboard/inquiry-table"
import { QuotaWidget } from "@/components/dashboard/quota-widget"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <div className="flex flex-1 flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">대시보드</h1>
                <p className="mt-1 text-sm text-muted-foreground">고객 문의 현황을 한눈에 확인하세요</p>
              </div>
              <QuotaWidget used={15} total={20} />
            </div>

            <MetricsCards />
            <InquiryTable />
          </div>
        </main>

        <footer className="border-t border-border bg-card px-6 py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2026 CS-Xit. 모든 권리 보유.</p>
            <p>수수료 모델: 매출 전환 시 2% 적용</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
