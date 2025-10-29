import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useLogout } from '../hooks/useAuth';
import Icon from './ui/Icon';
import Button from './ui/Button';
import Input from './ui/Input';

const categories = [
  'Graphic Design',
  'Web Development',
  'Content Writing',
  'Digital Marketing',
  'Video Editing',
  'Mobile App Development',
  'Translation Services',
  'Voice Over',
  'UI/UX Design',
  'Photography',
];

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold text-green-600">GigHub</div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Find services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-green-600"
                >
                  <Icon name="Search" size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* Authenticated User Navigation */}
                <Link
                  to="/inbox"
                  className="hidden sm:flex items-center text-gray-700 hover:text-green-600 transition-colors"
                >
                  <Icon name="MessageSquare" size={20} />
                  <span className="ml-2">Inbox</span>
                </Link>

                <Link
                  to="/favorites"
                  className="hidden sm:flex items-center text-gray-700 hover:text-green-600 transition-colors"
                >
                  <Icon name="Heart" size={20} />
                  <span className="ml-2">Favorites</span>
                </Link>

                <Link
                  to="/my-orders"
                  className="hidden sm:flex items-center text-gray-700 hover:text-green-600 transition-colors"
                >
                  <Icon name="ShoppingBag" size={20} />
                  <span className="ml-2">My Orders</span>
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600"
                  >
                    {user?.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border border-gray-300"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Icon name="User" size={16} className="text-green-600" />
                      </div>
                    )}
                    <span className="hidden md:block font-medium">{user?.name}</span>
                    <Icon name="ChevronDown" size={16} />
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon name="User" size={16} className="inline mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon name="LayoutDashboard" size={16} className="inline mr-2" />
                        Dashboard
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon name="Settings" size={16} className="inline mr-2" />
                        Settings
                      </Link>

                      {/* Admin Menu - Only show if user is admin */}
                      {user?.role === 'admin' && (
                        <>
                          <hr className="my-1" />
                          <div className="px-4 py-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase">Admin</p>
                          </div>
                          <Link
                            to="/admin/categories"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Icon name="Tags" size={16} className="inline mr-2" />
                            Categories
                          </Link>
                          <Link
                            to="/admin/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Icon name="Package" size={16} className="inline mr-2" />
                            All Orders
                          </Link>
                        </>
                      )}

                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Icon name="LogOut" size={16} className="inline mr-2" />
                        {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Guest Navigation */}
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button tone="primary" size="sm">
                    Join
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-green-600"
            >
              <Icon name="Menu" size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="text"
                placeholder="Find services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-green-600"
              >
                <Icon name="Search" size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-3 space-x-6 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="whitespace-nowrap text-sm text-gray-700 hover:text-green-600 font-medium transition-colors flex-shrink-0"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {isMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />}
    </nav>
  );
};

export default Navbar;
