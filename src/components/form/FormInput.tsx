import { Input } from "../ui/input"
import type { LucideIcon } from "lucide-react"

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
    <div className="space-y-2">

      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>

      <div className="relative">

        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        )}

        <Input
          type={type}
          value={value}
          onChange={onChange}
          className={Icon ? "pl-10" : ""}
        />

      </div>

    </div>
  )
}