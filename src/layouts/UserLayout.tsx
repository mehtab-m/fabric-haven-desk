import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import AuthModal from '@/components/AuthModal';
import { useState } from 'react';
import logo from "../../public/logo/ZM.jpg"

const UserLayout: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout, setShowAuthModal, setAuthModalMode } = useAuth();
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleAuthClick = () => {
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" >
              <div className="hidden sm:block ">
                { <img src={logo} alt="ZM Logo" className="h-20 rounded-lg" /> }
                 
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/categories" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Categories
              </Link>
              <Link to="/products" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Products
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                <Heart className="h-5 w-5 text-foreground" />
                {wishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-semibold rounded-full flex items-center justify-center">
                    {wishlistItems}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                <ShoppingCart className="h-5 w-5 text-foreground" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-semibold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/admin')}
                      className="hidden md:flex"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  <Link to="/profile" className="hidden md:flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors">
                    <User className="h-5 w-5 text-foreground" />
                    <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={logout} className="hidden md:flex">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="default" size="sm" onClick={handleAuthClick} className="hidden md:flex">
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background animate-slide-up">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-foreground hover:text-primary transition-colors"
              >
                Categories
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-foreground hover:text-primary transition-colors"
              >
                Products
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-foreground hover:text-primary transition-colors"
                  >
                    My Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-foreground hover:text-primary transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block py-2 text-destructive hover:text-destructive/80 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleAuthClick();
                    setMobileMenuOpen(false);
                  }}
                  className="block py-2 text-primary font-medium"
                >
                  Sign In
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className=" text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                  <span className="font-display text-xl font-bold">ZM</span>
                </div>
                <h2 className="font-display text-lg font-bold">ZM HOME FABRICS</h2>
              </div>
              <p className="text-sm text-primary-foreground/80">
                Premium quality home bedding and fabrics for your comfort and style.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-display text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">Home</Link></li>
                <li><Link to="/categories" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">Categories</Link></li>
                <li><Link to="/products" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">Products</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-display text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><Link to="/category/bedsheets" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">Bedsheets</Link></li>
                <li><Link to="/category/pillows" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">Pillows</Link></li>
                <li><Link to="/category/curtains" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">Curtains</Link></li>
                <li><Link to="/category/quilts" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">Quilts</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-display text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>Email: zmhomefabrics@gmail.com</li>
                <li>Phone: +92 300 1234567</li>
                <li>Address: Karachi, Pakistan</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
            © 2024 ZM HOME FABRICS. All rights reserved.
          </div>
        </div>
      </footer>

      <AuthModal />
    </div>
  );
};

export default UserLayout;
