import api from "./axios"
import type { AuthResponse } from "../types/AuthResponse"

export const login = async (identifier: string, password: string) => {
  const response = await api.post<AuthResponse>("/api/auth/login", {
    identifier,
    password,
  })

  return response.data
}

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await api.post<AuthResponse>("/api/auth/register", {
    username,
    email,
    password,
  })

  return response.data
}