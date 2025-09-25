
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../../services/auth.service';

const AdminRoute = () => {
    const currentUser = AuthService.getCurrentUser();

    
    const isAdmin = currentUser && currentUser.roles.includes('ROLE_ADMIN');

    return isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;