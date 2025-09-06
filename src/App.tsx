import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProfilePage from './pages/Profile';
import AdminDashboardPage from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFound';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler'; // <-- импорт

function App() {
  return (
    <Routes>
        {/* Маршрут для OAuth2 не должен иметь общего лейаута, так как это просто обработчик */}
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

        <Route element={<MainLayout />}>
            {/* Публичные страницы */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Страницы для авторизованных пользователей */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

            {/* Маршрут для всех остальных случаев (404) */}
            <Route path="*" element={<NotFoundPage />} />
        </Route>
    </Routes>
  );
}

export default App;