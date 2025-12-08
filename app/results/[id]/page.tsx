"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

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
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/analyze/${params.id}`
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
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xl">Analyzing response...</p>
          <p className="text-gray-400 text-sm">This may take 20-30 seconds</p>
        </div>
      </div>
    )
  }

  if (!result || result.status === "processing") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xl">Still processing...</p>
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
            New Analysis
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Optimism Bias Score */}
          <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">Optimism Bias Score</h2>
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
                  {result.optimism_bias_score >= 75 && "Extremely optimistic - Major reality disconnect"}
                  {result.optimism_bias_score >= 50 && result.optimism_bias_score < 75 && "Highly optimistic - Significant concerns"}
                  {result.optimism_bias_score >= 25 && result.optimism_bias_score < 50 && "Moderately optimistic - Some caution needed"}
                  {result.optimism_bias_score < 25 && "Realistic assessment - Well balanced"}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  {result.optimism_bias_score >= 50 ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <span className="text-red-500">High reality check needed</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">Reasonable expectations</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Original vs Reality */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <h3 className="text-xl font-bold mb-4 text-green-500">Original AI Response</h3>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {result.original_response}
              </p>
            </div>
            <div className="bg-zinc-900 rounded-lg p-6 border border-red-500/20">
              <h3 className="text-xl font-bold mb-4 text-red-500">Reality Check</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {result.final_verdict.reasoning}
              </p>
            </div>
          </div>

          {/* Competitor Analysis */}
          <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">Competitor Analysis</h2>
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
                        Visit →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No major competitors identified</p>
            )}
          </div>

          {/* Market Size Reality Check */}
          <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">Market Size Reality Check</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-2">Claimed</p>
                <p className="text-2xl font-bold text-green-500">{result.market_size_reality.claimed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Actual</p>
                <p className="text-2xl font-bold text-red-500">{result.market_size_reality.actual}</p>
              </div>
            </div>
            <p className="text-gray-400 mt-4">{result.market_size_reality.notes}</p>
          </div>

          {/* Feasibility Assessment */}
          <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">Feasibility Assessment</h2>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2 text-orange-500">Technical</h4>
                <p className="text-gray-300 text-sm">{result.feasibility_assessment.technical}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-orange-500">Financial</h4>
                <p className="text-gray-300 text-sm">{result.feasibility_assessment.financial}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-orange-500">Timeline</h4>
                <p className="text-gray-300 text-sm">{result.feasibility_assessment.timeline}</p>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="bg-zinc-900 rounded-lg p-8 border border-red-500/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="text-red-500" />
              Risk Factors
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
            <h2 className="text-2xl font-bold mb-6">Final Verdict</h2>
            <div className="flex items-center gap-6 mb-4">
              <div className={`text-6xl font-bold ${getScoreColor(result.final_verdict.score)}`}>
                {result.final_verdict.score}/10
              </div>
              <p className="text-gray-300 flex-1">{result.final_verdict.reasoning}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Link href="/analyze">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                Analyze Another Response
              </Button>
            </Link>
            <Link href="/credits">
              <Button size="lg" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                Buy More Credits
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
