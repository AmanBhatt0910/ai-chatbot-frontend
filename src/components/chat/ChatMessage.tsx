import type { Message } from "@/types/Message"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Props {
  message: Message
  isOwn: boolean
  animate?: boolean
}

// ── Markdown renderer ────────────────────────────────────────────────────────
function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        h1: ({ children }) => (
          <h1 className="text-base font-bold mt-3 mb-1.5">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-sm font-bold mt-3 mb-1.5">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold mt-2.5 mb-1">{children}</h3>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-outside ml-4 mb-2 space-y-0.5">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-4 mb-2 space-y-0.5">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed">{children}</li>
        ),
        code: ({ children, className }) => {
          const isBlock = className?.includes("language-")
          if (isBlock) {
            return (
              <code className="block bg-muted/80 border border-border/50 rounded-lg px-3 py-2.5 text-xs font-mono overflow-x-auto my-2 text-foreground whitespace-pre">
                {children}
              </code>
            )
          }
          return (
            <code className="bg-muted/80 border border-border/40 rounded px-1.5 py-0.5 text-xs font-mono text-foreground">
              {children}
            </code>
          )
        },
        pre: ({ children }) => (
          <pre className="bg-muted/80 border border-border/50 rounded-lg px-3 py-2.5 text-xs font-mono overflow-x-auto my-2 whitespace-pre">
            {children}
          </pre>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-border pl-3 italic text-muted-foreground my-2">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="border-border/40 my-3" />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

// ── Animated AI bubble (only mounted for the live response) ──────────────────
function AnimatedAIBubble({ content }: { content: string }) {
  const rafRef = useRef<number | null>(null)
  const words = content.split(" ")
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const step = (index: number) => {
      setWordIndex(index)
      if (index < words.length) {
        rafRef.current = window.setTimeout(() => step(index + 1), 38)
      }
    }
    rafRef.current = window.setTimeout(() => step(0), 60)
    return () => {
      if (rafRef.current) clearTimeout(rafRef.current)
    }
  // Run once on mount — content won't change for a live message
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const done = wordIndex >= words.length
  const displayed = words.slice(0, wordIndex + 1).join(" ")

  return done ? (
    <MarkdownContent content={content} />
  ) : (
    <p className="whitespace-pre-wrap wrap-break-word">
      {displayed}
      <span className="inline-block w-0.5 h-4 ml-0.5 bg-current align-middle animate-[blink_0.8s_step-end_infinite] opacity-70" />
    </p>
  )
}

// ── Shared bubble shell ──────────────────────────────────────────────────────
function BubbleContent({ message, isOwn, animate }: Props) {
  const isAI = !isOwn

  if (isAI) {
    // Live response → word-by-word animation
    if (animate) return <AnimatedAIBubble content={message.content} />
    // History → render markdown immediately, no hook, no flash
    return <MarkdownContent content={message.content} />
  }

  // User message → plain text always
  return <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
}

// ── Public component ─────────────────────────────────────────────────────────
export default function ChatMessage({ message, isOwn, animate = false }: Props) {
  const isAI = !isOwn

  return (
    <div
      className={cn(
        "flex gap-3 group",
        "animate-in fade-in slide-in-from-bottom-2 duration-300",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      {isAI && (
        <Avatar className="shrink-0 mt-0.5 ring-2 ring-border/50 shadow-sm">
          <AvatarFallback className="bg-linear-to-br from-slate-700 to-slate-900 text-white text-xs font-semibold">
            AI
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex flex-col gap-1", isOwn ? "items-end" : "items-start", "max-w-[65%]")}>
        <div
          className={cn(
            "relative rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed",
            isOwn
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-card border border-border/60 text-foreground rounded-tl-sm"
          )}
        >
          <BubbleContent message={message} isOwn={isOwn} animate={animate} />

          <div
            className={cn(
              "text-[10px] mt-1.5 opacity-0 group-hover:opacity-50 transition-opacity duration-200",
              isOwn ? "text-right" : "text-left"
            )}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {isOwn && message.status === "SENDING" && (
          <span className="text-[10px] text-muted-foreground px-1 animate-pulse">
            Sending…
          </span>
        )}
      </div>

      {isOwn && (
        <Avatar className="shrink-0 mt-0.5 ring-2 ring-primary/20 shadow-sm">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
            U
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}