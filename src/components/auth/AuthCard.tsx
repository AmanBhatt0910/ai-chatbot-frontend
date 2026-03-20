import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import type { ReactNode } from "react"

interface Props {
  title: string
  children: ReactNode
}

export default function AuthCard({ title, children }: Props) {
  return (
    <Card className="shadow-xl border-border/60 bg-card/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-xl font-semibold tracking-tight">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 pt-2">
        {children}
      </CardContent>
    </Card>
  )
}