"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface AnalysisResult {
  id: string
  original_response: string
  context: string | null
  optimism_bias_score: number
  competitors: Array<{
    name: string
    url: string
    description: string
  }>
  market_size_reality: {
    claimed: string
    actual: string
    notes: string
  }
  feasibility_assessment: {
    technical: string
    financial: string
    timeline: string
  }
  risk_factors: string[]
  final_verdict: {
    score: number
    reasoning: string
  }
  status: string
}

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status !== "authenticated") {
      return
    }

    const fetchResults = async () => {
      // @ts-expect-error - 커스텀 프로퍼티
      const backendToken = session?.user?.backendAccessToken
      if (!backendToken) {
        console.error("No backend token available")
        return
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/analyze/${params.id}`,
          {
            headers: {
              "Authorization": `Bearer ${backendToken}`
            }
          }
        )
        const data = await response.json()
        setResult(data)
      } catch (error) {
        console.error("Failed to fetch results:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchResults()
      const interval = setInterval(fetchResults, 3000)
      return () => clearInterval(interval)
    }
  }, [params.id, session, status, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xl">응답 분석 중...</p>
          <p className="text-gray-400 text-sm">분석에 20-30초 정도 소요됩니다</p>
        </div>
      </div>
    )
  }

  if (!result || result.status === "processing") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xl">분석 진행 중...</p>
        </div>
      </div>
    )
  }

  const getOptimismColor = (score: number) => {
    if (score >= 75) return "text-red-500"
    if (score >= 50) return "text-orange-500"
    if (score >= 25) return "text-yellow-500"
    return "text-green-500"
  }

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-green-500"
    if (score >= 4) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <Link href="/analyze" className="inline-flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            새 분석
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
              <Share2 className="w-4 h-4 mr-2" />
              공유
            </Button>
            <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Optimism Bias Score */}
          <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">낙관 편향 점수</h2>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-zinc-800"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${(result.optimism_bias_score / 100) * 351.86} 351.86`}
                    className={getOptimismColor(result.optimism_bias_score)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getOptimismColor(result.optimism_bias_score)}`}>
                    {result.optimism_bias_score}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-400 mb-2">
                  {result.optimism_bias_score >= 75 && "극도로 낙관적 - 현실과 심각한 괴리"}
                  {result.optimism_bias_score >= 50 && result.optimism_bias_score < 75 && "매우 낙관적 - 주요 우려사항 존재"}
                  {result.optimism_bias_score >= 25 && result.optimism_bias_score < 50 && "다소 낙관적 - 일부 주의 필요"}
                  {result.optimism_bias_score < 25 && "현실적 평가 - 균형잡힌 시각"}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  {result.optimism_bias_score >= 50 ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <span className="text-red-500">높은 수준의 현실성 점검 필요</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">합리적인 기대치</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Original vs Reality */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <h3 className="text-xl font-bold mb-4 text-green-500">원본 AI 응답</h3>
              <div className="text-gray-300 text-sm leading-relaxed max-h-[400px] overflow-y-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.original_response}
                </ReactMarkdown>
              </div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-6 border border-red-500/20">
              <h3 className="text-xl font-bold mb-4 text-red-500">현실성 검증</h3>
              <div className="text-gray-300 text-sm leading-relaxed max-h-[400px] overflow-y-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.final_verdict?.reasoning || "분석 진행 중..."}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Competitor Analysis */}
          <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">경쟁사 분석</h2>
            {result.competitors.length > 0 ? (
              <div className="space-y-4">
                {result.competitors.map((competitor, idx) => (
                  <div key={idx} className="bg-zinc-800 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{competitor.name}</h4>
                        <p className="text-gray-400 text-sm mt-1">{competitor.description}</p>
                      </div>
                      <a
                        href={competitor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 hover:text-red-400 text-sm"
                      >
                        방문 →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">주요 경쟁사가 발견되지 않았습니다</p>
            )}
          </div>

          {/* Market Size Reality Check */}
          <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">시장 규모 현실 확인</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-2">주장된 규모</p>
                <p className="text-2xl font-bold text-green-500">{result.market_size_reality.claimed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">실제 규모</p>
                <p className="text-2xl font-bold text-red-500">{result.market_size_reality.actual}</p>
              </div>
            </div>
            <p className="text-gray-400 mt-4">{result.market_size_reality.notes}</p>
          </div>

          {/* Feasibility Assessment */}
          <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">실현 가능성 평가</h2>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2 text-orange-500">기술적 측면</h4>
                <p className="text-gray-300 text-sm">{result.feasibility_assessment.technical}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-orange-500">재무적 측면</h4>
                <p className="text-gray-300 text-sm">{result.feasibility_assessment.financial}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-orange-500">타임라인</h4>
                <p className="text-gray-300 text-sm">{result.feasibility_assessment.timeline}</p>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="bg-zinc-900 rounded-lg p-8 border border-red-500/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="text-red-500" />
              위험 요소
            </h2>
            <ul className="space-y-3">
              {result.risk_factors.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-gray-300">{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Final Verdict */}
          <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-lg p-8 border-2 border-red-600/30">
            <h2 className="text-2xl font-bold mb-6">최종 평가</h2>
            <div className="flex items-center gap-6 mb-4">
              <div className={`text-6xl font-bold ${getScoreColor(result.final_verdict?.score || 0)}`}>
                {result.final_verdict?.score || 0}/10
              </div>
              <div className="text-gray-300 flex-1 max-h-[200px] overflow-y-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.final_verdict?.reasoning || "분석 진행 중..."}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Link href="/analyze">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                다른 응답 분석하기
              </Button>
            </Link>
            <Link href="/credits">
              <Button size="lg" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                크레딧 구매하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
