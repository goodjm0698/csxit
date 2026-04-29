import { notFound } from "next/navigation"
import { AppSidebar } from "@/components/app/app-sidebar"
import { TicketHeader } from "@/components/ticket/ticket-header"
import { CustomerPanel } from "@/components/ticket/customer-panel"
import { ConversationThread } from "@/components/ticket/conversation-thread"
import { ProductRecommendations } from "@/components/ticket/product-recommendations"
import { getApiBaseUrl } from "@/lib/api"
import type { Inquiry } from "@/lib/inquiries"

export const dynamic = "force-dynamic"

interface TicketPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TicketPage({ params }: TicketPageProps) {
  const { id } = await params

  const response = await fetch(`${getApiBaseUrl()}/api/inquiries/${id}`, {
    cache: "no-store",
  })

  if (response.status === 404) {
    notFound()
  }

  if (!response.ok) {
    throw new Error("Failed to load inquiry")
  }

  const inquiry = (await response.json()) as Inquiry

  if (!inquiry) {
    notFound()
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <div className="flex flex-1 flex-col">
        <TicketHeader inquiry={inquiry} />

        <main className="flex flex-1 overflow-hidden">
          <aside className="w-[280px] min-w-[280px] overflow-y-auto border-r border-border bg-card">
            <CustomerPanel inquiry={inquiry} />
          </aside>

          <section className="flex-1 overflow-y-auto bg-background">
            <ConversationThread inquiry={inquiry} />
          </section>

          <aside className="w-[320px] min-w-[300px] overflow-y-auto border-l border-border bg-card">
            <ProductRecommendations />
          </aside>
        </main>
      </div>
    </div>
  )
}
