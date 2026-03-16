import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import type { ReactNode } from "react"

interface Props {
  title: string
  children: ReactNode
}

export default function AuthCard({ title, children }: Props) {
  return (
    <Card className="shadow-lg">

      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {children}
      </CardContent>

    </Card>
  )
}