"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/ui/Header"

export default function AnalyzePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [originalResponse, setOriginalResponse] = useState("")
  const [context, setContext] = useState("")
  const [selectedModels, setSelectedModels] = useState<string[]>(["gpt5", "claude"])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [creditCost, setCreditCost] = useState(10)
  const [creditsBalance, setCreditsBalance] = useState<number | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      // Fetch credits balance
      const fetchCredits = async () => {
        // @ts-expect-error - 커스텀 프로퍼티
        const backendToken = session?.user?.backendAccessToken
        if (!backendToken) return

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/credits/balance`, {
            headers: {
              "Authorization": `Bearer ${backendToken}`
            }
          })
          const data = await response.json()
          setCreditsBalance(data.balance)
        } catch (error) {
          console.error("Failed to fetch credits:", error)
        }
      }

      fetchCredits()
    }
  }, [status, router, session])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const models = [
    { id: "gpt5", name: "GPT-5", description: "회의적인 투자자" },
    { id: "claude", name: "Claude", description: "경쟁사 분석가" },
    { id: "gemini", name: "Gemini", description: "시장 조사원" },
  ]

  const toggleModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      if (selectedModels.length > 1) {
        setSelectedModels(selectedModels.filter(m => m !== modelId))
      }
    } else {
      setSelectedModels([...selectedModels, modelId])
    }
  }

  const handleAnalyze = async () => {
    if (!originalResponse.trim()) {
      alert("분석할 AI 응답을 입력해주세요")
      return
    }

    // @ts-expect-error - 커스텀 프로퍼티
    const backendToken = session?.user?.backendAccessToken
    if (!backendToken) {
      alert("인증이 필요합니다. 다시 로그인해주세요.")
      router.push("/login")
      return
    }

    setIsAnalyzing(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${backendToken}`
        },
        body: JSON.stringify({
          original_response: originalResponse,
          context: context || null,
          models: selectedModels,
        }),
      })

      const data = await response.json()

      if (data.analysis_id) {
        // Refresh credits balance before navigating
        try {
          const creditsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/credits/balance`, {
            headers: {
              "Authorization": `Bearer ${backendToken}`
            }
          })
          const creditsData = await creditsResponse.json()
          setCreditsBalance(creditsData.balance)
        } catch (error) {
          console.error("Failed to refresh credits:", error)
        }

        window.location.href = `/results/${data.analysis_id}`
      }
    } catch (error) {
      console.error("Analysis failed:", error)
      alert("분석에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" />
          홈으로 돌아가기
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">현실성 검증 분석</h1>
            <p className="text-gray-400">
              AI가 생성한 응답을 붙여넣으면 진실을 밝혀드립니다
            </p>
          </div>

          {/* Credit Balance */}
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">보유 크레딧</p>
                <p className="text-2xl font-bold">
                  {creditsBalance !== null ? creditsBalance : "로딩 중..."}
                </p>
              </div>
              <Link href="/credits">
                <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                  크레딧 구매
                </Button>
              </Link>
            </div>
          </div>

          {/* Main Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">분석할 AI 응답 *</label>
            <Textarea
              placeholder="AI가 생성한 응답을 여기에 붙여넣으세요 (ChatGPT, Claude 등)..."
              value={originalResponse}
              onChange={(e) => setOriginalResponse(e.target.value)}
              className="min-h-[200px] bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-600"
            />
            <p className="text-xs text-gray-500">
              {originalResponse.length}자
            </p>
          </div>

          {/* Context Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">컨텍스트 (선택사항)</label>
            <Input
              placeholder="AI에게 무엇을 물어봤나요? (더 나은 분석을 위해 도움이 됩니다)"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-600"
            />
          </div>

          {/* Model Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">분석 모델 선택</label>
            <div className="grid gap-3">
              {models.map((model) => (
                <div
                  key={model.id}
                  onClick={() => toggleModel(model.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedModels.includes(model.id)
                      ? "border-red-600 bg-red-600/10"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedModels.includes(model.id)
                          ? "border-red-600 bg-red-600"
                          : "border-zinc-700"
                      }`}
                    >
                      {selectedModels.includes(model.id) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{model.name}</p>
                      <p className="text-sm text-gray-400">{model.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              더 많은 모델 = 더 종합적인 분석 (하지만 비용 증가)
            </p>
          </div>

          {/* Cost Preview */}
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <div className="flex justify-between items-center">
              <p className="text-gray-400">예상 비용</p>
              <p className="text-2xl font-bold text-red-500">{creditCost} 크레딧</p>
            </div>
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !originalResponse.trim()}
            className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                현실성 검증 진행 중...
              </>
            ) : (
              "현실성 검증 시작"
            )}
          </Button>

          <p className="text-xs text-center text-gray-500">
            분석은 일반적으로 20-30초 정도 소요됩니다
          </p>
        </div>
      </div>
    </div>
  )
}
