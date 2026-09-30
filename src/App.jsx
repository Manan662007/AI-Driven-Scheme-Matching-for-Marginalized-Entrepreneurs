import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SchemeMatchPage from './pages/SchemeMatchPage';
import ExploreSchemesPage from './pages/ExploreSchemesPage';
import ResultPage from './pages/ResultPage';
import WhatsAppPage from './pages/WhatsAppPage';
import BankLocatorPage from './pages/BankLocatorPage';

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('sahayak_logged_in') === 'true';
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<HomePage />} />
              <Route path="schemes" element={<SchemeMatchPage />} />
              <Route path="explore" element={<ExploreSchemesPage />} />
              <Route path="result" element={<ResultPage />} />
              <Route path="whatsapp" element={<WhatsAppPage />} />
              <Route path="banks" element={<BankLocatorPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
