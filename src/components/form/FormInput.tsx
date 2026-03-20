import { Input } from "../ui/input"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  label: string
  type?: string
  value: string
  icon?: LucideIcon
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FormInput({
  label,
  type = "text",
  value,
  icon: Icon,
  onChange,
}: Props) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
        {label}
      </label>

      <div className="relative group">
        {Icon && (
          <Icon
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200",
              "text-muted-foreground/50 group-focus-within:text-primary"
            )}
          />
        )}

        <Input
          type={type}
          value={value}
          onChange={onChange}
          className={cn(
            Icon ? "pl-10" : "",
            "h-10 transition-all duration-200",
            "bg-muted/40 border-border/60 focus-visible:bg-background"
          )}
        />
      </div>
    </div>
  )
}