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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

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
    { id: "gpt5", name: "GPT-5", description: "Skeptical investor" },
    { id: "claude", name: "Claude", description: "Competitor analyst" },
    { id: "gemini", name: "Gemini", description: "Market researcher" },
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
      alert("Please paste an AI response to analyze")
      return
    }

    setIsAnalyzing(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original_response: originalResponse,
          context: context || null,
          models: selectedModels,
        }),
      })

      const data = await response.json()

      if (data.analysis_id) {
        window.location.href = `/results/${data.analysis_id}`
      }
    } catch (error) {
      console.error("Analysis failed:", error)
      alert("Analysis failed. Please try again.")
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
          Back to Home
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Reality Check Analysis</h1>
            <p className="text-gray-400">
              Paste an AI-generated response below and we&apos;ll expose the truth
            </p>
          </div>

          {/* Credit Balance */}
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Your Credits</p>
                <p className="text-2xl font-bold">100</p>
              </div>
              <Link href="/credits">
                <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                  Buy More
                </Button>
              </Link>
            </div>
          </div>

          {/* Main Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">AI Response to Analyze *</label>
            <Textarea
              placeholder="Paste the AI-generated response here (ChatGPT, Claude, etc.)..."
              value={originalResponse}
              onChange={(e) => setOriginalResponse(e.target.value)}
              className="min-h-[200px] bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-600"
            />
            <p className="text-xs text-gray-500">
              {originalResponse.length} characters
            </p>
          </div>

          {/* Context Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Context (Optional)</label>
            <Input
              placeholder="What did you ask the AI? (helps us provide better analysis)"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-600"
            />
          </div>

          {/* Model Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Analysis Models</label>
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
              More models = more comprehensive analysis (but higher cost)
            </p>
          </div>

          {/* Cost Preview */}
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <div className="flex justify-between items-center">
              <p className="text-gray-400">Estimated Cost</p>
              <p className="text-2xl font-bold text-red-500">{creditCost} credits</p>
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
                Running Reality Check...
              </>
            ) : (
              "Run Reality Check"
            )}
          </Button>

          <p className="text-xs text-center text-gray-500">
            Analysis typically takes 20-30 seconds
          </p>
        </div>
      </div>
    </div>
  )
}
