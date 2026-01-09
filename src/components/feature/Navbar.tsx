
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();

  // Mock user state - replace with your authentication later
  const [user, setUser] = useState({
    isLoggedIn: true, // Set to false to see login button
    name: 'John Doe',
    email: 'john@example.com',
    type: 'user' // 'user', 'admin', or 'seller'
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update cart count
  useEffect(() => {
    const updateCartCount = () => {
      const cart = localStorage.getItem('cart');
      if (cart) {
        const cartItems = JSON.parse(cart);
        const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Track Order', path: '/order-tracking' },
    { name: 'Become Seller', path: '/seller-profile' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    setUser({ isLoggedIn: false, name: '', email: '', type: 'user' });
    setIsProfileMenuOpen(false);
    // Add your logout logic here
  };

  const getDashboardLink = () => {
    switch (user.type) {
      case 'admin':
        return '/admin-dashboard';
      case 'seller':
        return '/seller-dashboard';
      default:
        return '/profile';
    }
  };

  const getDashboardText = () => {
    switch (user.type) {
      case 'admin':
        return 'Admin Dashboard';
      case 'seller':
        return 'Seller Dashboard';
      default:
        return 'My Profile';
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
              <img 
                src="https://static.readdy.ai/image/3a79f3d26d575281f009959c52307d03/f5e502cd8fa34d230e539c2257e9ddf3.png" 
                alt="Naadan Hub Logo" 
                className="h-8 lg:h-12 w-auto"
              />
              <span className={`text-lg lg:text-2xl font-bold font-serif ${isScrolled ? 'text-primary' : 'text-white'}`}>
                Naadan Hub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors whitespace-nowrap ${
                    location.pathname === link.path
                      ? isScrolled ? 'text-primary' : 'text-white'
                      : isScrolled
                      ? 'text-gray-700 hover:text-primary'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Cart */}
              <Link to="/cart" className="relative cursor-pointer">
                <button className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'
                }`}>
                  <i className={`ri-shopping-cart-line text-xl ${
                    isScrolled ? 'text-gray-900' : 'text-white'
                  }`}></i>
                </button>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex w-10 h-10 items-center justify-center cursor-pointer"
              >
                <i className={`ri-whatsapp-line text-xl ${isScrolled ? 'text-primary' : 'text-white'}`}></i>
              </a>

              {/* Profile Menu */}
              {user.isLoggedIn ? (
                <div className="relative profile-menu">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className={`flex items-center space-x-2 p-2 rounded-full transition-colors cursor-pointer ${
                      isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full bg-primary flex items-center justify-center ${
                      isScrolled ? 'text-white' : 'text-white'
                    }`}>
                      <span className="text-sm font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <i className={`ri-arrow-down-s-line text-lg hidden lg:block ${
                      isScrolled ? 'text-gray-700' : 'text-white'
                    }`}></i>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border py-2 z-50"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.type !== 'user' && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                            user.type === 'admin' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.type === 'admin' ? 'Admin' : 'Seller'}
                          </span>
                        )}
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          to={getDashboardLink()}
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          <i className={`${user.type === 'admin' ? 'ri-dashboard-line' : user.type === 'seller' ? 'ri-store-line' : 'ri-user-line'} mr-3 text-lg`}></i>
                          {getDashboardText()}
                        </Link>
                        
                        {user.type === 'user' && (
                          <>
                            <Link
                              to="/order-tracking"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                              <i className="ri-truck-line mr-3 text-lg"></i>
                              Track Orders
                            </Link>
                          </>
                        )}

                        <hr className="my-1" />
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <i className="ri-logout-box-line mr-3 text-lg"></i>
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`hidden sm:flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    isScrolled 
                      ? 'bg-primary text-white hover:bg-primary/90' 
                      : 'bg-white text-primary hover:bg-white/90'
                  }`}
                >
                  <i className="ri-user-line text-lg"></i>
                  <span>Login</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden w-10 h-10 flex items-center justify-center cursor-pointer ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                <i className={`${isMobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-16 left-0 right-0 bg-white shadow-lg z-40 lg:hidden"
        >
          <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Mobile Profile Section */}
            {user.isLoggedIn ? (
              <div className="pb-3 mb-3 border-b">
                <div className="flex items-center space-x-3 px-4 py-2">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="font-bold">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 py-3 px-4 text-primary hover:bg-primary/10 rounded-lg font-medium cursor-pointer"
                >
                  <i className={`${user.type === 'admin' ? 'ri-dashboard-line' : user.type === 'seller' ? 'ri-store-line' : 'ri-user-line'} text-xl`}></i>
                  <span>{getDashboardText()}</span>
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 py-3 px-4 text-primary hover:bg-primary/10 rounded-lg font-medium cursor-pointer border-b mb-3"
              >
                <i className="ri-user-line text-xl"></i>
                <span>Login / Register</span>
              </Link>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 px-4 rounded-lg font-medium transition-colors cursor-pointer ${
                  location.pathname === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile WhatsApp Link */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <i className="ri-whatsapp-line text-xl text-primary"></i>
              <span className="font-medium">Contact on WhatsApp</span>
            </a>

            {/* Mobile Logout */}
            {user.isLoggedIn && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg font-medium cursor-pointer border-t mt-3"
              >
                <i className="ri-logout-box-line text-xl"></i>
                <span>Logout</span>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}
