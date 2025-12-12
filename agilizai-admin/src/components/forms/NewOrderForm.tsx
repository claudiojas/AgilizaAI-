import { useState, useMemo } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProductsQuery } from '@/hooks/useProducts';
import type { Product } from '@/types';
import { Plus, Minus, Trash2 } from 'lucide-react';

const formSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1, "A quantidade deve ser pelo menos 1."),
  })).min(1, "Adicione pelo menos um item ao pedido."),
});

type FormSchemaItem = z.infer<typeof formSchema>['items'][0];
interface CartItem extends FormSchemaItem {
  name: string;
  price: number;
}

interface NewOrderFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
}

export function NewOrderForm({ onSubmit, isLoading }: NewOrderFormProps) {
  const { data: products = [], isLoading: productsLoading } = useProductsQuery();
  const [cart, setCart] = useState<CartItem[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { items: [] },
  });

  const availableProducts = useMemo(() => {
    return products.filter(p => !cart.some(item => item.productId === p.id));
  }, [products, cart]);

  const handleAddProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
      handleUpdateQuantity(productId, existingItem.quantity + 1);
    } else {
      const newCart = [...cart, { productId: product.id, name: product.name, price: Number(product.price), quantity: 1 }];
      setCart(newCart);
      form.setValue('items', newCart.map(({ productId, quantity }) => ({ productId, quantity })));
    }
  };

  const handleRemoveProduct = (productId: string) => {
    const newCart = cart.filter(item => item.productId !== productId);
    setCart(newCart);
    form.setValue('items', newCart.map(({ productId, quantity }) => ({ productId, quantity })));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveProduct(productId);
      return;
    }
    const newCart = cart.map(item => item.productId === productId ? { ...item, quantity } : item);
    setCart(newCart);
    form.setValue('items', newCart.map(({ productId, quantity }) => ({ productId, quantity })));
  };

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cart]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormLabel>Produtos</FormLabel>
          <Select onValueChange={handleAddProduct} disabled={productsLoading}>
            <SelectTrigger>
              <SelectValue placeholder={productsLoading ? "Carregando..." : "Selecione um produto para adicionar"} />
            </SelectTrigger>
            <SelectContent>
              {availableProducts.map(product => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.price))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <FormLabel>Itens do Pedido</FormLabel>
              <ScrollArea className="h-64 rounded-md border p-4">
                {cart.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center">Nenhum item adicionado.</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.productId} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}>
                            {item.quantity === 1 ? <Trash2 className="h-4 w-4 text-destructive" /> : <Minus className="h-4 w-4" />}
                          </Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-xl font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || cart.length === 0}>
          {isLoading ? "Salvando..." : "Salvar Pedido"}
        </Button>
      </form>
    </Form>
  );
}
