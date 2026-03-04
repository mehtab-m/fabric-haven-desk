import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, HeadphonesIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { Product, Category } from '@/services/mockData';
import { productAPI, categoryAPI } from '@/services/api';
import heroImage from "../../public/logo/background.jpg"
const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load featured products
        const productsData = await productAPI.getAll();
        const items = Array.isArray(productsData) ? productsData : productsData.items || [];
        const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
        setProducts(
          items.map((p: any) => ({
            id: p.id || p._id,
            name: p.title || p.name,
            categoryId: p.categoryId,
            subcategoryId: p.subcategoryId,
            originalPrice: p.price || p.originalPrice,
            discountedPrice: p.price || p.discountedPrice || p.price,
            showOnHomePage: p.showOnHomePage || false,
            images: (p.images || ['https://via.placeholder.com/300']).map((img: string) =>
              img.startsWith('/uploads') ? `${apiOrigin}${img}` : img
            ),
            description: p.description,
            inStock: (p.stock || 0) > 0,
            rating: p.rating || 0,
            reviews: p.reviews || 0,
          }))
        );

        // Load categories
        const categoriesData = await categoryAPI.getAll();
        const catItems = Array.isArray(categoriesData) ? categoriesData : categoriesData.items || [];
        setCategories(
          catItems.map((c: any) => ({
            id: c._id || c.id,
            name: c.name,
            slug: c.slug,
            image: c.image && c.image.startsWith('/uploads') ? `${apiOrigin}${c.image}` : c.image,
            description: (c as any).description || '',
          }))
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const featuredProducts = products.filter((p) => p.showOnHomePage);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`
          }}
        />
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 animate-slide-up">
              Elevate Your Home with Premium Fabrics
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Discover our exquisite collection of bedsheets, curtains, quilts, and more. 
              Crafted for comfort, designed for elegance.
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button asChild variant="accent" size="xl">
                <Link to="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild className="bg-gray-300" variant="outline" size="xl">
                <Link to="/categories">
                  Browse Categories
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <Truck className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Free Shipping</h3>
                <p className="text-xs text-muted-foreground">On orders over ₨ 5000</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Secure Payment</h3>
                <p className="text-xs text-muted-foreground">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <HeadphonesIcon className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Support</h3>
                <p className="text-xs text-muted-foreground">Dedicated support</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <RefreshCw className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Easy Returns</h3>
                <p className="text-xs text-muted-foreground">3-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collections of premium home fabrics
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Handpicked selections for your home
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Transform Your Living Space
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who have elevated their homes with our premium fabrics. 
            Quality guaranteed.
          </p>
          <Button asChild variant="secondary" size="xl">
            <Link to="/products">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
