 
import { useForm, type SubmitHandler} from 'react-hook-form';
import AuthService from '../services/auth.service';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState } from 'react';

type Inputs = {
  email: string;
};

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setLoading(true);
    setMessage('');
    AuthService.forgotPassword(data.email).then(
      () => {
        setMessage(t('forgot_password_success'));
        setLoading(false);
      },
      () => {
        // Показываем то же сообщение даже при ошибке, чтобы не раскрывать email
        setMessage(t('forgot_password_success'));
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
        <h1 className="text-2xl font-bold text-center text-gray-800">{t('forgot_password_title')}</h1>
        {!message ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-sm text-gray-600">{t('forgot_password_instructions')}</p>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('email')}
              </label>
              <input
                id="email"
                type="email"
                {...register('email', { required: t('email_required') })}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
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
        ) : (
          <div className="p-4 text-sm text-green-800 bg-green-100 rounded-md">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}