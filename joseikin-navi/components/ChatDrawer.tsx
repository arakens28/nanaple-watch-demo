"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const OPEN_CHAT_EVENT = "joseikin-navi:open-chat";

/** どこからでもチャットを開いて質問を投げ込めるヘルパー */
export function openChatWith(question?: string) {
  window.dispatchEvent(
    new CustomEvent(OPEN_CHAT_EVENT, { detail: { question } })
  );
}

export default function ChatDrawer({ step }: { step?: number }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sendRef = useRef<(text: string) => void>(() => {});

  async function send(text: string) {
    const content = text.trim();
    if (!content || streaming) return;
    const history: Message[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, step }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        assistant += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: assistant }]);
      }
    } catch {
      setMessages([
        ...history,
        {
          role: "assistant",
          content: "エラーが発生しました。もう一度お試しください。",
        },
      ]);
    } finally {
      setStreaming(false);
    }
  }
  sendRef.current = send;

  useEffect(() => {
    function handleOpen(e: Event) {
      setOpen(true);
      const question = (e as CustomEvent<{ question?: string }>).detail
        ?.question;
      if (question) sendRef.current(question);
    }
    window.addEventListener(OPEN_CHAT_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* フローティングボタン */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="AIチャットを開く"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-2xl text-white shadow-lg transition hover:bg-brand-700"
      >
        {open ? "×" : "💬"}
      </button>

      {/* ドロワー */}
      {open && (
        <div className="fixed bottom-24 right-6 z-40 flex h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <div className="border-b bg-brand-600 px-4 py-3 text-sm font-semibold text-white">
            AIアシスタント
            <p className="text-xs font-normal text-brand-100">
              申請に関する質問にお答えします（申請代行はできません）
            </p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <p className="text-sm text-gray-400">
                例:「計画申請の提出期限はいつ？」「必要書類を教えて」
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                <span
                  className={`inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-left text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-brand-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.content ||
                    (streaming && i === messages.length - 1 ? "…" : "")}
                </span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t p-3"
          >
            <input
              className="input flex-1"
              placeholder="質問を入力..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={streaming}
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="btn-primary shrink-0"
            >
              送信
            </button>
          </form>
        </div>
      )}
    </>
  );
}
