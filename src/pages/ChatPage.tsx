import { useChat } from "@/hooks/useChat"
import ChatLayout from "@/components/chat/ChatLayout"
import ChatWindow from "@/components/chat/ChatWindow"
import ChatInput from "@/components/chat/ChatInput"

export default function ChatPage() {
  const {
    messages,
    sendMessage,
    setCategory,
    activeConversation,
    hasCategory,
    activeCategory,
    isLoadingMessages,
  } = useChat()

  if (!activeConversation) {
    return (
      <ChatLayout activeCategory={null}>
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Select or create a conversation 💬
        </div>
      </ChatLayout>
    )
  }

  return (
    <ChatLayout activeCategory={activeCategory}>
      <ChatWindow messages={messages} />
      <ChatInput
        onSend={sendMessage}
        onSetCategory={setCategory}
        hasCategory={hasCategory}
        isLoadingMessages={isLoadingMessages}
      />
    </ChatLayout>
  )
}