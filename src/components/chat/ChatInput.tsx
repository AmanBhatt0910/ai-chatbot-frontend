import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SendHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  onSend: (message: string) => void
  onSetCategory: (category: string) => void
  hasCategory: boolean
}

const CATEGORIES = [
  { label: "💪 Fitness", value: "Fitness" },
  { label: "💻 Tech", value: "Tech" },
  { label: "💰 Finance", value: "Finance" },
]

export default function ChatInput({ onSend, onSetCategory, hasCategory }: Props) {
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 160) + "px"
  }, [input])

  const handleSend = async () => {
    if (!input.trim()) return

    const trimmed = input.split("\n")[0].trim()
    setSending(true)
    setInput("")

    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    if (trimmed.startsWith("/category ")) {
      const category = trimmed.replace("/category ", "").trim()
      onSetCategory(category)
    } else if (!hasCategory) {
      onSetCategory(trimmed)
    } else {
      onSend(trimmed)
    }

    // Brief visual feedback on send button
    await new Promise((r) => setTimeout(r, 300))
    setSending(false)
    textareaRef.current?.focus()
  }

  const canSend = input.trim().length > 0

  return (
    <div className="border-t bg-background/80 backdrop-blur-sm p-4 shrink-0">
      <div className="max-w-3xl mx-auto flex flex-col gap-3">

        {/* Category chips */}
        {!hasCategory && (
          <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-xs text-muted-foreground self-center">
              Choose a topic:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => onSetCategory(cat.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                  "bg-muted/60 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-sm",
                  "active:scale-95"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Input row */}
        <div
          className={cn(
            "flex items-end gap-2 rounded-2xl border bg-card px-4 py-2.5 shadow-sm transition-all duration-200",
            "focus-within:ring-2 focus-within:ring-ring/40 focus-within:border-ring/60"
          )}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              !hasCategory
                ? "Type a category or pick one above…"
                : "Ask anything…"
            }
            rows={1}
            className={cn(
              "flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60",
              "min-h-[24px] max-h-[160px] py-0.5 leading-relaxed"
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />

          <Button
            size="icon"
            onClick={handleSend}
            disabled={!canSend || sending}
            className={cn(
              "shrink-0 rounded-xl h-8 w-8 transition-all duration-200",
              canSend
                ? "opacity-100 scale-100"
                : "opacity-40 scale-95",
              sending && "animate-pulse"
            )}
          >
            <SendHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/40 select-none">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}