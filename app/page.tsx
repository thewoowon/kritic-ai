import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { KriticFusionSection } from "@/components/kritic/KriticFusionSection"
import { Header } from "@/components/ui/Header"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Stop believing ChatGPT&apos;s
            <span className="text-red-500"> sugar-coated lies</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400">
            Get brutal reality checks on AI-generated ideas, backed by multiple LLMs and real data
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/analyze">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6">
                Analyze Your First Response - Free
              </Button>
            </Link>
          </div>
        </div>

        {/* 3D Fusion Animation */}
        <div className="mt-16">
          <KriticFusionSection />
        </div>

        {/* Comparison Section */}
        <div className="mt-24 grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-zinc-900 rounded-lg p-8 border-2 border-green-500/20">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="text-green-500" />
              <h3 className="text-xl font-bold text-green-500">ChatGPT Says</h3>
            </div>
            <div className="space-y-4 text-gray-300">
              <p className="italic">
                &quot;Your food delivery app idea is fantastic! The market is huge ($150B) and growing rapidly.
                With your unique features, you could easily capture 1% market share in year one.&quot;
              </p>
              <div className="space-y-2 text-sm">
                <p>✓ Massive market opportunity</p>
                <p>✓ Easy to implement</p>
                <p>✓ High profit margins</p>
                <p>✓ Quick time to market</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-8 border-2 border-red-500/20">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="text-red-500" />
              <h3 className="text-xl font-bold text-red-500">Reality Check Says</h3>
            </div>
            <div className="space-y-4 text-gray-300">
              <p className="italic">
                &quot;Food delivery is a saturated market dominated by Uber Eats, DoorDash, and Grubhub.
                Average customer acquisition cost: $50-100. Unit economics are terrible.&quot;
              </p>
              <div className="space-y-2 text-sm">
                <p className="flex items-start gap-2">
                  <AlertTriangle className="text-orange-500 shrink-0 w-4 h-4 mt-0.5" />
                  <span>32 major competitors found</span>
                </p>
                <p className="flex items-start gap-2">
                  <AlertTriangle className="text-orange-500 shrink-0 w-4 h-4 mt-0.5" />
                  <span>$2M+ needed for MVP launch</span>
                </p>
                <p className="flex items-start gap-2">
                  <AlertTriangle className="text-orange-500 shrink-0 w-4 h-4 mt-0.5" />
                  <span>Negative margins until scale</span>
                </p>
                <p className="flex items-start gap-2">
                  <AlertTriangle className="text-orange-500 shrink-0 w-4 h-4 mt-0.5" />
                  <span>18-24 months to profitability</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Paste AI Response</h3>
              <p className="text-gray-400">
                Copy any ChatGPT, Claude, or other AI-generated idea or suggestion
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Multi-LLM Analysis</h3>
              <p className="text-gray-400">
                We query GPT-5, Claude, and Gemini with skeptical prompts + web search
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Get Reality</h3>
              <p className="text-gray-400">
                Receive detailed analysis: competitors, costs, risks, and feasibility score
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="mt-24 max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold">Simple Credit-Based Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-4xl font-bold mb-4">$10</p>
              <p className="text-gray-400 mb-4">100 credits</p>
              <p className="text-sm text-gray-500">~10 analyses</p>
            </div>
            <div className="bg-zinc-900 rounded-lg p-6 border-2 border-red-600">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-4xl font-bold mb-4">$25</p>
              <p className="text-gray-400 mb-4">300 credits</p>
              <p className="text-sm text-gray-500">~30 analyses</p>
              <div className="mt-4 text-xs text-green-500">20% savings</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <h3 className="text-2xl font-bold mb-2">Business</h3>
              <p className="text-4xl font-bold mb-4">$50</p>
              <p className="text-gray-400 mb-4">700 credits</p>
              <p className="text-sm text-gray-500">~70 analyses</p>
              <div className="mt-4 text-xs text-green-500">40% savings</div>
            </div>
          </div>
          <Link href="/analyze">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              Start Free Analysis
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; 2025 Kritic. Get the truth, not the hype.</p>
        </div>
      </footer>
    </div>
  )
}
