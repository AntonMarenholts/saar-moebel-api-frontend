import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { useTranslation } from 'react-i18next';

type Inputs = {
  password: string;
};

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      setMessage(t('token_invalid'));
      setIsError(true);
    }
  }, [searchParams, t]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (!token) return;
    setLoading(true);
    setMessage('');
    setIsError(false);

    AuthService.resetPassword(token, data.password).then(
      () => {
        setMessage(t('reset_password_success'));
        setLoading(false);
        setTimeout(() => navigate('/login'), 3000);
      },
      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          t('token_invalid');
        setMessage(resMessage);
        setIsError(true);
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <Link to="/" className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </Link>
        <h1 className="text-2xl font-bold text-center text-gray-800">{t('reset_password_title')}</h1>

        {message && (
          <div className={`p-4 text-sm rounded-md ${isError ? 'text-red-800 bg-red-100' : 'text-green-800 bg-green-100'}`}>
            {message}
          </div>
        )}

        {token && !isError && !message.includes(t('reset_password_success')) && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('new_password')}
              </label>
              <input
                id="password"
                type="password"
                {...register('password', { required: t('password_required'), minLength: { value: 6, message: t('password_min_length') } })}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-bold text-white bg-brand-blue rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? t('loading') : t('reset_password_submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}