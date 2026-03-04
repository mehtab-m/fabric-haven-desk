import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '@/services/mockData';
import { useAuth } from './AuthContext';
import { cartAPI, productAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface CartItem {
  id?: string; // Backend cart item ID
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, setShowAuthModal, setAuthModalMode, user } = useAuth();

  // Load cart from backend when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated, user]);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const response = await cartAPI.getCart();
      if (response.items && Array.isArray(response.items)) {
        // Map backend cart items to frontend format
        const mappedItems = await Promise.all(
          response.items.map(async (item: any) => {
            try {
              const product = await productAPI.getById(item.productId);
              return {
                id: item.itemId || item.id || item._id,
                product: {
                  id: product._id || product.id,
                  name: product.title || product.name,
                  categoryId: product.categoryId,
                  subcategoryId: product.subcategoryId,
                  originalPrice: product.price,
                  discountedPrice: product.price,
                  showOnHomePage: false,
                  images: product.images || ['https://via.placeholder.com/300'],
                  description: product.description,
                  inStock: product.stock > 0,
                  rating: 0,
                  reviews: 0,
                } as Product,
                quantity: item.quantity,
              };
            } catch (error) {
              console.error('Failed to load product:', error);
              return null;
            }
          })
        );
        setItems(mappedItems.filter(Boolean) as CartItem[]);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      // Fallback to empty cart
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product) => {
    if (!isAuthenticated) {
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }

    try {
      setIsLoading(true);
      await cartAPI.addItem({
        productId: product.id,
        quantity: 1,
      });

      await loadCart();
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setIsLoading(true);
      const item = items.find((item) => item.product.id === productId);
      if (item?.id) {
        await cartAPI.deleteItem(item.id);
      }
      await loadCart();
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      setIsLoading(true);
      const item = items.find((item) => item.product.id === productId);
      if (item?.id) {
        await cartAPI.updateItem(item.id, { quantity });
      }
      await loadCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      // Delete all items
      await Promise.all(
        items.map((item) => item.id ? cartAPI.deleteItem(item.id) : Promise.resolve())
      );
      setItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.discountedPrice * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
