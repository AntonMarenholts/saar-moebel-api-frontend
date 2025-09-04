import { Link } from "react-router-dom";

export default function LoginPage() {
  const googleLoginUrl = import.meta.env.VITE_GOOGLE_LOGIN_URL;

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Вход</h2>

      {/* Кнопка входа через Google */}
      <a
        href={googleLoginUrl}
        className="flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 mb-6"
      >
        <img
          className="h-6 w-6 mr-2"
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google sign-in"
        />
        Войти через Google
      </a>

      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-400">Или</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Ваши поля для обычного входа */}
        <p className="text-center text-sm">
          Забыли пароль?{" "}
          <Link
            to="/forgot-password"
            className="font-bold text-brand-blue hover:text-blue-800"
          >
            Сбросить
          </Link>
        </p>
        <p className="text-center text-sm mt-2">
          Еще нет аккаунта?{" "}
          <Link
            to="/register"
            className="font-bold text-blue-600 hover:text-blue-800"
          >
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </div>
  );
}
