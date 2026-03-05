"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, AlertTriangle, Copy } from "lucide-react"

export default function DebugPage() {
  const [testMessage, setTestMessage] = useState("안녕하세요")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testWebhook = async () => {
    setIsLoading(true)
    setResult(null)
    setLogs([])

    addLog("테스트 시작...")

    try {
      addLog("API 요청 전송 중...")

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: testMessage,
            },
          ],
        }),
      })

      addLog(`응답 상태: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        const errorText = await response.text()
        addLog(`오류 응답: ${errorText}`)
        setResult({
          success: false,
          status: response.status,
          error: errorText,
        })
        return
      }

      addLog("스트림 응답 읽기 시작...")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") {
                addLog("스트림 완료")
                break
              }
              try {
                const parsed = JSON.parse(data)
                if (parsed.text) {
                  fullResponse += parsed.text
                }
              } catch (e) {
                // 파싱 오류 무시
              }
            }
          }
        }
      }

      addLog(`전체 응답: ${fullResponse}`)

      setResult({
        success: true,
        response: fullResponse,
        status: response.status,
      })
    } catch (error) {
      addLog(`네트워크 오류: ${error.message}`)
      setResult({
        success: false,
        error: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testDirectWebhook = async () => {
    setIsLoading(true)
    setResult(null)
    setLogs([])

    const webhookUrl = "https://dhlab.app.n8n.cloud/webhook-test/36557659-27f3-4be4-a1c8-a61e7aa61955"

    addLog("직접 웹훅 테스트 시작...")
    addLog(`URL: ${webhookUrl}`)

    try {
      const payload = {
        message: testMessage,
        timestamp: new Date().toISOString(),
        source: "debug-test",
      }

      addLog(`페이로드: ${JSON.stringify(payload, null, 2)}`)

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      addLog(`응답 상태: ${response.status} ${response.statusText}`)
      addLog(`응답 헤더: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`)

      const responseText = await response.text()
      addLog(`응답 본문: ${responseText}`)

      setResult({
        success: response.ok,
        status: response.status,
        response: responseText,
        headers: Object.fromEntries(response.headers.entries()),
      })
    } catch (error) {
      addLog(`오류: ${error.message}`)
      setResult({
        success: false,
        error: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyLogs = () => {
    navigator.clipboard.writeText(logs.join("\n"))
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">n8n 웹훅 디버깅 도구</h1>
        <p className="text-muted-foreground">채팅봇과 n8n 연동 문제를 진단합니다</p>
        <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
          <strong>현재 웹훅 URL:</strong> https://dhlab.app.n8n.cloud/webhook-test/36557659-27f3-4be4-a1c8-a61e7aa61955
        </div>
      </div>

      <div className="grid gap-6">
        {/* 테스트 입력 */}
        <Card>
          <CardHeader>
            <CardTitle>테스트 설정</CardTitle>
            <CardDescription>테스트할 메시지를 입력하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">테스트 메시지</label>
              <Input
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="테스트할 메시지를 입력하세요"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={testWebhook} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                채팅 API 테스트
              </Button>

              <Button variant="outline" onClick={testDirectWebhook} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                직접 웹훅 테스트
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 결과 */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                테스트 결과
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={result.success ? "default" : "destructive"}>
                  상태: {result.status || "알 수 없음"}
                </Badge>
                <Badge variant={result.success ? "default" : "secondary"}>{result.success ? "성공" : "실패"}</Badge>
              </div>

              {result.response && (
                <div>
                  <label className="text-sm font-medium">응답 내용</label>
                  <Textarea value={result.response} readOnly className="mt-1" />
                </div>
              )}

              {result.error && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{result.error}</AlertDescription>
                </Alert>
              )}

              {result.headers && (
                <div>
                  <label className="text-sm font-medium">응답 헤더</label>
                  <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(result.headers, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 로그 */}
        {logs.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>실행 로그</CardTitle>
                <Button variant="outline" size="sm" onClick={copyLogs}>
                  <Copy className="h-4 w-4 mr-1" />
                  복사
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded font-mono text-xs max-h-96 overflow-auto">
                {logs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 체크리스트 */}
        <Card>
          <CardHeader>
            <CardTitle>문제 해결 체크리스트</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="env" />
                <label htmlFor="env">
                  환경변수 N8N_WEBHOOK_URL이 올바르게 설정되어 있는가?
                  <br />
                  <code className="text-xs bg-gray-100 px-1 rounded">
                    https://dhlab.app.n8n.cloud/webhook-test/36557659-27f3-4be4-a1c8-a61e7aa61955
                  </code>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="workflow" />
                <label htmlFor="workflow">n8n 워크플로우가 활성화되어 있는가?</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="webhook" />
                <label htmlFor="webhook">
                  웹훅 노드의 경로가 <code>36557659-27f3-4be4-a1c8-a61e7aa61955</code>로 설정되어 있는가?
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="response" />
                <label htmlFor="response">
                  응답 노드가 올바른 형식으로 설정되어 있는가? (response, message, text 등)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="network" />
                <label htmlFor="network">네트워크 연결에 문제가 없는가?</label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* n8n 설정 가이드 */}
        <Card>
          <CardHeader>
            <CardTitle>n8n 설정 가이드</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">1. 웹훅 노드 설정</h4>
              <ul className="text-sm space-y-1 ml-4">
                <li>
                  • HTTP Method: <code>POST</code>
                </li>
                <li>
                  • Path: <code>36557659-27f3-4be4-a1c8-a61e7aa61955</code>
                </li>
                <li>
                  • Response Mode: <code>Response Node</code>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">2. 응답 노드 설정</h4>
              <div className="bg-muted p-3 rounded text-sm">
                <code>
                  {`{
  "response": "{{ $json.output }}"
}`}
                </code>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">3. 받는 데이터 형식</h4>
              <div className="bg-muted p-3 rounded text-sm">
                <code>
                  {`{
  "message": "사용자 메시지",
  "conversation_history": [...],
  "timestamp": "2024-01-01T12:00:00.000Z",
  "user_id": "anonymous",
  "source": "chatbot-widget"
}`}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
