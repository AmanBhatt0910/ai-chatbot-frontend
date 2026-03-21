import { type ReactNode, useState } from "react"
import Sidebar from "./Sidebar"
import { useChatStore } from "@/store/chatStore"
import { Bot, Menu } from "lucide-react"

interface Props {
  children: ReactNode
  activeCategory?: string | null
}

export default function ChatLayout({ children, activeCategory }: Props) {
  const { activeConversation, conversations } = useChatStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeTitle = conversations.find((c) => c.id === activeConversation)?.title

  // Header title: show category if set, otherwise conversation title, then fallback
  const headerTitle = activeCategory
    ? activeCategory
    : activeTitle ?? "AI Chat"

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div className="h-14 border-b border-border/40 flex items-center px-4 md:px-6 gap-3 shrink-0 bg-background/80 backdrop-blur-sm">
          {/* Hamburger — only on mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors shrink-0"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm shrink-0">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm text-foreground truncate">
              {headerTitle}
            </span>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 ml-auto shrink-0">
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