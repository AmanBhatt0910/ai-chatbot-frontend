import { useChatStore } from "@/store/chatStore"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import api from "@/api/axios"
import type { Conversation } from "@/types/Conversation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/authStore"
import { websocketService } from "@/services/websocketService"

export default function Sidebar() {

  const {
    conversations,
    activeConversation,
    setActiveConversation,
    setConversations,
  } = useChatStore()

  const { user, logout, setUser } = useAuthStore()

  // ── Fetch conversations on mount ───────────────────────────────────────
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

        if (mapped.length > 0) {
          setActiveConversation(mapped[0].id)
        }
      } catch (err) {
        console.error("Failed to fetch conversations", err)
      }
    }

    fetchConversations()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch current user on mount ────────────────────────────────────────
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

  // ── Create new conversation ────────────────────────────────────────────
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

  // ── Delete conversation ────────────────────────────────────────────────
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

  // ── Logout: disconnect WS first ────────────────────────────────────────
  const handleLogout = () => {
    websocketService.disconnect()
    logout()
  }

  return (
    <div className="w-72 h-screen shrink-0 border-r flex flex-col bg-muted/40">

      {/* Logo */}
      <div className="p-4 font-semibold text-lg">
        <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
      </div>

      {/* New Chat Button */}
      <div className="p-2">
        <button
          onClick={createNewChat}
          className="w-full px-3 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800 transition"
        >
          + New Chat
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {conversations.length === 0 && (
          <p className="text-xs text-muted-foreground text-center mt-6">
            No conversations yet
          </p>
        )}

        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setActiveConversation(conv.id)}
            className={cn(
              "px-3 py-2 rounded-lg cursor-pointer text-sm transition flex justify-between items-center group",
              activeConversation === conv.id
                ? "bg-background shadow"
                : "hover:bg-muted"
            )}
          >
            <span className="truncate flex-1">{conv.title}</span>

            <button
              onClick={(e) => {
                e.stopPropagation()
                deleteConversation(conv.id)
              }}
              className="text-xs text-red-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* User Profile */}
      {user && (
        <div className="border-t p-4 flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-sm min-w-0">
            <div className="font-medium truncate">{user.username}</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs text-red-500 hover:underline shrink-0"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}