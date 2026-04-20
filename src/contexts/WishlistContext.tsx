import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product } from '@/services/mockData';
import { useAuth } from './AuthContext';
import { wishlistAPI } from '@/services/api';
import { normalizeImageUrls } from '@/lib/imageUtils';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  const { isAuthenticated, setShowAuthModal, setAuthModalMode, user } = useAuth();

  // Load wishlist from backend when user logs in
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await wishlistAPI.getAll();
        const list = (data as any).items || [];
        const mapped: Product[] = list.map((p: any) => ({
          id: p._id || p.id,
          name: p.title || p.name,
          categoryId: p.categoryId,
          subcategoryId: p.subcategoryId,
          originalPrice: p.price,
          discountedPrice: p.price,
          showOnHomePage: p.showOnHomePage || false,
          images: normalizeImageUrls(p.images || ['https://via.placeholder.com/300']),
          description: p.description,
          inStock: (p.stock || 0) > 0,
          rating: p.rating || 0,
          reviews: p.reviews || 0,
        }));
        setItems(mapped);
      } catch (error) {
        console.error('Failed to load wishlist', error);
        setItems([]);
      }
    };

    if (isAuthenticated && user) {
      loadWishlist();
    } else {
      setItems([]);
    }
  }, [isAuthenticated, user]);

  const addToWishlist = (product: Product) => {
    if (!isAuthenticated) {
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }

    wishlistAPI
      .add({ productId: product.id })
      .then((data: any) => {
        const list = data.items || [];
        const mapped: Product[] = list.map((p: any) => ({
          id: p._id || p.id,
          name: p.title || p.name,
          categoryId: p.categoryId,
          subcategoryId: p.subcategoryId,
          originalPrice: p.price,
          discountedPrice: p.price,
          showOnHomePage: p.showOnHomePage || false,
          images: normalizeImageUrls(p.images || ['https://via.placeholder.com/300']),
          description: p.description,
          inStock: (p.stock || 0) > 0,
          rating: p.rating || 0,
          reviews: p.reviews || 0,
        }));
        setItems(mapped);
      })
      .catch((error) => {
        console.error('Failed to add to wishlist', error);
      });
  };

  const removeFromWishlist = (productId: string) => {
    wishlistAPI
      .remove(productId)
      .then((data: any) => {
        const list = data.items || [];
        const mapped: Product[] = list.map((p: any) => ({
          id: p._id || p.id,
          name: p.title || p.name,
          categoryId: p.categoryId,
          subcategoryId: p.subcategoryId,
          originalPrice: p.price,
          discountedPrice: p.price,
          showOnHomePage: p.showOnHomePage || false,
          images: normalizeImageUrls(p.images || ['https://via.placeholder.com/300']),
          description: p.description,
          inStock: (p.stock || 0) > 0,
          rating: p.rating || 0,
          reviews: p.reviews || 0,
        }));
        setItems(mapped);
      })
      .catch((error) => {
        console.error('Failed to remove from wishlist', error);
      });
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        totalItems: items.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
