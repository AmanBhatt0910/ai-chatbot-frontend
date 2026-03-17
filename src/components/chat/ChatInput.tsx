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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t p-4 bg-background">
      <div className="flex gap-2 items-end">

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          rows={1}
        />

        <Button onClick={handleSend}>
          Send
        </Button>

      </div>
    </div>
  )
}