import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// UI Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Recommend from './pages/Recommend';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import LanguageSelect from './pages/LanguageSelect';
import { AnimatePresence } from 'framer-motion';
import ScrollProgress from './components/effects/ScrollProgress';
import BackToTop from './components/effects/BackToTop';
import { AuthProvider } from './context/AuthContext';
import { RecommendationProvider } from './context/RecommendationContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';


const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream">
      <ScrollProgress />
      <BackToTop />
      <Toaster position="top-center" />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Language selection page — protected, shown after login */}
          <Route path="/language" element={
            <ProtectedRoute>
              <LanguageSelect />
            </ProtectedRoute>
          } />

          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          <Route path="/recommend" element={
            <ProtectedRoute>
              <Recommend />
            </ProtectedRoute>
          } />

          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <RecommendationProvider>
            <AppContent />
          </RecommendationProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}


export default App;
