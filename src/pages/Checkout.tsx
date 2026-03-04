import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { orderAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shipping: {
          name: formData.name,
          address: formData.address,
          // Backend requires these fields; use generic defaults since UI only asks for one address field
          city: 'N/A',
          postalCode: '00000',
          country: 'Pakistan',
        },
        paymentMethod: 'COD',
      };

      await orderAPI.create(orderData);
      
      setOrderPlaced(true);
      await clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: "Thank you for your order. We'll contact you soon.",
      });
    } catch (error: any) {
      console.error('Order creation failed:', error);
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
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
          Thank you for shopping with ZM HOME FABRICS. Our team will contact you soon with order details.
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
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    required 
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    required 
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
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
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    required 
                    value={formData.address}
                    onChange={handleInputChange}
                  />
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
