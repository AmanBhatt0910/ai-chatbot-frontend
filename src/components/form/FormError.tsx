import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  message?: string
}

export default function FormError({ message }: Props) {
  if (!message) return null

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-destructive text-sm px-3 py-2.5 rounded-lg bg-destructive/8 border border-destructive/20",
        "animate-in fade-in slide-in-from-top-1 duration-200"
      )}
    >
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}