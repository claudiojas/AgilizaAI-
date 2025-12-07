import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { CategoryTabs } from '@/components/mobile/CategoryTabs';
import { ProductCard } from '@/components/mobile/ProductCard';
import { ProductDrawer } from '@/components/mobile/ProductDrawer';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { ProductCardSkeleton } from '@/components/mobile/Skeleton';
import type { Product } from '@/types';

export default function MenuPage() {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Set first category as active when categories load
  useMemo(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  // Filter products that are active and not sold out
  const availableProducts = useMemo(() => {
    return products.filter(p => p.isActive && !p.isSoldOut);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = availableProducts;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = availableProducts.filter(
        p => p.name.toLowerCase().includes(query) || 
             (p.description && p.description.toLowerCase().includes(query))
      );
    } else if (activeCategory) {
      result = availableProducts.filter(p => p.categoryId === activeCategory);
    }
    
    return result;
  }, [activeCategory, searchQuery, availableProducts]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Search bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar no cardápio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearching(true)}
            onBlur={() => !searchQuery && setIsSearching(false)}
            className="w-full bg-secondary border-none rounded-2xl pl-12 pr-12 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearching(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted flex items-center justify-center"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Category tabs - hide when searching */}
      {!isSearching && !searchQuery && !categoriesLoading && categories.length > 0 && (
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory || categories[0].id}
          onCategoryChange={setActiveCategory}
        />
      )}

      {/* Search results indicator */}
      {searchQuery && (
        <div className="px-4 py-3">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} para "{searchQuery}"
          </p>
        </div>
      )}

      {/* Products grid */}
      <div className="px-4 py-4 space-y-4">
        {productsLoading ? (
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={handleSelectProduct}
              index={index}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Nenhum item encontrado
            </h3>
            <p className="text-muted-foreground text-sm">
              Tente buscar por outro termo
            </p>
          </motion.div>
        )}
      </div>

      {/* Product detail drawer */}
      <ProductDrawer
        product={selectedProduct}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </motion.div>
  );
}
