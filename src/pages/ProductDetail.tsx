import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Heart, ShoppingCart, Star, Minus, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { Product, Category, Subcategory } from '@/services/mockData';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';
import { productAPI, categoryAPI, subcategoryAPI } from '@/services/api';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, isLoading } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const backendProduct = await productAPI.getById(id);
        const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
        const mappedProduct: Product = {
          id: backendProduct._id || backendProduct.id,
          name: backendProduct.title || backendProduct.name,
          categoryId: backendProduct.categoryId,
          subcategoryId: backendProduct.subcategoryId,
          originalPrice: backendProduct.price,
          discountedPrice: backendProduct.price,
          showOnHomePage: backendProduct.showOnHomePage || false,
          images: (backendProduct.images || ['https://via.placeholder.com/300']).map((img: string) =>
            img.startsWith('/uploads') ? `${apiOrigin}${img}` : img
          ),
          description: backendProduct.description,
          inStock: (backendProduct.stock || 0) > 0,
          rating: backendProduct.rating || 0,
          reviews: backendProduct.reviews || 0,
        };
        setProduct(mappedProduct);
        setSelectedImageIndex(0);

        if (mappedProduct.categoryId) {
          const categoriesData = await categoryAPI.getAll();
          const items = Array.isArray(categoriesData) ? categoriesData : categoriesData.items || [];
          const cat = items.find((c: any) => (c._id || c.id) === mappedProduct.categoryId);
          if (cat) {
            setCategory({
              id: cat._id || cat.id,
              name: cat.name,
              slug: cat.slug,
              image: cat.image && cat.image.startsWith('/uploads') ? `${apiOrigin}${cat.image}` : cat.image,
              description: (cat as any).description || '',
            });
          }
        }

        if (mappedProduct.subcategoryId) {
          const subcategoriesData = await subcategoryAPI.getAll();
          const subItems = Array.isArray(subcategoriesData) ? subcategoriesData : subcategoriesData.items || [];
          const sub = subItems.find((s: any) => (s._id || s.id) === mappedProduct.subcategoryId);
          if (sub) {
            setSubcategory({
              id: sub._id || sub.id,
              categoryId: sub.categoryId,
              name: sub.name,
              slug: sub.slug,
            });
          }
        }

        // Load related products in same category
        if (mappedProduct.categoryId) {
          const productsData = await productAPI.getAll({ category: mappedProduct.categoryId });
          const prodItems = Array.isArray(productsData) ? productsData : productsData.items || [];
          const mappedRelated: Product[] = prodItems
            .filter((p: any) => (p._id || p.id) !== mappedProduct.id)
            .slice(0, 4)
            .map((p: any) => ({
              id: p._id || p.id,
              name: p.title || p.name,
              categoryId: p.categoryId,
              subcategoryId: p.subcategoryId,
              originalPrice: p.price,
              discountedPrice: p.price,
              showOnHomePage: p.showOnHomePage || false,
              images: (p.images || ['https://via.placeholder.com/300']).map((img: string) =>
                img.startsWith('/uploads') ? `${apiOrigin}${img}` : img
              ),
              description: p.description,
              inStock: (p.stock || 0) > 0,
              rating: p.rating || 0,
              reviews: p.reviews || 0,
            }));
          setRelatedProducts(mappedRelated);
        }
      } catch (error) {
        console.error('Failed to load product detail', error);
      }
    };

    loadData();
  }, [id]);

  const inWishlist = product ? isInWishlist(product.id) : false;

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">Product Not Found</h1>
        <Link to="/products" className="text-primary hover:underline">
          Browse all products
        </Link>
      </div>
    );
  }

  const discount = Math.round(
    ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100
  );

  const handleAddToCart = async () => {
    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product!);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleWishlistClick = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-8 flex-wrap">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/categories" className="hover:text-foreground transition-colors">Categories</Link>
          <ChevronRight className="h-4 w-4" />
          {category && (
            <>
              <Link to={`/category/${category.slug}`} className="hover:text-foreground transition-colors">
                {category.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={product.images[Math.min(selectedImageIndex, Math.max(0, product.images.length - 1))]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={cn(
                      "shrink-0 w-16 h-16 rounded-lg overflow-hidden border bg-muted focus:outline-none focus:ring-2 focus:ring-ring",
                      idx === selectedImageIndex ? "border-primary" : "border-border"
                    )}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Category Badge */}
            {subcategory && (
              <span className="inline-block px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                {subcategory.name}
              </span>
            )}

            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                ₨ {product.discountedPrice.toLocaleString()}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ₨ {product.originalPrice.toLocaleString()}
                  </span>
                  <span className="px-2 py-1 bg-accent text-accent-foreground text-sm font-semibold rounded">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-accent" />
              <span className="text-accent font-medium">In Stock</span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleAddToCart} 
                size="xl" 
                className="flex-1"
                disabled={isLoading}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isLoading ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                onClick={handleWishlistClick}
                variant="outline"
                size="xl"
                className={cn(inWishlist && "border-destructive text-destructive")}
              >
                <Heart className={cn("h-5 w-5 mr-2", inWishlist && "fill-current")} />
                {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>

            {/* Features */}
            <div className="border-t border-border pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="w-24 text-muted-foreground">Category:</span>
                <span className="font-medium">{category?.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-24 text-muted-foreground">Type:</span>
                <span className="font-medium">{subcategory?.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
