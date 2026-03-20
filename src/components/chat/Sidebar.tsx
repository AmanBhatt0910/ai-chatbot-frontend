import { useChatStore } from "@/store/chatStore"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import api from "@/api/axios"
import type { Conversation } from "@/types/Conversation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/authStore"
import { websocketService } from "@/services/websocketService"
import { Plus, Trash2, LogOut, MessageSquare } from "lucide-react"

export default function Sidebar() {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    setConversations,
  } = useChatStore()

  const { user, logout, setUser } = useAuthStore()

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/api/conversations")
        const mapped: Conversation[] = res.data.map((c: Conversation) => ({
          id: c.id,
          title: c.title ?? `Chat ${c.id}`,
          createdAt: c.createdAt,
        }))
        setConversations(mapped)
        if (mapped.length > 0) setActiveConversation(mapped[0].id)
      } catch (err) {
        console.error("Failed to fetch conversations", err)
      }
    }
    fetchConversations()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/users/me")
        setUser(res.data)
      } catch (err) {
        console.error("Failed to fetch user", err)
      }
    }
    fetchUser()
  }, [setUser])

  const createNewChat = async () => {
    try {
      const res = await api.post("/api/conversations")
      const newConv: Conversation = {
        id: res.data.id,
        title: res.data.title ?? "New Chat",
        createdAt: res.data.createdAt,
      }
      setConversations([newConv, ...conversations])
      setActiveConversation(newConv.id)
    } catch (err) {
      console.error("Failed to create conversation", err)
    }
  }

  const deleteConversation = async (id: number) => {
    try {
      await api.delete(`/api/conversations/${id}`)
      const updated = conversations.filter((c) => c.id !== id)
      setConversations(updated)
      if (activeConversation === id) {
        setActiveConversation(updated.length > 0 ? updated[0].id : null)
      }
    } catch (err) {
      console.error("Failed to delete conversation", err)
    }
  }

  const handleLogout = () => {
    websocketService.disconnect()
    logout()
  }

  return (
    <div className="w-72 h-screen shrink-0 border-r flex flex-col bg-sidebar">

      {/* Logo */}
      <div className="p-4 border-b border-border/40">
        <img src="/logo.png" alt="Logo" className="h-9 w-auto" />
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={createNewChat}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
            "bg-primary text-primary-foreground",
            "hover:opacity-90 hover:shadow-md active:scale-[0.98]"
          )}
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Section label */}
      {conversations.length > 0 && (
        <div className="px-4 pb-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Conversations
          </span>
        </div>
      )}

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5 pb-2">
        {conversations.length === 0 && (
          <div className="flex flex-col items-center gap-2 mt-10 text-center px-4">
            <MessageSquare className="w-8 h-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground/60">
              No conversations yet
            </p>
          </div>
        )}

        {conversations.map((conv) => {
          const isActive = activeConversation === conv.id
          return (
            <div
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={cn(
                "relative flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all duration-150 group",
                isActive
                  ? "bg-background shadow-sm border border-border/60 text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
              )}

              <MessageSquare className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-primary" : "text-muted-foreground/50")} />
              <span className="truncate flex-1 leading-snug">{conv.title}</span>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteConversation(conv.id)
                }}
                className={cn(
                  "shrink-0 p-1 rounded-lg text-muted-foreground/50 transition-all duration-150",
                  "opacity-0 group-hover:opacity-100",
                  "hover:text-destructive hover:bg-destructive/10"
                )}
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        })}
      </div>

      {/* User Profile */}
      {user && (
        <div className="border-t border-border/40 p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-muted/60 transition-colors group">
            <Avatar className="ring-2 ring-border/50 shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-800 text-white text-xs font-bold">
                {user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate text-foreground">{user.username}</div>
              <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className={cn(
                "shrink-0 p-1.5 rounded-lg text-muted-foreground/50 transition-all duration-150",
                "opacity-0 group-hover:opacity-100",
                "hover:text-destructive hover:bg-destructive/10"
              )}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}