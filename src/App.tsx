import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as  Router, Routes, Route} from 'react-router-dom'

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import MainShopPage from './pages/MainShopPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<MainShopPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          {/* Add other protected routes similarly */}
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App;
