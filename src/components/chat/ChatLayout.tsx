import type { ReactNode } from "react"
import Sidebar from "./Sidebar"

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-14 border-b flex items-center px-6 font-medium shrink-0">
          AI Chat
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}