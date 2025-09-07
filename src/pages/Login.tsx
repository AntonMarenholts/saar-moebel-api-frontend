import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import { useTranslation } from "react-i18next";

// URL для старта входа через Google
const GOOGLE_AUTH_URL = import.meta.env.VITE_GOOGLE_LOGIN_URL;

// Тип для данных формы
type Inputs = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        if (user.roles.includes("ROLE_ADMIN")) {
          navigate("/admin/dashboard");
        } else {
          navigate("/profile");
        }
        window.location.reload();
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
      <div className="relative w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <Link to="/" className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-center text-gray-800">{t('login')}</h1>

        <a 
          href={GOOGLE_AUTH_URL} 
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M24 9.5c3.2 0 5.8 1.4 7.7 3.2l5.8-5.8C34.4 3.2 29.6 1 24 1 14.9 1 7.4 6.6 4.1 14.5l7.1 5.5C12.4 13.1 17.8 9.5 24 9.5z"></path>
            <path fill="#34A853" d="M46.2 25.1c0-1.6-.1-3.2-.4-4.7H24v8.9h12.5c-.5 2.9-2.2 5.3-4.7 6.9l7.1 5.5c4.1-3.8 6.7-9.3 6.7-15.6z"></path>
            <path fill="#FBBC05" d="M11.2 20C10.7 18.5 10.4 17 10.4 15.4s.3-3.1.8-4.6l-7.1-5.5C1.5 10.1 0 14.6 0 19.6s1.5 9.5 4.1 13.7l7.1-5.5c-.5-1.5-.8-3-.8-4.6z"></path>
            <path fill="#EA4335" d="M24 47.1c5.6 0 10.4-1.8 13.9-5l-7.1-5.5c-1.9 1.2-4.2 2-6.8 2-6.2 0-11.6-3.6-13.5-8.6l-7.1 5.5C7.4 41.5 14.9 47.1 24 47.1z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          {t('login_with_google')}
        </a>

        <div className="flex items-center justify-center">
            <span className="w-full border-t border-gray-300"></span>
            <span className="px-2 text-xs text-gray-500 bg-white">{t('or_separator')}</span>
            <span className="w-full border-t border-gray-300"></span>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              {t('username')}
            </label>
            <input
              id="username"
              type="text"
              {...register("username", { required: t('username_required') })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t('password')}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", { required: t('password_required') })}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.73 5.943 5.522 3 10 3s8.27 2.943 9.542 7c-1.272 4.057-5.022 7-9.542 7S1.73 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.27 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.242 4.242a2 2 0 012.828 2.828l-2.828-2.828zM10 17a7 7 0 01-7-7c0-1.789.66-3.443 1.764-4.752l1.432 1.432A4.982 4.982 0 008 10a5 5 0 005 5c.28 0 .553-.024.82-.07l1.432 1.432A6.96 6.96 0 0110 17z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          
          <div className="text-sm text-right">
            <Link to="/forgot-password" className="font-medium text-brand-blue hover:underline">
              {t('forgot_password')}
            </Link>
          </div>

          {errorMessage && (
            <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">
              {errorMessage.includes("Failed with status code 401") ? t('login_error_generic') : errorMessage}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-bold text-white bg-brand-blue rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-gray-400"
            >
              {loading ? t('loading') : t('login')}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          {t('no_account_yet')}{" "}
          <Link to="/register" className="font-medium text-brand-blue hover:underline">
            {t('register')}
          </Link>
        </p>
      </div>
    </div>
  );
}