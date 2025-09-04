import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/Home";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import NotFoundPage from "../pages/NotFound";
import MainLayout from "../layout";
import CategoryPage from "../pages/CategoryPage";
import AdminPage from "../pages/Admin";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPasswordPage from "../pages/ForgotPassword";
import ResetPasswordPage from "../pages/ResetPassword";
import OAuth2RedirectHandler from "../pages/OAuth2RedirectHandler";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
      {
        path: "/category/:categoryKey",
        element: <CategoryPage />,
      },
      { path: "/oauth2/redirect", element: <OAuth2RedirectHandler /> },
      {
        path: "/admin",
        element: <ProtectedRoute />,
        children: [{ index: true, element: <AdminPage /> }],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
