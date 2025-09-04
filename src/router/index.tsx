import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/Home";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import NotFoundPage from "../pages/NotFound";
import MainLayout from "../layout";
import CategoryPage from "../pages/CategoryPage";
// --- ДОБАВЛЯЕМ ИМПОРТЫ ---
import AdminPage from "../pages/Admin";
import ProtectedRoute from "./ProtectedRoute";
// -------------------------

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        path: "/category/:categoryKey",
        element: <CategoryPage />,
      },
      // --- ДОБАВЛЯЕМ НОВЫЙ ЗАЩИЩЕННЫЙ МАРШРУТ ---
      {
        path: "/admin",
        element: <ProtectedRoute />,
        children: [{ index: true, element: <AdminPage /> }],
      },
      // -----------------------------------------
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
