import { useState } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  onSend: (message: string) => void
}

export default function ChatInput({ onSend }: Props) {
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    onSend(input)
    setInput("")
  }

  return (
    <div className="border-t bg-background p-4 shrink-0">
      <div className="max-w-3xl mx-auto flex gap-2">

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
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
  )
}