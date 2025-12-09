"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Authentication Error</h1>
          <p className="text-gray-400 mb-4">Something went wrong during authentication</p>

          {error && (
            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-400 font-mono break-all">{error}</p>
            </div>
          )}

          <Link
            href="/login"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}
