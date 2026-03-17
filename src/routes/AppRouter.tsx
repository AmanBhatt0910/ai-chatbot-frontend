import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import ChatPage from "../pages/ChatPage"
import ProtectedRoute from "./ProtectedRoute"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" replace />} />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}