"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  X,
  Minimize2,
  Send,
  Bot,
  User,
  Loader2,
  ChevronUp,
  AlertTriangle,
  Wifi,
  WifiOff,
} from "lucide-react"
import ReactMarkdown from 'react-markdown'

type ChatState = "closed" | "open" | "minimized"

type Message = {
  id: string
  role: "user" | "assistant"
  text: string
}

export default function ChatbotWidget() {
  const [chatState, setChatState] = useState<ChatState>("closed")
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "checking">("checking")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const lastMessageCountRef = useRef(0)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (messages.length > lastMessageCountRef.current && chatState !== "open") {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.role === "assistant") {
        setHasNewMessage(true)
      }
    }
    lastMessageCountRef.current = messages.length
  }, [messages, chatState])

  useEffect(() => {
    if (chatState === "open") {
      setHasNewMessage(false)
    }
  }, [chatState])

  useEffect(() => {
    if (messages.length > 0) {
      setConnectionStatus("connected")
    }
  }, [messages])

  const toggleChat = () => {
    if (chatState === "closed") {
      setChatState("open")
    } else if (chatState === "open") {
      setChatState("closed")
    } else {
      setChatState("open")
    }
  }

  const minimizeChat = () => {
    setChatState("minimized")
  }

  const closeChat = () => {
    setChatState("closed")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setIsLoading(true)
    setConnectionStatus("checking")
    const userMessage = input
    const newMessages = [
      ...messages.map(m => ({ role: m.role, content: m.text })),
      { role: "user", content: userMessage }
    ]
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text: userMessage }])
    setInput("")
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })
      if (!response.body) throw new Error("No response body")
      const reader = response.body.getReader()
      let assistantText = ""
      let buffer = ""
      let assistantId = crypto.randomUUID()
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", text: "" }])
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += new TextDecoder().decode(value)
        let lines = buffer.split("\n\n")
        buffer = lines.pop() || ""
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          try {
            const payload = JSON.parse(line.replace("data: ", ""))
            if (payload.text) {
              assistantText += payload.text
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantId ? { ...msg, text: assistantText } : msg
                )
              )
            }
          } catch (e) {
            // 무시
          }
        }
      }
      setConnectionStatus("connected")
    } catch (error) {
      setConnectionStatus("disconnected")
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", text: "[연결 오류] 답변을 가져오지 못했습니다." }])
    } finally {
      setIsLoading(false)
    }
  }

  const testConnection = async () => {
    setConnectionStatus("checking")
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: "연결 테스트" }] }),
      })
      if (response.ok) {
        setConnectionStatus("connected")
      } else {
        setConnectionStatus("disconnected")
      }
    } catch (error) {
      setConnectionStatus("disconnected")
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Chat Button - Only show when chat is closed */}
      {chatState === "closed" && (
        <Button
          onClick={toggleChat}
          className={`h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 ease-in-out hover:scale-110`}
          size="lg"
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            {hasNewMessage && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-3 w-3 p-0 animate-pulse" />
            )}
            {connectionStatus === "disconnected" && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border border-white" />
            )}
          </div>
        </Button>
      )}

      {/* Chat Window */}
      {(chatState === "open" || chatState === "minimized") && (
        <Card
          className={`mb-4 transition-all duration-300 ease-in-out w-80 h-[480px] opacity-100 scale-100 shadow-lg border-2`}
        >
          {/* Chat Header */}
          <div
            className="flex items-center justify-between p-3 border-b rounded-t-lg bg-blue-600 text-white"
          >
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-full p-1 flex items-center justify-center">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <span className="font-medium text-sm">AI 챗봇</span>
              {/* Connection Status Indicator */}
              <div className="flex items-center">
                {connectionStatus === "connected" && <Wifi className="h-3 w-3 text-green-300" />}
                {connectionStatus === "disconnected" && <WifiOff className="h-3 w-3 text-red-300" />}
                {connectionStatus === "checking" && <Loader2 className="h-3 w-3 animate-spin" />}
              </div>
              {hasNewMessage && chatState === "minimized" && (
                <Badge variant="destructive" className="h-2 w-2 p-0 animate-pulse" />
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeChat}
              className="h-6 w-6 p-0 hover:bg-primary-foreground/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Chat Content - Only show when open */}
          {chatState === "open" && (
            <>
              {/* Connection Error Alert */}
              {connectionStatus === "disconnected" && (
                <div className="px-3 pt-3">
                  <div className="bg-red-50 border border-red-200 rounded-md p-2 flex items-start gap-2 text-red-800 text-xs">
                    <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 overflow-hidden">
                      <span className="block">연결에 문제가 있습니다.</span>
                      <button className="text-red-600 hover:underline font-medium mt-0.5" onClick={testConnection}>
                        다시 시도
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Area */}
              <ScrollArea className="flex-1 px-3 py-2 h-80 overflow-hidden" ref={scrollAreaRef}>
                <div className="space-y-3">
                  {messages.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium mb-1">안녕하세요! 👋</p>
                      <p className="text-xs">무엇을 도와드릴까요?</p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-6 w-6 mt-1">
                          <AvatarFallback className="bg-muted">
                            <Bot className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`max-w-[70%] p-2 rounded-lg text-xs break-words ${
                          message.role === "user"
                            ? "bg-blue-600 text-white rounded-br-sm"
                            : "bg-gray-100 text-gray-900 rounded-bl-sm border border-gray-200"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <ReactMarkdown>{message.text}</ReactMarkdown>
                        ) : (
                          message.text
                        )}
                      </div>

                      {message.role === "user" && (
                        <Avatar className="h-6 w-6 mt-1">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <User className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-2 justify-start">
                      <Avatar className="h-6 w-6 mt-1">
                        <AvatarFallback className="bg-muted">
                          <Bot className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted p-2 rounded-lg rounded-bl-sm max-w-[70%] break-words">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Loader2 className="h-3 w-3 animate-spin flex-shrink-0" />
                          <span>입력 중...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-3">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    disabled={isLoading || connectionStatus === "disconnected"}
                    className="flex-1 h-8 text-xs border-blue-500 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim() || connectionStatus === "disconnected"}
                    size="sm"
                    className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                  </Button>
                </form>
                <div className="text-center mt-2">
                  <span className="text-xs text-muted-foreground">powered by OpenAI</span>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  )
}
