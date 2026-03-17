import { useState } from "react"
import { useChat } from "../hooks/useChat"

export default function ChatPage() {

  const { messages, sendMessage } = useChat()
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    sendMessage(input)
    setInput("")
  }

  return (
    <div className="flex flex-col h-screen">

      <div className="flex-1 overflow-auto p-6 space-y-4">

        {messages.map((msg) => (
          <div key={msg.id}>
            <b>{msg.role}:</b> {msg.content}
          </div>
        ))}

      </div>

      <div className="border-t p-4 flex gap-2">

        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />

        <button
          onClick={handleSend}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Send
        </button>

      </div>

    </div>
  )
}