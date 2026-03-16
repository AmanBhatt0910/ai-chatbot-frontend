import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import { useAuthStore } from "@/store/authStore"

import AuthLayout from "@/components/layout/AuthLayout"
import AuthCard from "@/components/auth/AuthCard"
import FormInput from "@/components/form/FormInput"
import FormError from "@/components/form/FormError"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { User, Mail, Lock } from "lucide-react"

export default function RegisterPage() {

  const navigate = useNavigate()
  const register = useAuthStore((state) => state.register)

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setError(null)
      setLoading(true)

      await register(username, email, password)
      toast.success("Account created successfully")

      navigate("/chat")
    } catch {
      setError("Registration failed. Please try again.")
      toast.error("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>

      <AuthCard title="Create account">

        <form onSubmit={handleSubmit} className="space-y-4">

          <FormInput
            label="Username"
            icon={User}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <FormInput
            label="Email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormInput
            label="Password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <FormError message={error ?? undefined} />

          <Button
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </Button>

        </form>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline"
          >
            Login
          </Link>
        </p>

      </AuthCard>

    </AuthLayout>
  )
}