import { DashboardLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useProductsQuery, useCategoriesQuery, useUpdateProductMutation, useDeleteProductMutation } from '@/hooks/useProducts';
import { Product, Category } from '@/types';
import { useMemo, useState } from 'react';
import { CreateProductForm } from '@/components/forms/CreateProductForm';
import { CreateCategoryForm } from '@/components/forms/CreateCategoryForm';
import { toast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { EditProductForm } from '@/components/forms/EditProductForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products';

const MenuPage = () => {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading: productsLoading } = useProductsQuery();
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery();

  const [isCreateProductModalOpen, setCreateProductModalOpen] = useState(false);
  const [isCreateCategoryModalOpen, setCreateCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const createProductMutation = useMutation({
    mutationFn: productsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Sucesso', description: 'Produto criado com sucesso!' });
      setCreateProductModalOpen(false);
    },
    onError: (error: any) => {
      toast({ title: 'Erro', description: error.response?.data?.error || 'Não foi possível criar o produto.', variant: 'destructive' });
    },
  });
  
  const updateProductMutation = useUpdateProductMutation();
  const deleteProductMutation = useDeleteProductMutation();

  const createCategoryMutation = useMutation({
    mutationFn: productsService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'Sucesso', description: 'Categoria criada com sucesso!' });
      setCreateCategoryModalOpen(false);
    },
    onError: (error: any) => {
      toast({ title: 'Erro', description: error.response?.data?.error || 'Não foi possível criar a categoria.', variant: 'destructive' });
    }
  });

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

  const handleSubmitEditProduct = (values: any) => {
    if (!editingProduct) return;
    updateProductMutation.mutate({ id: editingProduct.id, data: values }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setEditingProduct(null);
      }
    });
  };

  const handleCreateCategory = (values: { name: string }) => {
    createCategoryMutation.mutate({ ...values, isActive: true });
  }

  const handleDeleteProduct = (productId: string) => {
    setDeletingProductId(productId);
    setIsDeleteAlertOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (!deletingProductId) return;
    deleteProductMutation.mutate(deletingProductId, {
      onSuccess: () => {
        setIsDeleteAlertOpen(false);
        setDeletingProductId(null);
      }
    });
  };

  const isLoading = productsLoading || categoriesLoading;

  return (
    <DashboardLayout
      title="Cardápio"
      subtitle="Gerencie seus produtos e categorias"
    >
      <div className="flex justify-end gap-4 mb-6">
        <Dialog open={isCreateCategoryModalOpen} onOpenChange={setCreateCategoryModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
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

      {isLoading ? (
        <p>Carregando cardápio...</p>
      ) : (
        <div className="space-y-8">
          {categories.map((category: Category) => (
            <div key={category.id}>
              <h2 className="text-2xl font-bold tracking-tight mb-4">{category.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(productsByCategory[category.id] || []).map((product: Product) => (
                  <Card key={product.id} className="bg-card text-card-foreground shadow-sm relative">
                    {/* Dropdown Menu for actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog open={isEditModalOpen && editingProduct?.id === product.id} onOpenChange={(isOpen) => { if (!isOpen) setEditingProduct(null); setIsEditModalOpen(isOpen); }}>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setEditingProduct(product); setIsEditModalOpen(true); }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Produto</DialogTitle>
                            </DialogHeader>
                            {editingProduct && (
                              <EditProductForm
                                product={editingProduct}
                                categories={categories}
                                onSubmit={handleSubmitEditProduct}
                                isLoading={updateProductMutation.isPending}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem onSelect={() => handleDeleteProduct(product.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Product Image */}
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover rounded-t-lg" />
                    ) : (
                        <div className="w-full h-32 bg-secondary rounded-t-lg flex items-center justify-center text-5xl">
                            🍽️
                        </div>
                    )}

                    <div className="p-4">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 h-10">{product.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="font-bold text-lg">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.price))}
                        </span>
                        <span className="text-sm text-muted-foreground">Estoque: {product.stock}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir este produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O produto será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProduct} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default MenuPage;