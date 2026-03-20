import { useEffect, useRef, useState } from "react"
import type { Message } from "@/types/Message"
import ChatMessage from "./ChatMessage"
import TypingIndicator from "./TypingIndicator"
import { useChatStore } from "@/store/chatStore"
import { Sparkles } from "lucide-react"

interface Props {
  messages: Message[]
}

export default function ChatWindow({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const { isTyping } = useChatStore()

  // ID of the one AI message that should animate.
  // Only set when a real-time response arrives (isTyping true → false).
  const [liveMessageId, setLiveMessageId] = useState<number | null>(null)

  // Snapshot of IDs present when typing began — stored in a ref so it
  // doesn't cause re-renders and is never read during render.
  const prevIdsRef = useRef<Set<number>>(new Set())

  // Capture snapshot the moment typing starts.
  useEffect(() => {
    if (isTyping) {
      prevIdsRef.current = new Set(messages.map((m) => m.id))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping])

  // When typing stops, find the newly arrived AI message and mark it live.
  useEffect(() => {
    if (!isTyping) {
      const newAiMsg = messages.find(
        (m) => m.role !== "USER" && !prevIdsRef.current.has(m.id)
      )
      if (newAiMsg) {
        setLiveMessageId(newAiMsg.id)
      }
    }
  }, [isTyping, messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6 select-none">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center shadow-inner">
          <Sparkles className="w-7 h-7 text-muted-foreground/60" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-foreground">Start a conversation</p>
          <p className="text-sm text-muted-foreground">
            Ask anything or choose a category below to get started
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 scroll-smooth">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isOwn={msg.role === "USER"}
            animate={msg.id === liveMessageId}
          />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}