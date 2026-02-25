import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/services/mockData';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative block overflow-hidden rounded-xl aspect-[4/3] shadow-elegant hover:shadow-elevated transition-all duration-300"
    >
      {/* Background Image */}
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />

      {/* Overlay */}
      <div className="absolute inset-0 " />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <h3 className="font-display text-2xl font-semibold text-primary-foreground mb-1">
          {category.name}
        </h3>
        <p className="text-primary-foreground/80 text-sm mb-3 line-clamp-2">
          {category.description}
        </p>
        <div className="flex items-center gap-2 text-primary-foreground font-medium text-sm group-hover:gap-3 transition-all duration-300">
          <span>Explore Collection</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
