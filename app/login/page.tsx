"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>로그인 기능 비활성화</CardTitle>
          <CardDescription>
            이 프로젝트는 Supabase 인증을 사용하지 않습니다.
            Open API 기반 챗봇만 사용 중입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/")} className="w-full">홈으로 돌아가기</Button>
        </CardContent>
      </Card>
    </div>
  )
}
