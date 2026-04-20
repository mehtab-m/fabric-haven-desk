import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/services/mockData';
import { normalizeImageUrl } from '@/lib/imageUtils';

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
        src={normalizeImageUrl(category.image)}
        alt={category.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />

      {/* Subtle Blur Overlay: Only bottom 20% */}
      <div
        className="absolute inset-0 backdrop-blur-[4px]"
        style={{
          WebkitMaskImage: 'linear-gradient(to top, black 0%, black 20%, transparent 40%)',
          maskImage: 'linear-gradient(to top, black 0%, black 20%, transparent 40%)'
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        {/* Text remains readable because the background details are softened */}
        <h3 className="font-display text-2xl font-bold text-black mb-1 drop-shadow-sm">
          {category.name}
        </h3>
        <p className="text-black/90 text-sm font-medium mb-3 line-clamp-2">
          {category.description}
        </p>
        <div className="flex items-center gap-2 text-black font-semibold text-sm group-hover:gap-3 transition-all duration-300">
          <span>Explore Collection</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;