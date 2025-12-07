import { DashboardLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useProductsQuery, useCategoriesQuery } from '@/hooks/useProducts';
import { Product, Category } from '@/types';
import { useMemo, useState } from 'react';
import { CreateProductForm } from '@/components/forms/CreateProductForm';
import { CreateCategoryForm } from '@/components/forms/CreateCategoryForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products';
import { toast } from '@/hooks/use-toast';

const MenuPage = () => {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading: productsLoading } = useProductsQuery();
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery();

  const [isCreateProductModalOpen, setCreateProductModalOpen] = useState(false);
  const [isCreateCategoryModalOpen, setCreateCategoryModalOpen] = useState(false);

  const createProductMutation = useMutation({
    mutationFn: productsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Sucesso', description: 'Produto criado com sucesso!' });
      setCreateProductModalOpen(false);
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Não foi possível criar o produto.', variant: 'destructive' });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: productsService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'Sucesso', description: 'Categoria criada com sucesso!' });
      setCreateCategoryModalOpen(false);
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Não foi possível criar a categoria.', variant: 'destructive' });
    }
  })

  const productsByCategory = useMemo(() => {
    const grouped: { [key: string]: Product[] } = {};
    products.forEach((product: Product) => {
      const categoryId = product.categoryId;
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(product);
    });
    return grouped;
  }, [products]);

  const handleCreateProduct = (values: any) => {
    createProductMutation.mutate(values);
  };

  const handleCreateCategory = (values: { name: string }) => {
    createCategoryMutation.mutate({ ...values, isActive: true });
  }

  const isLoading = productsLoading || categoriesLoading;

  return (
    <DashboardLayout
      title="Cardápio"
      subtitle="Gerencie seus produtos e categorias"
    >
      <div className="flex justify-end mb-6">
        <Dialog open={isCreateProductModalOpen} onOpenChange={setCreateProductModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
            </DialogHeader>
            <CreateProductForm 
              categories={categories}
              onSubmit={handleCreateProduct}
              onOpenCreateCategory={() => setCreateCategoryModalOpen(true)}
              isLoading={createProductMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isCreateCategoryModalOpen} onOpenChange={setCreateCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Categoria</DialogTitle>
          </DialogHeader>
          <CreateCategoryForm 
            onSubmit={handleCreateCategory}
            isLoading={createCategoryMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <p>Carregando cardápio...</p>
      ) : (
        <div className="space-y-8">
          {categories.map((category: Category) => (
            <div key={category.id}>
              <h2 className="text-2xl font-bold tracking-tight mb-4">{category.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(productsByCategory[category.id] || []).map((product: Product) => (
                  <div key={product.id} className="border rounded-lg p-4 bg-card text-card-foreground shadow-sm">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold text-lg">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.price))}
                      </span>
                      <span className="text-sm text-muted-foreground">Estoque: {product.stock}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MenuPage;