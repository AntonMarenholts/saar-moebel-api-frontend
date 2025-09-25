import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../../services/auth.service';

const UserRoute = () => {
    const currentUser = AuthService.getCurrentUser();

    
    return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default UserRoute;