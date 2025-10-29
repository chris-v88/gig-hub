import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SearchPage from './pages/SearchPage';
import GigPage from './pages/GigPage';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={<div className="container mx-auto px-4 py-8">Welcome to GigHub</div>}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/gig/:id" element={<GigPage />} />
            {/* TODO: Add more routes */}
            {/* 
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/categories/:category" element={<CategoryPage />} />
            */}
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
