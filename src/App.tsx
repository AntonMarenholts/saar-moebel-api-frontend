import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ProfilePage from "./pages/Profile";
import AdminDashboardPage from "./pages/AdminDashboard";
import NotFoundPage from "./pages/NotFound";
import OAuth2RedirectHandler from "./pages/OAuth2RedirectHandler";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import AdminRoute from "./components/auth/AdminRoute";
import ManageCategoriesPage from "./pages/ManageCategories";
import ManageNewsPage from "./pages/ManageNews";
import CategoryPage from "./pages/CategoryPage";
import PromotionsPage from "./pages/PromotionsPage";
import ManagePromotionsPage from "./pages/ManagePromotions";
import PromotionDetailPage from "./pages/PromotionDetailPage";
import CartPage from "./pages/CartPage"; 
import CollectionPage from "./pages/CollectionPage";
import UserRoute from "./components/auth/UserRoute"; 
import AddCollectionPage from "./pages/admin/AddCollectionPage";
import AddElementPage from "./pages/admin/AddElementPage"; 
import EditCollectionPage from "./pages/admin/EditCollectionPage";

function App() {
  return (
    <Routes>
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

      <Route element={<MainLayout />}>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/promotions" element={<PromotionsPage />} />
        <Route path="/promotion/:id" element={<PromotionDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/collection/:slug" element={<CollectionPage />} />

        
        <Route element={<UserRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>

        
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/add-collection" element={<AddCollectionPage />} />
          <Route path="/admin/categories" element={<ManageCategoriesPage />} />
          <Route path="/admin/news" element={<ManageNewsPage />} />
          <Route path="/admin/promotions" element={<ManagePromotionsPage />} />
          <Route path="/admin/collection/:id/edit" element={<EditCollectionPage />} />
          <Route path="/admin/collection/:collectionId/add-element" element={<AddElementPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;