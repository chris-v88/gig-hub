import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SearchPage from './pages/SearchPage';
import GigPage from './pages/GigPage';
import CategoryListPage from './pages/CategoryListPage';
import OrderListPage from './pages/OrderListPage';
import MyOrdersPage from './pages/MyOrdersPage';
import SkillsListPage from './pages/SkillsListPage';
import ProfilePage from './pages/ProfilePage';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/gig/:id" element={<GigPage />} />

            {/* Admin/Management Routes */}
            <Route path="/admin/categories" element={<CategoryListPage />} />
            <Route path="/admin/orders" element={<OrderListPage />} />
            <Route path="/admin/skills" element={<SkillsListPage />} />

            {/* User Routes */}
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />

            {/* TODO: Add more routes */}
            {/* 
            <Route path="/categories/:category" element={<CategoryPage />} />
            <Route path="/admin/users" element={<UserListPage />} />
            <Route path="/admin/subcategories" element={<SubcategoryListPage />} />
            */}
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
