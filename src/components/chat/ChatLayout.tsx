import type { ReactNode } from "react"
import Sidebar from "./Sidebar"

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex bg-background">

      <Sidebar />

      <div className="flex-1 flex flex-col">
        {children}
      </div>

    </div>
  )
}