import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProfilePage from './pages/Profile';
import AdminDashboardPage from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFound';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';
import AddProductPage from './pages/AddProduct';
import AdminRoute from './components/auth/AdminRoute';
import ManageCategoriesPage from './pages/ManageCategories'; // <-- Импортируем новую страницу
import ManageNewsPage from './pages/ManageNews';
import CategoryPage from './pages/CategoryPage';

function App() {
  return (
    <Routes>
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

      <Route element={<MainLayout />}>
        {/* --- Публичные страницы --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        
        {/* --- Страницы для авторизованных пользователей --- */}
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* --- Защищенные страницы только для АДМИНА --- */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/add-product" element={<AddProductPage />} />
          <Route path="/admin/categories" element={<ManageCategoriesPage />} /> 
          <Route path="/admin/news" element={<ManageNewsPage />} />
        </Route>

        {/* --- Страница не найдена --- */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;