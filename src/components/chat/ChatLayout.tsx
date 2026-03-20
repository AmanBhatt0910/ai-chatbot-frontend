import type { ReactNode } from "react"
import Sidebar from "./Sidebar"
import { useChatStore } from "@/store/chatStore"
import { Bot } from "lucide-react"

export default function ChatLayout({ children }: { children: ReactNode }) {
  const { activeConversation, conversations } = useChatStore()

  const activeTitle = conversations.find((c) => c.id === activeConversation)?.title

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 border-b border-border/40 flex items-center px-6 gap-3 shrink-0 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm text-foreground">
              {activeTitle ?? "AI Chat"}
            </span>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-muted-foreground/60 font-medium">Online</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}