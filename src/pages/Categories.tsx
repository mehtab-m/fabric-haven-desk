import React, { useEffect, useState } from 'react';
import CategoryCard from '@/components/CategoryCard';
import { categories as mockCategories } from '@/services/mockData';
import { categoryAPI } from '@/services/api';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>(mockCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await categoryAPI.getAll();
        
        // Handle both array and object with items property
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data.items && Array.isArray(data.items)) {
          setCategories(data.items);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
        setError('Failed to load categories. Using mock data.');
        // Fallback to mock data
        setCategories(mockCategories);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
          Shop by Category
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our diverse range of premium home fabrics and bedding solutions
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">{error}</p>
        </div>
      ) : (
        <>
          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No categories found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Categories;
