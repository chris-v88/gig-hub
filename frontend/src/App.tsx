import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<div>Welcome to GigHub</div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* TODO: Add more routes */}
          {/* 
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/gigs/:id" element={<GigPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/categories/:category" element={<CategoryPage />} />
          */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
