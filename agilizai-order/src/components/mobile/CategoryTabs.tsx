import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Scroll active category into view
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const activeEl = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      
      const scrollLeft = activeRect.left - containerRect.left - (containerRect.width / 2) + (activeRect.width / 2);
      container.scrollBy({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeCategory]);

  return (
    <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-lg border-b border-border">
      <div
        ref={scrollRef}
        className="flex items-center gap-2 px-4 py-3 overflow-x-auto hide-scrollbar"
      >
        {categories.map((category) => {
          const isActive = category.id === activeCategory;
          
          return (
            <button
              key={category.id}
              ref={isActive ? activeRef : null}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all touch-feedback",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground bg-secondary"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="category-bg"
                  className="absolute inset-0 bg-primary rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10 text-sm font-medium">{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
