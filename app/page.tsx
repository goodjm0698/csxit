"use client"

import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { OnboardingHeader } from "@/components/onboarding/header"
import { BusinessChannelSection } from "@/components/onboarding/business-channel-section"
import { AIPolicySection } from "@/components/onboarding/ai-policy-section"
import { OnboardingFooter } from "@/components/onboarding/footer"
import { getApiBaseUrl } from "@/lib/api"

type ResponseStyle = "friendly" | "formal" | "professional"

interface StoreSettingsPayload {
  storeName: string
  websiteUrl: string
  channels: string[]
  responseStyle: ResponseStyle
  storePolicy: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [storeName, setStoreName] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [responseStyle, setResponseStyle] = useState<ResponseStyle | "">("")
  const [storePolicy, setStorePolicy] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const toggleChannel = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId]
    )
  }

  useEffect(() => {
    let active = true

    async function loadInitialSettings() {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/store-settings`, {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("Failed to load settings")
        }

        const data = (await response.json()) as { item: StoreSettingsPayload | null }
        if (!active || !data.item) {
          return
        }

        setStoreName(data.item.storeName ?? "")
        setWebsiteUrl(data.item.websiteUrl ?? "")
        setSelectedChannels(Array.isArray(data.item.channels) ? data.item.channels : [])
        setResponseStyle(data.item.responseStyle ?? "")
        setStorePolicy(data.item.storePolicy ?? "")
      } catch (error) {
        console.error(error)
      } finally {
        if (active) {
          setIsLoadingInitial(false)
        }
      }
    }

    loadInitialSettings()

    return () => {
      active = false
    }
  }, [])

  const canSubmit = useMemo(() => {
    return (
      storeName.trim().length > 0 &&
      websiteUrl.trim().length > 0 &&
      selectedChannels.length > 0 &&
      responseStyle.trim().length > 0 &&
      storePolicy.trim().length > 0
    )
  }, [storeName, websiteUrl, selectedChannels, responseStyle, storePolicy])

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) {
      setErrorMessage("필수 항목을 모두 입력해주세요.")
      return
    }

    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/store-settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeName,
          websiteUrl,
          channels: selectedChannels,
          responseStyle,
          storePolicy,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      router.push("/dashboard")
    } catch (error) {
      console.error(error)
      setErrorMessage("저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <OnboardingHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">스토어 설정을 시작해보세요</h1>
          <p className="mt-2 text-muted-foreground">
            CS-Xit이 고객 문의에 정확하게 응대할 수 있도록 정보를 입력해주세요
          </p>
          {isLoadingInitial && (
            <p className="mt-3 text-xs text-muted-foreground">기존 설정을 불러오는 중입니다...</p>
          )}
          {errorMessage && <p className="mt-3 text-sm text-destructive">{errorMessage}</p>}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <BusinessChannelSection
            storeName={storeName}
            setStoreName={setStoreName}
            websiteUrl={websiteUrl}
            setWebsiteUrl={setWebsiteUrl}
            selectedChannels={selectedChannels}
            toggleChannel={toggleChannel}
          />
          <AIPolicySection
            responseStyle={responseStyle}
            setResponseStyle={setResponseStyle}
            storePolicy={storePolicy}
            setStorePolicy={setStorePolicy}
          />
        </div>

        <OnboardingFooter onSubmit={handleSubmit} disabled={!canSubmit || isSubmitting} />
      </main>
    </div>
  )
}
