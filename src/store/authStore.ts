import { create } from "zustand"
import { login, register } from "../api/authApi"
import type { User } from "../types/User"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean

  setUser: (user: User) => void

  login: (identifier: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),

  // ✅ NEW
  setUser: (user) => set({ user }),

  login: async (identifier, password) => {
    const data = await login(identifier, password)

    localStorage.setItem("token", data.token)

    set({
      token: data.token,
      user: data.user,
      isAuthenticated: true,
    })
  },

  register: async (username, email, password) => {
    const data = await register(username, email, password)

    localStorage.setItem("token", data.token)

    set({
      token: data.token,
      user: data.user,
      isAuthenticated: true,
    })
  },

  logout: () => {
    localStorage.removeItem("token")

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  },
}))