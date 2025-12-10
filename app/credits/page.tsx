"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/Header"
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CreditsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    // 백엔드에서 크레딧 잔액 가져오기
    const fetchBalance = async () => {
      // @ts-expect-error - 커스텀 프로퍼티
      const backendToken = session?.user?.backendAccessToken
      if (!backendToken) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/credits/balance`, {
          headers: {
            "Authorization": `Bearer ${backendToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setBalance(data.balance)
        }
      } catch (error) {
        console.error("Failed to fetch balance:", error)
        setBalance(100) // 실패 시 기본값
      }
    }

    if (session) {
      fetchBalance()
    }
  }, [session])

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

  const packages = [
    { id: "starter", credits: 100, price: 10, popular: false },
    { id: "pro", credits: 300, price: 25, popular: true, savings: "20% savings" },
    { id: "business", credits: 700, price: 50, popular: false, savings: "40% savings" },
  ]

  const handlePurchase = async (packageId: string) => {
    // @ts-expect-error - 커스텀 프로퍼티
    const backendToken = session?.user?.backendAccessToken
    if (!backendToken) {
      alert("Please log in to purchase credits.")
      return
    }

    setLoading(packageId)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/credits/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${backendToken}`
        },
        body: JSON.stringify({
          package: packageId,
          success_url: `${window.location.origin}/credits/success`,
          cancel_url: `${window.location.origin}/credits`
        }),
      })

      const data = await response.json()
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      }
    } catch (error) {
      console.error("Purchase failed:", error)
      alert("Purchase failed. Please try again.")
    } finally {
      setLoading(null)
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
            <h1 className="text-4xl font-bold mb-2">Buy Credits</h1>
            <p className="text-gray-400">
              Purchase credits to run reality checks on AI responses
            </p>
          </div>

          {/* Current Balance */}
          <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-lg p-8 border-2 border-red-600/30">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 mb-2">Current Balance</p>
                <p className="text-5xl font-bold">{balance}</p>
                <p className="text-gray-400 mt-2">credits</p>
              </div>
              <CreditCard className="w-16 h-16 text-red-600" />
            </div>
          </div>

          {/* Credit Packages */}
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg, idx) => (
              <div
                key={idx}
                className={`bg-zinc-900 rounded-lg p-6 border-2 ${
                  pkg.popular ? "border-red-600" : "border-zinc-800"
                } relative`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold">{pkg.credits} Credits</h3>
                  <p className="text-4xl font-bold">${pkg.price}</p>
                  <p className="text-sm text-gray-500">~{Math.floor(pkg.credits / 10)} analyses</p>
                  {pkg.savings && (
                    <p className="text-xs text-green-500">{pkg.savings}</p>
                  )}
                  <Button
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={loading !== null}
                    className={`w-full ${
                      pkg.popular
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-zinc-800 hover:bg-zinc-700"
                    }`}
                  >
                    {loading === pkg.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Purchase"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Usage Info */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-xl font-bold mb-4">Credit Usage</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Each analysis costs 10 credits per model selected</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Using 2 models (GPT-5 + Claude) = 20 credits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Using all 3 models = 30 credits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Credits never expire</span>
              </li>
            </ul>
          </div>

          {/* Transaction History */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                <div>
                  <p className="font-medium">Initial credits</p>
                  <p className="text-sm text-gray-400">Welcome bonus</p>
                </div>
                <p className="text-green-500 font-bold">+100</p>
              </div>
              <p className="text-sm text-gray-500 text-center py-4">
                Your transaction history will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
