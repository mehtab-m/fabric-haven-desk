import React from 'react';
import CategoryCard from '@/components/CategoryCard';
import { categories } from '@/services/mockData';

const Categories: React.FC = () => {
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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Categories;
