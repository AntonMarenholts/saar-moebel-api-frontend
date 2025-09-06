import React from 'react';
import AuthService from '../services/auth.service';

export default function ProfilePage() {
    const currentUser = AuthService.getCurrentUser();

    return (
        <div className="p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800">Профиль пользователя</h1>
            {currentUser ? (
                <div className="mt-4 space-y-2">
                    <p><strong>ID:</strong> {currentUser.id}</p>
                    <p><strong>Имя пользователя:</strong> {currentUser.username}</p>
                    <p><strong>Email:</strong> {currentUser.email}</p>
                    <p><strong>Роли:</strong> {currentUser.roles.join(', ')}</p>
                </div>
            ) : (
                <p>Пользователь не найден.</p>
            )}
        </div>
    );
}