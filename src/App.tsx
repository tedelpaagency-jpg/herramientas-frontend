import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import SuperAdminRoute from './components/SuperAdminRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EstatesPage from './pages/EstatesPage';
import EstateFormPage from './pages/EstateFormPage';
import CrmKanbanPage from './pages/CrmKanbanPage';
import ClientsPage from './pages/ClientsPage';
import ProductsPage from './pages/ProductsPage';
import PosPage from './pages/PosPage';
import VisasPage from './pages/VisasPage';
import W8FormsPage from './pages/W8FormsPage';
import LexvaultPage from './pages/LexvaultPage';
import SpinWheelPage from './pages/SpinWheelPage';
import TravelReportsPage from './pages/TravelReportsPage';
import AdminPlansPage from './pages/admin/AdminPlansPage';
import AdminPermissionsPage from './pages/admin/AdminPermissionsPage';
import AdminAgenciesPage from './pages/admin/AdminAgenciesPage';
import AdminSubscriptionsPage from './pages/admin/AdminSubscriptionsPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/estates" element={<EstatesPage />} />
          <Route path="/estates/new" element={<EstateFormPage />} />
          <Route path="/estates/:id/edit" element={<EstateFormPage />} />
          <Route path="/crm" element={<CrmKanbanPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/pos" element={<PosPage />} />
          <Route path="/visas" element={<VisasPage />} />
          <Route path="/w8-forms" element={<W8FormsPage />} />
          <Route path="/lexvault" element={<LexvaultPage />} />
          <Route path="/spin-wheel" element={<SpinWheelPage />} />
          <Route path="/travel-reports" element={<TravelReportsPage />} />

          {/* Super Admin Protected Routes */}
          <Route element={<SuperAdminRoute />}>
            <Route path="/admin/plans" element={<AdminPlansPage />} />
            <Route path="/admin/permissions" element={<AdminPermissionsPage />} />
            <Route path="/admin/agencies" element={<AdminAgenciesPage />} />
            <Route path="/admin/subscriptions" element={<AdminSubscriptionsPage />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
