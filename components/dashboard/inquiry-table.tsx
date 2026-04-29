"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { getApiBaseUrl } from "@/lib/api"
import type { Channel, Status } from "@/lib/inquiries"

interface InquirySummary {
  id: string | number
  channel: Channel
  customerName: string
  title: string
  status: Status
  elapsedTime: string
}

const channelConfig: Record<Channel, { name: string; color: string; icon: React.ReactNode }> = {
  naver: {
    name: "네이버",
    color: "bg-[#03C75A]",
    icon: (
      <svg viewBox="0 0 20 20" className="w-4 h-4" fill="white">
        <path d="M13.39 10.55L6.26 2H2v16h4.61V9.45L13.74 18H18V2h-4.61v8.55z" />
      </svg>
    ),
  },
  coupang: {
    name: "쿠팡",
    color: "bg-[#E31837]",
    icon: (
      <svg viewBox="0 0 20 20" className="w-4 h-4" fill="white">
        <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.5 11.5c-.83.83-2.17.83-3 0L10 13l-.5.5c-.83.83-2.17.83-3 0-.83-.83-.83-2.17 0-3L10 7l3.5 3.5c.83.83.83 2.17 0 3z" />
      </svg>
    ),
  },
  kakao: {
    name: "카카오",
    color: "bg-[#FEE500]",
    icon: (
      <svg viewBox="0 0 20 20" className="w-4 h-4" fill="#3C1E1E">
        <path d="M10 3c-4.418 0-8 2.91-8 6.5 0 2.347 1.566 4.407 3.922 5.563l-.964 3.487a.3.3 0 0 0 .451.336l4.044-2.66c.177.012.356.024.547.024 4.418 0 8-2.91 8-6.5S14.418 3 10 3z" />
      </svg>
    ),
  },
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  new: { label: "신규", className: "bg-status-new text-white hover:bg-status-new/90" },
  progress: { label: "진행 중", className: "bg-status-progress text-white hover:bg-status-progress/90" },
  waiting: { label: "대기 중", className: "bg-status-waiting text-white hover:bg-status-waiting/90" },
  complete: { label: "완료", className: "bg-status-complete text-white hover:bg-status-complete/90" },
}

function ChannelBadge({ channel }: { channel: Channel }) {
  const config = channelConfig[channel]
  return (
    <div className={cn("flex items-center justify-center w-7 h-7 rounded-lg", config.color)}>
      {config.icon}
    </div>
  )
}

function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status]
  return (
    <Badge className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  )
}

export function InquiryTable() {
  const router = useRouter()
  const [inquiries, setInquiries] = useState<InquirySummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadInquiries() {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/inquiries`, {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("Failed to load inquiries")
        }

        const data = (await response.json()) as { items: InquirySummary[] }
        if (active) {
          setInquiries(data.items)
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadInquiries()

    return () => {
      active = false
    }
  }, [])

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">최근 문의 내역</CardTitle>
          <span className="text-sm text-muted-foreground">총 {inquiries.length}건</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">문의 데이터를 불러오는 중입니다...</div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-20 text-center">채널</TableHead>
              <TableHead className="w-28">고객명</TableHead>
              <TableHead>문의 제목</TableHead>
              <TableHead className="w-24 text-center">상태</TableHead>
              <TableHead className="w-32 text-right">경과 시간</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow
                key={inquiry.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => router.push(`/tickets/${String(inquiry.id)}`)}
              >
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <ChannelBadge channel={inquiry.channel} />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{inquiry.customerName}</TableCell>
                <TableCell className="text-muted-foreground">{inquiry.title}</TableCell>
                <TableCell className="text-center">
                  <StatusBadge status={inquiry.status} />
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {inquiry.elapsedTime}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  )
}
