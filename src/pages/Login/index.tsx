import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Вход</h2>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Поля для входа пока будут здесь */}
        <p className="text-center text-sm">
          Еще нет аккаунта?{" "}
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-800">
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </div>
  );
}