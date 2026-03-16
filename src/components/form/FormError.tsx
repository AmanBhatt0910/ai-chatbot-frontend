import { AlertCircle } from "lucide-react"

interface Props {
  message?: string
}

export default function FormError({ message }: Props) {
  if (!message) return null

  return (
    <div className="flex items-center gap-2 text-destructive text-sm">
      <AlertCircle size={16} />
      <span>{message}</span>
    </div>
  )
}