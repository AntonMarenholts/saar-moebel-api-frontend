import { useTranslation } from "react-i18next";
import { useState } from "react";
import AuthService from "../../services/auth.service";
import { NavLink } from "react-router-dom";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await AuthService.requestPasswordReset(email);
      setMessage(response.data.message);
    } catch (err) {
      console.error(err); // Добавлено для отладки
      setError("Failed to send reset link. Please check your email address.");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">{t("forgot_password_title")}</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            {t("email_label")}
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder={t("email_placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-brand-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {t("send_reset_link_button")}
          </button>
        </div>
        {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </form>
      <div className="text-center text-sm">
        <NavLink to="/login" className="font-bold text-brand-blue hover:underline">
          {t("back_to_login")}
        </NavLink>
      </div>
    </div>
  );
}