import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// UI Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Recommend from './pages/Recommend';
import MyFarm from './pages/MyFarm';
import History from './pages/History';
import FarmIntelligence from './pages/FarmIntelligence';
import Login from './pages/Login';
import Register from './pages/Register';
import LanguageSelect from './pages/LanguageSelect';
import { AnimatePresence } from 'framer-motion';
import ScrollProgress from './components/effects/ScrollProgress';
import BackToTop from './components/effects/BackToTop';
import { AuthProvider } from './context/AuthContext';
import { RecommendationProvider } from './context/RecommendationContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AgroChatbot from './components/AgroChatbot';
import ErrorBoundary from './components/ErrorBoundary';


const AppContent = () => {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-brand-bg">
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

          <Route path="/my-farm" element={
            <ProtectedRoute>
              <MyFarm />
            </ProtectedRoute>
          } />

          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />

          <Route path="/intelligence" element={
            <ProtectedRoute>
              <FarmIntelligence />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <AgroChatbot />
      <Footer />
    </div>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <RecommendationProvider>
              <AppContent />
            </RecommendationProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}


export default App;
