import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import MainShopPage from './pages/MainShopPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/main" element={<MainShopPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Защищенные маршруты */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* 404 - можно добавить отдельную страницу */}
          <Route path="*" element={<MainShopPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;