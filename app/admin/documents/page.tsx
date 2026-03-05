"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DocumentsPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>문서 관리 기능 비활성화</CardTitle>
          <CardDescription>
            이 프로젝트는 Supabase를 제거하고 Open API 기반의 간단한 챗봇만 사용합니다.
            문서 업로드 및 RAG 기능은 현재 제공되지 않습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/")}>홈으로 돌아가기</Button>
        </CardContent>
      </Card>
    </div>
  )
}
