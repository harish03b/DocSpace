import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage";

import ProtectedRoute from "./ProtectedRoute";

import DocumentEditor from "../features/document/DocumentEditor";
import CreateDocument from "../features/document/CreateDocument";

const AppRoutes = () => {
  return (
    <Routes>
      {/* =====================================================
          ROOT
          ===================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* =====================================================
          PUBLIC ROUTES
          ===================================================== */}

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      {/* =====================================================
          PROTECTED ROUTES
          ===================================================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* 
        /documents is the document section entry point.
        For now, Dashboard is our document management page.
      */}
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Navigate
              to="/dashboard"
              replace
            />
          </ProtectedRoute>
        }
      />

      {/* Create Document */}
      <Route
        path="/documents/create"
        element={
          <ProtectedRoute>
            <CreateDocument />
          </ProtectedRoute>
        }
      />

      {/* Open/Edit Document */}
      <Route
        path="/documents/:id"
        element={
          <ProtectedRoute>
            <DocumentEditor />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          404
          ===================================================== */}

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
};

export default AppRoutes;