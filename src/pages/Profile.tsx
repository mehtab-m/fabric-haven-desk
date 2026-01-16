import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { orders } from '@/services/mockData';

const Profile: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Mock user orders
  const userOrders = orders.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl shadow-elegant p-6">
            {/* User Info */}
            <div className="text-center mb-6 pb-6 border-b border-border">
              <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl font-display font-bold text-primary-foreground">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <h2 className="font-display text-lg font-bold">{user?.name}</h2>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <a href="#profile" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted text-foreground">
                <User className="h-5 w-5" />
                Profile
              </a>
              <a href="#orders" className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <ShoppingBag className="h-5 w-5" />
                Orders
              </a>
              <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Heart className="h-5 w-5" />
                Wishlist ({wishlistItems.length})
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors w-full"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Profile Section */}
          <section id="profile" className="bg-card rounded-xl shadow-elegant p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Full Name</label>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Account Type</label>
                <p className="font-medium capitalize">{user?.role}</p>
              </div>
            </div>
          </section>

          {/* Orders Section */}
          <section id="orders" className="bg-card rounded-xl shadow-elegant p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">Recent Orders</h2>
            {userOrders.length > 0 ? (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg gap-4"
                  >
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.orderDate}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-accent/20 text-accent' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-destructive/20 text-destructive'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="font-bold">₨ {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No orders yet.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
