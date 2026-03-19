import { useState } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  onSend: (message: string) => void
  onSetCategory: (category: string) => void
  hasCategory: boolean
}

export default function ChatInput({
  onSend,
  onSetCategory,
  hasCategory,
}: Props) {

  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    const trimmed = input.split("\n")[0].trim()

    // ✅ 1. Explicit command
    if (trimmed.startsWith("/category ")) {
      const category = trimmed.replace("/category ", "").trim()
      onSetCategory(category)
      setInput("")
      return
    }

    // ✅ 2. If no category yet → treat input as category
    if (!hasCategory) {
      onSetCategory(trimmed)
      setInput("")
      return
    }

    // ✅ 3. Normal chat
    onSend(trimmed)
    setInput("")
  }

  return (
    <div className="border-t bg-background p-4 shrink-0">
      <div className="max-w-3xl mx-auto flex flex-col gap-2">

        {/* 🔥 Category Buttons (only if not selected yet) */}
        {!hasCategory && (
          <div className="flex gap-2">
            {["Fitness", "Tech", "Finance"].map((cat) => (
              <Button
                key={cat}
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log("Clicked category:", cat)
                  onSetCategory(cat)
                }}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}

        {/* 🔥 Input */}
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              !hasCategory
                ? "Type a category (e.g. Fitness) or use buttons..."
                : "Ask anything..."
            }
            className="flex-1 resize-none rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />

          <Button onClick={handleSend}>
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}