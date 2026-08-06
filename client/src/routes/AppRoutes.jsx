import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<AuthLayout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;