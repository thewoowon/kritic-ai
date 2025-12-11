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
            ChatGPT의
            <span className="text-red-500"> 달콤한 거짓말</span>을 멈추세요
          </h1>
          <p className="text-xl md:text-2xl text-gray-400">
            여러 LLM과 실제 데이터를 기반으로 AI가 생성한 아이디어에 대한 냉정한 현실 검증을 받으세요
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/analyze">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6">
                첫 분석 시작하기 - 무료
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
              <h3 className="text-xl font-bold text-green-500">ChatGPT의 말</h3>
            </div>
            <div className="space-y-4 text-gray-300">
              <p className="italic">
                &quot;당신의 음식 배달 앱 아이디어는 환상적입니다! 시장 규모가 엄청나고 ($150B) 빠르게 성장하고 있습니다.
                독특한 기능으로 첫 해에 쉽게 1%의 시장 점유율을 확보할 수 있을 것입니다.&quot;
              </p>
              <div className="space-y-2 text-sm">
                <p>✓ 거대한 시장 기회</p>
                <p>✓ 구현이 쉬움</p>
                <p>✓ 높은 수익률</p>
                <p>✓ 빠른 출시 가능</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-8 border-2 border-red-500/20">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="text-red-500" />
              <h3 className="text-xl font-bold text-red-500">현실성 검증의 말</h3>
            </div>
            <div className="space-y-4 text-gray-300">
              <p className="italic">
                &quot;음식 배달은 Uber Eats, DoorDash, Grubhub이 지배하는 포화 시장입니다.
                평균 고객 획득 비용: $50-100. 단위 경제성이 최악입니다.&quot;
              </p>
              <div className="space-y-2 text-sm">
                <p className="flex items-start gap-2">
                  <AlertTriangle className="text-orange-500 shrink-0 w-4 h-4 mt-0.5" />
                  <span>32개의 주요 경쟁사 발견</span>
                </p>
                <p className="flex items-start gap-2">
                  <AlertTriangle className="text-orange-500 shrink-0 w-4 h-4 mt-0.5" />
                  <span>MVP 출시에 $2M+ 필요</span>
                </p>
                <p className="flex items-start gap-2">
                  <AlertTriangle className="text-orange-500 shrink-0 w-4 h-4 mt-0.5" />
                  <span>규모 달성 전까지 마이너스 마진</span>
                </p>
                <p className="flex items-start gap-2">
                  <AlertTriangle className="text-orange-500 shrink-0 w-4 h-4 mt-0.5" />
                  <span>수익성까지 18-24개월 소요</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">작동 방식</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">AI 응답 붙여넣기</h3>
              <p className="text-gray-400">
                ChatGPT, Claude 또는 다른 AI가 생성한 아이디어나 제안을 복사하세요
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">멀티 LLM 분석</h3>
              <p className="text-gray-400">
                GPT-5, Claude, Gemini에 회의적인 프롬프트와 웹 검색으로 질의합니다
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">현실 확인</h3>
              <p className="text-gray-400">
                경쟁사, 비용, 리스크, 실현 가능성 점수를 포함한 상세 분석을 받으세요
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="mt-24 max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold">간단한 크레딧 기반 가격</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <h3 className="text-2xl font-bold mb-2">스타터</h3>
              <p className="text-4xl font-bold mb-4">$10</p>
              <p className="text-gray-400 mb-4">100 크레딧</p>
              <p className="text-sm text-gray-500">~10회 분석</p>
            </div>
            <div className="bg-zinc-900 rounded-lg p-6 border-2 border-red-600">
              <h3 className="text-2xl font-bold mb-2">프로</h3>
              <p className="text-4xl font-bold mb-4">$25</p>
              <p className="text-gray-400 mb-4">300 크레딧</p>
              <p className="text-sm text-gray-500">~30회 분석</p>
              <div className="mt-4 text-xs text-green-500">20% 절약</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <h3 className="text-2xl font-bold mb-2">비즈니스</h3>
              <p className="text-4xl font-bold mb-4">$50</p>
              <p className="text-gray-400 mb-4">700 크레딧</p>
              <p className="text-sm text-gray-500">~70회 분석</p>
              <div className="mt-4 text-xs text-green-500">40% 절약</div>
            </div>
          </div>
          <Link href="/analyze">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              무료 분석 시작하기
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; 2025 Kritic. 과장이 아닌 진실을 얻으세요.</p>
        </div>
      </footer>
    </div>
  )
}
