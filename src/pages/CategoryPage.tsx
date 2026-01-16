import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { categories, subcategories, products } from '@/services/mockData';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const category = useMemo(() => {
    return categories.find((c) => c.slug === slug);
  }, [slug]);

  const categorySubcategories = useMemo(() => {
    if (!category) return [];
    return subcategories.filter((s) => s.categoryId === category.id);
  }, [category]);

  const categoryProducts = useMemo(() => {
    if (!category) return [];
    return products.filter((p) => p.categoryId === category.id);
  }, [category]);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">Category Not Found</h1>
        <Link to="/categories" className="text-primary hover:underline">
          Browse all categories
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mb-4">
              <Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/categories" className="hover:text-primary-foreground transition-colors">Categories</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-primary-foreground">{category.name}</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-2">
              {category.name}
            </h1>
            <p className="text-primary-foreground/80 max-w-xl">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Subcategories */}
        {categorySubcategories.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Subcategories
            </h2>
            <div className="flex flex-wrap gap-3">
              {categorySubcategories.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/products?category=${category.id}&subcategory=${sub.id}`}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-full text-sm font-medium text-foreground transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            Products ({categoryProducts.length})
          </h2>
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No products in this category yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
