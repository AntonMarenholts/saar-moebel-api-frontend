import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import type { CurrentUser } from "../../types";

export default function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      try {
        const decodedToken: Omit<CurrentUser, 'token'> = jwtDecode(token);
        const user: CurrentUser = { ...decodedToken, token };
        login(user);
        navigate("/");
      } catch (error) {
        console.error("Failed to decode JWT token", error);
        navigate("/login");
      }
    } else {
      // Если токена нет, перенаправляем на страницу входа
      navigate("/login");
    }
  }, [searchParams, navigate, login]);

  return <div>Загрузка...</div>;
}