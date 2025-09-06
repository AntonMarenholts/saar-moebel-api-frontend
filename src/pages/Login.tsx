import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";

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

        setErrorMessage(resMessage);
        setLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Вход</h1>
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
              {...register("username", { required: "Имя пользователя обязательно" })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
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
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
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
              className="w-full px-4 py-2 font-bold text-white bg-brand-primary rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400"
            >
              {loading ? "Загрузка..." : "Войти"}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Еще нет аккаунта?{" "}
          <Link to="/register" className="font-medium text-brand-primary hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}