"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Users, Zap, Shield } from "lucide-react"

export default function DemoWebsite() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">TechCorp</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-500 hover:text-gray-900">
                제품
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                솔루션
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                고객지원
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                회사소개
              </a>
            </nav>
            <Button>무료 체험</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            비즈니스를 위한 <br />
            <span className="text-blue-600">혁신적인 솔루션</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI 기반 기술로 여러분의 비즈니스를 다음 단계로 끌어올리세요. 간단하고 강력한 도구로 생산성을 극대화하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3">
              지금 시작하기
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              데모 보기
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">왜 TechCorp을 선택해야 할까요?</h3>
            <p className="text-lg text-gray-600">수천 개의 기업이 신뢰하는 검증된 솔루션</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>빠른 성능</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>최첨단 기술로 구현된 초고속 처리 성능</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>보안</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>엔터프라이즈급 보안으로 데이터를 안전하게 보호</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>협업</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>팀 전체가 함께 사용할 수 있는 협업 도구</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle>고객 만족</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>24/7 고객 지원과 99.9% 가동률 보장</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">고객들의 이야기</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "TechCorp 덕분에 우리 회사의 생산성이 300% 향상되었습니다. 정말 놀라운 결과입니다!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <p className="font-semibold">김철수</p>
                      <p className="text-sm text-gray-500">ABC 기업 CEO</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">지금 바로 시작해보세요</h3>
          <p className="text-xl text-blue-100 mb-8">14일 무료 체험으로 TechCorp의 강력함을 경험해보세요</p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            무료로 시작하기
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">TechCorp</h4>
              <p className="text-gray-400">혁신적인 기술로 더 나은 미래를 만들어갑니다.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">제품</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    솔루션 A
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    솔루션 B
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    엔터프라이즈
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    도움말
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    문의하기
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    상태 페이지
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    회사소개
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    채용
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    블로그
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TechCorp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
