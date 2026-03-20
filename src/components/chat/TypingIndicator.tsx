import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Avatar className="shrink-0 mt-0.5 ring-2 ring-border/50 shadow-sm">
        <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-900 text-white text-xs font-semibold">
          AI
        </AvatarFallback>
      </Avatar>

      <div className="bg-card border border-border/60 rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}