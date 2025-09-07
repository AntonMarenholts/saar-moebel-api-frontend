
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../../services/auth.service';

const AdminRoute = () => {
    const currentUser = AuthService.getCurrentUser();

    // Проверяем, есть ли пользователь и есть ли у него роль ADMIN
    const isAdmin = currentUser && currentUser.roles.includes('ROLE_ADMIN');

    // Если пользователь - админ, показываем содержимое страницы.
    // Если нет - перенаправляем на страницу входа.
    return isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;