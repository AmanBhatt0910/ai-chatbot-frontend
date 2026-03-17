import { useChatStore } from "@/store/chatStore"
// import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import api from "@/api/axios"
import type { Conversation } from "@/types/Conversation"

export default function Sidebar() {

  const {
    conversations,
    activeConversation,
    setActiveConversation,
    setConversations,
  } = useChatStore()

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
  }, [setConversations, setActiveConversation])


  return (
    <div className="w-64 border-r h-full flex flex-col">

      {/* Header */}
      <div className="p-4 border-b font-semibold">
        Conversations
      </div>

      {/* New Chat */}
      {/* <div className="p-3">
        <Button onClick={handleCreateChat} className="w-full">
          + New Chat
        </Button>
      </div> */}

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">

        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setActiveConversation(conv.id)}
            className={cn(
              "px-3 py-2 rounded-md cursor-pointer text-sm",
              activeConversation === conv.id
                ? "bg-muted font-medium"
                : "hover:bg-muted"
            )}
          >
            {conv.title}
          </div>
        ))}

      </div>

    </div>
  )
}