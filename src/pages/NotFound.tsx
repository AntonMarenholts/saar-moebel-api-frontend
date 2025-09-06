import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center text-center h-full">
            <h1 className="text-6xl font-bold text-brand-dark">404</h1>
            <p className="text-xl mt-4 text-gray-600">Страница не найдена</p>
            <p className="mt-2 text-gray-500">К сожалению, мы не смогли найти страницу, которую вы ищете.</p>
            <Link to="/" className="mt-8 px-6 py-3 text-white bg-brand-blue rounded-md hover:bg-blue-600">
                Вернуться на главную
            </Link>
        </div>
    );
}