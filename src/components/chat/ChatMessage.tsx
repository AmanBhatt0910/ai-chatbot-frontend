import type { Message } from "@/types/Message"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Props {
  message: Message
  isOwn: boolean
}

export default function ChatMessage({ message, isOwn }: Props) {

  const initials = isOwn ? "U" : "AI"

  return (
    <div
      className={cn(
        "flex gap-3",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      {!isOwn && (
        <Avatar>
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[65%] rounded-2xl px-4 py-3 text-sm shadow-sm",
          isOwn
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        <div className="text-[10px] mt-1 opacity-60">
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>

      {isOwn && (
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}