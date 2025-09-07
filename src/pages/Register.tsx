import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import { useTranslation } from "react-i18next";

// Тип для данных формы
type Inputs = {
  username: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- Добавлено

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    AuthService.register(data.username, data.email, data.password)
      .then(() => {
        setSuccessMessage(t('registration_success'));
        setLoading(false);
        setTimeout(() => navigate("/login"), 3000);
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
        
        <h1 className="text-2xl font-bold text-center text-gray-800">{t('register')}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              {...register("email", { required: t('email_required') })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
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
                    {...register("password", { required: t('password_required'), minLength: { value: 6, message: t('password_min_length') } })}
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
          
          {errorMessage && (
            <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">
              {errorMessage}
            </div>
          )}

          {successMessage && (
             <div className="p-3 text-sm text-green-800 bg-green-100 rounded-md">
              {successMessage}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-bold text-white bg-brand-blue rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-gray-400"
            >
              {loading ? t('loading') : t('register')}
            </button>
          </div>
        </form>
         <p className="text-sm text-center text-gray-600">
          {t('already_have_account')}{" "}
          <Link to="/login" className="font-medium text-brand-blue hover:underline">
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  );
}