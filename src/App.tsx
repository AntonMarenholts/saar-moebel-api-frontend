import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register'; // <-- импорт
import ProfilePage from './pages/Profile'; // <-- импорт
import AdminDashboardPage from './pages/AdminDashboard'; // <-- импорт

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Публичные страницы */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> {/* <-- новый маршрут */}
        
        {/* Страницы для авторизованных пользователей */}
        <Route path="/profile" element={<ProfilePage />} /> {/* <-- новый маршрут */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} /> {/* <-- новый маршрут */}

      </Route>
    </Routes>
  );
}

export default App;