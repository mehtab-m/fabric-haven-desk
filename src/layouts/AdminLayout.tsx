import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from "../../public/logo/ZM.jpg"
import {
  LayoutDashboard,
  FolderTree,
  Layers,
  Package,
  Users,
  ShoppingBag,
  BarChart3,
  LogOut,
  Menu,
  X,
  Home,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: FolderTree, label: 'Categories', path: '/admin/categories' },
  { icon: Layers, label: 'Subcategories', path: '/admin/subcategories' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: Users, label: 'Customers', path: '/admin/customers' },
  { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
];

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* ZM LOGO */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {sidebarOpen && (
            <div className="">
          
                {<img src={logo} alt="ZM Logo" className="" />}
             
             
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <ChevronRight className={cn("h-4 w-4 transition-transform", sidebarOpen && "rotate-180")} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <Home className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Back to Store</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 md:hidden",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* ZM LOGO */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="font-display text-sm font-bold text-sidebar-primary-foreground">ZM</span>
            </div>
            <span className="font-display font-bold text-sm">ZM Admin</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-2 hover:bg-sidebar-accent rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Link
            to="/"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <Home className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">Back to Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 hover:bg-muted rounded-lg md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display text-lg font-semibold text-foreground">
              {adminNavItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Welcome, {user?.name}
            </span>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
