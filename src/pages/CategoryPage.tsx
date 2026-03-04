import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Category, Subcategory, Product } from '@/services/mockData';
import { categoryAPI, subcategoryAPI, productAPI } from '@/services/api';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [categorySubcategories, setCategorySubcategories] = useState<Subcategory[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) return;
      try {
        const categoriesData = await categoryAPI.getAll();
        const items = Array.isArray(categoriesData) ? categoriesData : categoriesData.items || [];
        const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
        const catRaw = items.find((c: any) => c.slug === slug);
        if (!catRaw) return;

        const mappedCategory: Category = {
          id: catRaw._id || catRaw.id,
          name: catRaw.name,
          slug: catRaw.slug,
          image: catRaw.image && catRaw.image.startsWith('/uploads') ? `${apiOrigin}${catRaw.image}` : catRaw.image,
          description: (catRaw as any).description || '',
        };
        setCategory(mappedCategory);

        const [subcategoriesData, productsData] = await Promise.all([
          subcategoryAPI.getAll(),
          productAPI.getAll({ category: mappedCategory.id }),
        ]);

        const subItems = Array.isArray(subcategoriesData) ? subcategoriesData : subcategoriesData.items || [];
        setCategorySubcategories(
          subItems
            .filter((s: any) => s.categoryId === mappedCategory.id)
            .map(
              (s: any) =>
                ({
                  id: s._id || s.id,
                  categoryId: s.categoryId,
                  name: s.name,
                  slug: s.slug,
                } as Subcategory)
            )
        );

        const prodItems = Array.isArray(productsData) ? productsData : productsData.items || [];
        setCategoryProducts(
          prodItems.map(
            (p: any) =>
              ({
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
              } as Product)
          )
        );
      } catch (error) {
        console.error('Failed to load category page', error);
      }
    };

    loadData();
  }, [slug]);

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
