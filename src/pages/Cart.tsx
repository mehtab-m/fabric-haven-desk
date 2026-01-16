import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const { isAuthenticated, setShowAuthModal, setAuthModalMode } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Add some products to your cart to continue shopping</p>
        <Button asChild>
          <Link to="/products">
            Browse Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">
        Shopping Cart ({totalItems} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 p-4 bg-card rounded-xl shadow-elegant"
            >
              {/* Image */}
              <Link to={`/product/${product.id}`} className="shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
                />
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-display text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-muted-foreground text-sm mt-1">
                  ₨ {product.discountedPrice.toLocaleString()} each
                </p>

                {/* Quantity & Actions */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-right hidden sm:block">
                <span className="font-bold text-primary text-lg">
                  ₨ {(product.discountedPrice * quantity).toLocaleString()}
                </span>
              </div>
            </div>
          ))}

          <Button variant="ghost" onClick={clearCart} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl shadow-elegant p-6 sticky top-24">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                <span className="font-medium">₨ {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-accent font-medium">Free</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary text-xl">
                    ₨ {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Button onClick={handleCheckout} className="w-full" size="lg">
              Proceed to Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Secure checkout. Your data is protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
