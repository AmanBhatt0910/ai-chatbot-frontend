import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import { useAuthStore } from "../store/authStore"

import AuthLayout from "../components/layout/AuthLayout"
import AuthCard from "../components/auth/AuthCard"
import FormInput from "../components/form/FormInput"
import FormError from "../components/form/FormError"

import { Button } from "../components/ui/button"

import { toast } from "sonner"

import { User, Lock } from "lucide-react"

export default function LoginPage() {

  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setError(null)
      setLoading(true)

      await login(identifier, password)
      toast.success("Login successful")

      navigate("/chat")
    } catch (err) {
      console.error(err);
      setError("Invalid username or password")
      toast.error("Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>

      <AuthCard title="Welcome back">

        <form onSubmit={handleSubmit} className="space-y-4">

          <FormInput
            label="Email or Username"
            value={identifier}
            icon={User}
            onChange={(e) => setIdentifier(e.target.value)}
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
            {loading ? "Signing in..." : "Login"}
          </Button>

        </form>

        <p className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary hover:underline"
          >
            Register
          </Link>
        </p>

      </AuthCard>

    </AuthLayout>
  )
}