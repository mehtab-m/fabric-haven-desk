import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from '@/components/ProductCard';
import { Product, Category, Subcategory } from '@/services/mockData';
import { productAPI, categoryAPI, subcategoryAPI } from '@/services/api';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendCategories, setBackendCategories] = useState<Category[]>([]);
  const [backendSubcategories, setBackendSubcategories] = useState<Subcategory[]>([]);

  // Load categories and products from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load categories
        const categoriesData = await categoryAPI.getAll();
        const catItems = Array.isArray(categoriesData) ? categoriesData : categoriesData.items || [];
        setBackendCategories(
          catItems.map((c: any) => ({
            id: c._id || c.id,
            name: c.name,
            slug: c.slug,
            image: c.image || '',
            description: (c as any).description || '',
          }))
        );

        // Load subcategories
        const subcategoriesData = await subcategoryAPI.getAll();
        const subItems = Array.isArray(subcategoriesData) ? subcategoriesData : subcategoriesData.items || [];
        setBackendSubcategories(
          subItems.map((s: any) => ({
            id: s._id || s.id,
            categoryId: s.categoryId,
            name: s.name,
            slug: s.slug,
          }))
        );

        // Load products
        const productsData = await productAPI.getAll({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          subcategory: selectedSubcategory !== 'all' ? selectedSubcategory : undefined,
          q: search || undefined,
        });

        // Map backend product format to frontend format
        const prodItems = Array.isArray(productsData) ? productsData : productsData.items || [];
        setProducts(
          prodItems.map((p: any) => ({
            id: p.id || p._id,
            name: p.title || p.name,
            categoryId: p.categoryId,
            subcategoryId: p.subcategoryId,
            originalPrice: p.price || p.originalPrice,
            discountedPrice: p.price || p.discountedPrice || p.price,
            showOnHomePage: p.showOnHomePage || false,
            images: p.images && p.images.length > 0 ? p.images : ['https://via.placeholder.com/300'],
            description: p.description,
            inStock: (p.stock || 0) > 0,
            rating: p.rating || 0,
            reviews: p.reviews || 0,
          }))
        );
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products.');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedCategory, selectedSubcategory, search]);

  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'all') return backendSubcategories;
    return backendSubcategories.filter((sub: any) => sub.categoryId === selectedCategory);
  }, [selectedCategory, backendSubcategories]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter (client-side, in case it wasn't filtered by API)
    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter (client-side)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.categoryId === selectedCategory);
    }

    // Subcategory filter (client-side)
    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter((p) => p.subcategoryId === selectedSubcategory);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.reverse();
        break;
      default:
        // Featured - show homepage products first
        filtered.sort((a, b) => (b.showOnHomePage ? 1 : 0) - (a.showOnHomePage ? 1 : 0));
    }

    return filtered;
  }, [search, selectedCategory, selectedSubcategory, sortBy, products]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters = search || selectedCategory !== 'all' || selectedSubcategory !== 'all';

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          All Products
        </h1>
        <p className="text-muted-foreground">
          {filteredProducts.length} products found
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Toggle (Mobile) */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>

        {/* Filters (Desktop & Mobile) */}
        <div className={`flex flex-col sm:flex-row gap-4 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
          <Select value={selectedCategory} onValueChange={(value) => {
            setSelectedCategory(value);
            setSelectedSubcategory('all');
          }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {backendCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Subcategory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              {availableSubcategories.map((sub) => (
                <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const subcategory = backendSubcategories.find((s) => s.id === product.subcategoryId);
            return (
              <ProductCard 
                key={product.id} 
                product={product}
                subcategoryName={subcategory?.name}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-4">No products found</p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
};

export default Products;
