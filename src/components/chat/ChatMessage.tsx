import type { Message } from "@/types/Message"
import { cn } from "@/lib/utils"

interface Props {
  message: Message
  isOwn: boolean
}

export default function ChatMessage({ message, isOwn }: Props) {
  return (
    <div
      className={cn(
        "flex w-full",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-xl px-4 py-2 text-sm shadow",
          isOwn
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        {message.content}
      </div>
    </div>
  )
}