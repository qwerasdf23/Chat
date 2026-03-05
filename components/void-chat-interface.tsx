"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, RotateCcw } from "lucide-react"
import { ChatSettings } from "./chat-settings"
import { useSiteTheme } from "@/components/site-theme-provider"
import type { SiteTheme } from "@/lib/site-theme"
import ReactMarkdown from "react-markdown"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function VoidChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { theme } = useSiteTheme()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fontSizeCss = "0.875rem"

  const sendToApi = useCallback(async (userMessage: string, currentMessages: Message[]) => {
    setIsTyping(true)
    const messageList = [
      ...currentMessages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: userMessage },
    ]
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messageList }),
      })

      if (!res.ok) {
        const errBody = await res.text()
        let errMsg = `오류 (${res.status})`
        try {
          const j = JSON.parse(errBody)
          if (j?.error) errMsg = j.error
        } catch {
          if (errBody) errMsg = errBody.slice(0, 200)
        }
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: errMsg,
            timestamp: new Date(),
          },
        ])
        return
      }

      if (!res.body) throw new Error("No response body")
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let assistantText = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split("\n\n")
        buffer = events.pop() ?? ""
        for (const event of events) {
          const dataLine = event.split("\n").find((l) => l.startsWith("data:"))
          if (!dataLine) continue
          const data = dataLine.replace(/^data:\s*/, "").trim()
          if (data === "[DONE]") continue
          try {
            const payload = JSON.parse(data)
            if (payload.text != null) assistantText += payload.text
          } catch {
            // ignore
          }
        }
      }
      if (buffer) {
        const dataLine = buffer.split("\n").find((l) => l.startsWith("data:"))
        if (dataLine) {
          const data = dataLine.replace(/^data:\s*/, "").trim()
          try {
            const payload = JSON.parse(data)
            if (payload.text != null) assistantText += payload.text
          } catch {
            // ignore
          }
        }
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: assistantText || "(응답이 비어 있습니다.)",
          timestamp: new Date(),
        },
      ])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: "연결 오류가 발생했습니다. 다시 시도해 주세요.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isTyping) return
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
    sendToApi(trimmed, nextMessages)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleReset = () => {
    setMessages([])
    setIsTyping(false)
  }

  return (
    <div className="relative flex flex-col h-full w-full" style={{ zIndex: 10 }}>
      <div
        className="flex flex-col h-full rounded-3xl overflow-hidden"
        style={{
          background: theme.panelBg,
          backdropFilter: "blur(20px) saturate(1.1)",
          WebkitBackdropFilter: "blur(20px) saturate(1.1)",
          border: `1px solid ${theme.panelBorder}`,
          boxShadow: `0 0 50px ${theme.panelGlow}`,
          transition: "background 0.5s, border-color 0.5s, box-shadow 0.5s",
        }}
      >
        <header
          className="flex items-center justify-between px-4 py-2.5 shrink-0"
          style={{
            borderBottom: `1px solid ${theme.divider}`,
            transition: "border-color 0.5s",
          }}
        >
          <ChatSettings theme={theme} />
          <div className="flex items-center gap-2">
            {isTyping && (
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{
                      background: theme.accent,
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: "0.8s",
                    }}
                  />
                ))}
              </div>
            )}
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ color: "oklch(0.5 0.04 200)" }}
              aria-label="대화 초기화"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 chat-scrollbar">
          {messages.length === 0 ? (
            <div className="flex flex-col justify-center h-full items-center">
              <p className="text-sm font-mono" style={{ color: "oklch(0.5 0.04 200)" }}>
                메시지를 입력해 대화를 시작하세요
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  theme={theme}
                  fontSize={fontSizeCss}
                />
              ))}
              {isTyping && <TypingIndicator theme={theme} />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div
          className="px-4 pb-4 pt-2 shrink-0"
          style={{
            borderTop: `1px solid ${theme.divider}`,
            transition: "border-color 0.5s",
          }}
        >
          <form onSubmit={handleSubmit} className="relative">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: theme.inputBg,
                border: `1px solid ${input.trim() ? theme.inputBorderActive : theme.divider}`,
                boxShadow: input.trim() ? `0 0 16px ${theme.panelGlow}` : "none",
                transition: "background 0.5s, border-color 0.3s, box-shadow 0.3s",
              }}
            >
              <div className="flex items-end gap-3 p-3">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="메시지를 입력하세요..."
                  rows={1}
                  className="flex-1 bg-transparent resize-none leading-relaxed placeholder:font-mono focus:outline-none py-1.5 px-1"
                  style={{
                    color: "oklch(0.92 0.02 200)",
                    caretColor: theme.accent,
                    fontSize: fontSizeCss,
                  }}
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 rounded-xl shrink-0 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
                  style={{
                    background: input.trim() ? `${theme.accent}33` : "oklch(0.2 0.02 200 / 0.3)",
                    border: `1px solid ${input.trim() ? `${theme.accent}44` : "oklch(0.3 0.03 200 / 0.15)"}`,
                    color: input.trim() ? theme.accent : "oklch(0.4 0.03 200)",
                    transition: "background 0.3s, border-color 0.3s, color 0.3s",
                  }}
                  aria-label="보내기"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({
  message,
  theme,
  fontSize,
}: {
  message: Message
  theme: SiteTheme
  fontSize: string
}) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[85%] rounded-2xl px-4 py-3"
        style={{
          background: isUser ? theme.userBg : theme.aiBg,
          border: `1px solid ${isUser ? theme.userBorder : theme.aiBorder}`,
          color: isUser ? theme.userText : theme.aiText,
          transition: "background 0.5s, border-color 0.5s, color 0.5s",
        }}
      >
        <div className="leading-relaxed whitespace-pre-wrap" style={{ fontSize }}>
          {message.role === "assistant" ? (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          ) : (
            message.content
          )}
        </div>
        <time
          className="block text-xs mt-2 font-mono"
          style={{
            color: isUser ? theme.timeColor : "oklch(0.45 0.03 270)",
            transition: "color 0.5s",
          }}
          dateTime={message.timestamp.toISOString()}
          suppressHydrationWarning
        >
          {message.timestamp.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>
    </div>
  )
}

function TypingIndicator({ theme }: { theme: SiteTheme }) {
  return (
    <div className="flex justify-start">
      <div
        className="rounded-2xl px-5 py-3.5"
        style={{
          background: theme.aiBg,
          border: `1px solid ${theme.aiBorder}`,
          transition: "background 0.5s, border-color 0.5s",
        }}
      >
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                background: theme.accent,
                animationDelay: `${i * 0.15}s`,
                animationDuration: "0.8s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
