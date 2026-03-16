import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface Props {
  children: ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <img src="/logo.png" alt="AI Chat" className="h-10" />

          <p className="text-sm text-muted-foreground">
            Your AI assistant for everything
          </p>
        </div>

        {children}

      </motion.div>

    </div>
  )
}