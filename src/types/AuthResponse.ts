export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    username: string
  }
}