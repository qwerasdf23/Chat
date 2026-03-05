"use client";

import React, { useState, useRef } from "react";

export default function CustomChatInterface() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, { role: "user", content: userMessage }] }),
    });

    if (!response.body) {
      setIsLoading(false);
      setMessages((prev) => [...prev, { role: "assistant", text: "서버 응답이 없습니다." }]);
      return;
    }

    const reader = response.body.getReader();
    let assistantText = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += new TextDecoder().decode(value);

      // data: ...\n\n 단위로 파싱
      let lines = buffer.split("\n\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        try {
          const payload = JSON.parse(line.replace("data: ", ""));
          if (payload.text) {
            assistantText += payload.text;
            setMessages((prev) => {
              // 마지막 assistant 메시지 실시간 업데이트
              if (prev[prev.length - 1]?.role === "assistant") {
                return [...prev.slice(0, -1), { role: "assistant", text: assistantText }];
              } else {
                return [...prev, { role: "assistant", text: assistantText }];
              }
            });
          }
        } catch (e) {
          // 무시
        }
      }
    }
    setIsLoading(false);
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
      <div
        style={{
          minHeight: 300,
          border: "1px solid #eee",
          borderRadius: 8,
          padding: 16,
          marginBottom: 8,
          background: "#fafbfc",
          overflowY: "auto",
        }}
        ref={scrollRef}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.role === "user" ? "right" : "left", margin: "8px 0" }}>
            <span
              style={{
                display: "inline-block",
                background: msg.role === "user" ? "#3b82f6" : "#e5e7eb",
                color: msg.role === "user" ? "#fff" : "#222",
                borderRadius: 8,
                padding: "6px 12px",
                maxWidth: "80%",
                wordBreak: "break-all",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {isLoading && (
          <div style={{ color: "#888", fontSize: 12, marginTop: 8 }}>AI가 답변 중...</div>
        )}
      </div>
      <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()} style={{ padding: "0 16px" }}>
          전송
        </button>
      </form>
    </div>
  );
} 