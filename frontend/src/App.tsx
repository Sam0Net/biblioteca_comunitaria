import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';

import { Home } from './pages/Home.js';
import { Catalog } from './pages/Catalog.js';
import { Services } from './pages/Services.js';
import { Contact } from './pages/Contact.js';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';
import { AdminDashboard } from './pages/AdminDashboard.js';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/registro';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const hideHeaderFooter = isAuthRoute || isAdminRoute;

  return (
    <>
      {!hideHeaderFooter && <Navbar />}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/libros" element={<Catalog />} />
          <Route path="/servicios" element={<Services />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
