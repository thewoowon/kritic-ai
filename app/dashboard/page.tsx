"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Clock, CreditCard } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/ui/Header"

interface AnalysisHistoryItem {
  id: number
  original_response: string
  optimism_bias_score: number
  final_verdict: {
    score: number
  }
  status: string
  created_at: string
}

interface Transaction {
  id: number
  type: string
  amount: number
  description: string
  created_at: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistoryItem[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [creditsBalance, setCreditsBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status !== "authenticated") {
      return
    }

    const fetchDashboardData = async () => {
      // @ts-expect-error - 커스텀 프로퍼티
      const backendToken = session?.user?.backendAccessToken
      if (!backendToken) {
        console.error("No backend token available")
        return
      }

      try {
        // Fetch credits balance
        const creditsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/credits/balance`,
          {
            headers: {
              "Authorization": `Bearer ${backendToken}`
            }
          }
        )
        const creditsData = await creditsResponse.json()
        setCreditsBalance(creditsData.balance)

        // Fetch analysis history
        const historyResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/analyze/history?limit=10`,
          {
            headers: {
              "Authorization": `Bearer ${backendToken}`
            }
          }
        )
        const historyData = await historyResponse.json()
        setAnalysisHistory(historyData)

        // Fetch transaction history
        const transactionsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/credits/history?limit=10`,
          {
            headers: {
              "Authorization": `Bearer ${backendToken}`
            }
          }
        )
        const transactionsData = await transactionsResponse.json()
        setTransactions(transactionsData)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [session, status, router])

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const totalAnalyses = analysisHistory.length
  const totalSpent = transactions
    .filter(t => t.type === "usage")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" />
          홈으로 돌아가기
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">대시보드</h1>
            <p className="text-gray-400">분석 활동과 크레딧 사용 내역을 확인하세요</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-5 h-5 text-red-500" />
                <p className="text-sm text-gray-400">보유 크레딧</p>
              </div>
              <p className="text-3xl font-bold">{creditsBalance !== null ? creditsBalance : "0"}</p>
              <Link href="/credits">
                <Button className="mt-4 w-full bg-red-600 hover:bg-red-700">
                  크레딧 구매
                </Button>
              </Link>
            </div>

            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <p className="text-sm text-gray-400">총 분석 횟수</p>
              </div>
              <p className="text-3xl font-bold">{totalAnalyses}</p>
              <p className="text-xs text-gray-500 mt-2">최근 10개 분석 기준</p>
            </div>

            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <p className="text-sm text-gray-400">사용한 크레딧</p>
              </div>
              <p className="text-3xl font-bold">{totalSpent}</p>
              <p className="text-xs text-gray-500 mt-2">최근 활동 기준</p>
            </div>
          </div>

          {/* Analysis History */}
          <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">최근 분석 내역</h2>
              <Link href="/analyze">
                <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                  새 분석
                </Button>
              </Link>
            </div>

            {analysisHistory.length > 0 ? (
              <div className="space-y-4">
                {analysisHistory.map((analysis) => (
                  <Link key={analysis.id} href={`/results/${analysis.id}`}>
                    <div className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-750 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm text-gray-400 mb-2">
                            {new Date(analysis.created_at).toLocaleString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-white line-clamp-2 mb-3">
                            {analysis.original_response.substring(0, 150)}...
                          </p>
                          <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">낙관 편향:</span>
                              <span className={`text-sm font-semibold ${
                                analysis.optimism_bias_score >= 75 ? 'text-red-500' :
                                analysis.optimism_bias_score >= 50 ? 'text-orange-500' :
                                analysis.optimism_bias_score >= 25 ? 'text-yellow-500' :
                                'text-green-500'
                              }`}>
                                {analysis.optimism_bias_score}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">최종 점수:</span>
                              <span className={`text-sm font-semibold ${
                                analysis.final_verdict?.score >= 7 ? 'text-green-500' :
                                analysis.final_verdict?.score >= 4 ? 'text-yellow-500' :
                                'text-red-500'
                              }`}>
                                {analysis.final_verdict?.score || 0}/10
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          analysis.status === 'completed' ? 'bg-green-900/30 text-green-500' :
                          analysis.status === 'processing' ? 'bg-yellow-900/30 text-yellow-500' :
                          'bg-red-900/30 text-red-500'
                        }`}>
                          {analysis.status === 'completed' ? '완료' :
                           analysis.status === 'processing' ? '진행중' : '실패'}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">아직 분석 내역이 없습니다</p>
                <Link href="/analyze">
                  <Button className="bg-red-600 hover:bg-red-700">
                    첫 분석 시작하기
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">크레딧 사용 내역</h2>

            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center py-3 border-b border-zinc-800">
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(transaction.created_at).toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className={`text-lg font-bold ${
                      transaction.type === 'purchase' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.type === 'purchase' ? '+' : '-'}{Math.abs(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">거래 내역이 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
