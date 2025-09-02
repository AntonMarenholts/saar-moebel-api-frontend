import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Регистрация</h2>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Поля для регистрации пока будут здесь */}
        <p className="text-center text-sm">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="font-bold text-blue-600 hover:text-blue-800">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}