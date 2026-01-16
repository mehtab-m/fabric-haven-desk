import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate order placement
    setTimeout(() => {
      setLoading(false);
      setOrderPlaced(true);
      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: "Thank you for your order. We'll contact you soon.",
      });
    }, 1500);
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto bg-accent rounded-full flex items-center justify-center mb-6">
          <Check className="h-10 w-10 text-accent-foreground" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Thank you for shopping with ZM HOME FABRICS. We'll send you a confirmation email shortly.
        </p>
        <Button asChild>
          <Link to="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Button asChild>
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div className="bg-card rounded-xl shadow-elegant p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" required />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-card rounded-xl shadow-elegant p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required />
                  </div>
                  <div>
                    <Label htmlFor="state">Province</Label>
                    <Input id="state" required />
                  </div>
                  <div>
                    <Label htmlFor="zip">Postal Code</Label>
                    <Input id="zip" required />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-card rounded-xl shadow-elegant p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">
                Payment Method
              </h2>
              <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-muted/50">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
                <span className="font-medium">Cash on Delivery (COD)</span>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Pay when your order arrives at your doorstep.
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : `Place Order - ₨ ${totalPrice.toLocaleString()}`}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl shadow-elegant p-6 sticky top-24">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                    <p className="text-muted-foreground text-sm">Qty: {quantity}</p>
                  </div>
                  <span className="font-medium text-sm">
                    ₨ {(product.discountedPrice * quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₨ {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-accent font-medium">Free</span>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary text-xl">
                    ₨ {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
