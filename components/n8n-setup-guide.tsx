"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Webhook, Settings, MessageSquare, Zap } from "lucide-react"
import { useState } from "react"

export default function N8nSetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const webhookPayload = `{
  "message": "사용자가 입력한 메시지",
  "conversation_history": [
    {
      "role": "user",
      "content": "이전 메시지"
    },
    {
      "role": "assistant", 
      "content": "이전 응답"
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z",
  "user_id": "anonymous"
}`

  const n8nWorkflowExample = `{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [240, 300],
      "parameters": {
        "httpMethod": "POST",
        "path": "chatbot",
        "responseMode": "responseNode"
      }
    },
    {
      "name": "OpenAI Chat Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "position": [460, 300],
      "parameters": {
        "model": "gpt-4o",
        "options": {}
      }
    },
    {
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [680, 300],
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ { \\"response\\": $json.response } }}"
      }
    }
  ]
}`

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">n8n 채팅봇 연동 가이드</h1>
        <p className="text-muted-foreground">n8n 워크플로우와 채팅봇을 연결하는 완전한 설정 가이드</p>
      </div>

      {/* Step 1: n8n 워크플로우 생성 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline">1단계</Badge>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              n8n 워크플로우 생성
            </CardTitle>
          </div>
          <CardDescription>n8n에서 채팅봇 응답을 처리할 워크플로우를 만듭니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">필수 노드 구성:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>
                <strong>Webhook 노드</strong>: POST 요청을 받을 엔드포인트
              </li>
              <li>
                <strong>AI 처리 노드</strong>: OpenAI, Claude, 또는 다른 AI 모델
              </li>
              <li>
                <strong>Respond to Webhook 노드</strong>: 응답을 반환
              </li>
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">워크플로우 예시 JSON:</h4>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(n8nWorkflowExample, 1)}>
                {copiedStep === 1 ? (
                  "복사됨!"
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    복사
                  </>
                )}
              </Button>
            </div>
            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">{n8nWorkflowExample}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: 웹훅 설정 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline">2단계</Badge>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              웹훅 URL 설정
            </CardTitle>
          </div>
          <CardDescription>n8n 웹훅 URL을 환경변수에 추가합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">환경변수 설정:</h4>
            <div className="bg-muted p-3 rounded-md">
              <code className="text-sm">N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chatbot</code>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={() => copyToClipboard("N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chatbot", 2)}
              >
                {copiedStep === 2 ? "복사됨!" : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">웹훅에서 받는 데이터 형식:</h4>
            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">{webhookPayload}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: n8n 워크플로우 구성 예시 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline">3단계</Badge>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              워크플로우 구성 예시
            </CardTitle>
          </div>
          <CardDescription>실제 사용할 수 있는 n8n 워크플로우 구성 방법</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">🔗 Webhook 노드 설정:</h4>
              <ul className="text-sm space-y-1">
                <li>
                  • HTTP Method: <code>POST</code>
                </li>
                <li>
                  • Path: <code>chatbot</code>
                </li>
                <li>
                  • Response Mode: <code>Response Node</code>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">🤖 AI 노드 설정:</h4>
              <ul className="text-sm space-y-1">
                <li>
                  • Input: <code>{"{{ $json.message }}"}</code>
                </li>
                <li>
                  • Context: <code>{"{{ $json.conversation_history }}"}</code>
                </li>
                <li>• Model: GPT-4, Claude 등</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">📤 Response 노드 설정:</h4>
            <div className="bg-muted p-3 rounded-md">
              <code className="text-sm">
                {`{
  "response": "{{ $json.response }}",
  "timestamp": "{{ new Date().toISOString() }}"
}`}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 4: 고급 기능 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline">4단계</Badge>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              고급 기능 추가
            </CardTitle>
          </div>
          <CardDescription>더 강력한 채팅봇을 위한 추가 기능들</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">📊 대화 로깅:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Google Sheets에 대화 저장</li>
                <li>• 데이터베이스 연동</li>
                <li>• 분석 및 리포팅</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">🔍 의도 분석:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 사용자 의도 파악</li>
                <li>• 적절한 워크플로우 라우팅</li>
                <li>• 자동 카테고리 분류</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">📧 알림 시스템:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 이메일/슬랙 알림</li>
                <li>• 긴급 문의 에스컬레이션</li>
                <li>• 관리자 대시보드</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">🔗 외부 API 연동:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• CRM 시스템 연동</li>
                <li>• 결제 시스템 연동</li>
                <li>• 예약/주문 시스템</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 추가 리소스 */}
      <Card>
        <CardHeader>
          <CardTitle>📚 추가 리소스</CardTitle>
          <CardDescription>n8n과 채팅봇 개발에 도움이 되는 자료들</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://docs.n8n.io" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                n8n 공식 문서
              </a>
            </Button>

            <Button variant="outline" className="justify-start" asChild>
              <a href="https://community.n8n.io" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                n8n 커뮤니티
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
