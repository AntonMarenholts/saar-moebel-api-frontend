import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";

// URL для старта входа через Google
const GOOGLE_AUTH_URL = import.meta.env.VITE_GOOGLE_LOGIN_URL;

// Тип для данных формы
type Inputs = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setLoading(true);
    setErrorMessage("");

    AuthService.login(data.username, data.password)
      .then((user) => {
        // Проверяем роль пользователя для перенаправления
        if (user.roles.includes("ROLE_ADMIN")) {
          navigate("/admin/dashboard"); // Админа на его страницу
        } else {
          navigate("/profile"); // Обычного пользователя - в профиль
        }
        window.location.reload(); // Перезагружаем, чтобы все компоненты обновились
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        // ++ ИЗМЕНЕНИЕ: Используем resMessage вместо статичного текста ++
        setErrorMessage(resMessage);
        setLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <Link
          to="/"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Link>

        <h1 className="text-2xl font-bold text-center text-gray-800">Вход</h1>
        <a
          href={GOOGLE_AUTH_URL}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <path
              fill="#4285F4"
              d="M24 9.5c3.2 0 5.8 1.4 7.7 3.2l5.8-5.8C34.4 3.2 29.6 1 24 1 14.9 1 7.4 6.6 4.1 14.5l7.1 5.5C12.4 13.1 17.8 9.5 24 9.5z"
            ></path>
            <path
              fill="#34A853"
              d="M46.2 25.1c0-1.6-.1-3.2-.4-4.7H24v8.9h12.5c-.5 2.9-2.2 5.3-4.7 6.9l7.1 5.5c4.1-3.8 6.7-9.3 6.7-15.6z"
            ></path>
            <path
              fill="#FBBC05"
              d="M11.2 20C10.7 18.5 10.4 17 10.4 15.4s.3-3.1.8-4.6l-7.1-5.5C1.5 10.1 0 14.6 0 19.6s1.5 9.5 4.1 13.7l7.1-5.5c-.5-1.5-.8-3-.8-4.6z"
            ></path>
            <path
              fill="#EA4335"
              d="M24 47.1c5.6 0 10.4-1.8 13.9-5l-7.1-5.5c-1.9 1.2-4.2 2-6.8 2-6.2 0-11.6-3.6-13.5-8.6l-7.1 5.5C7.4 41.5 14.9 47.1 24 47.1z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          Войти через Google
        </a>
        <div className="flex items-center justify-center">
          <span className="w-full border-t border-gray-300"></span>
          <span className="px-2 text-xs text-gray-500 bg-white">ИЛИ</span>
          <span className="w-full border-t border-gray-300"></span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Имя пользователя
            </label>
            <input
              id="username"
              type="text"
              {...register("username", {
                required: "Имя пользователя обязательно",
              })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              {...register("password", { required: "Пароль обязателен" })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">
              {errorMessage}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-bold text-white bg-brand-blue rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-gray-400"
            >
              {loading ? "Загрузка..." : "Войти"}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Еще нет аккаунта?{" "}
          <Link
            to="/register"
            className="font-medium text-brand-blue hover:underline"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
