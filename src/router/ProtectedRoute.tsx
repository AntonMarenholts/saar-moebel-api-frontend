import AuthService from "../services/auth.service";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const user = AuthService.getCurrentUser();

  // --- ИЗМЕНЯЕМ ПРОВЕРКУ ЗДЕСЬ ---
  // Проверяем одно поле 'role', а не массив 'roles'
  const isAdmin = user && user.role === "ROLE_ADMIN";
  // --------------------------------

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
