import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { products as initialProducts, categories, subcategories, Product } from '@/services/mockData';
import { toast } from '@/hooks/use-toast';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    subcategoryId: '',
    originalPrice: '',
    discountedPrice: '',
    description: '',
    showOnHomePage: false,
    image: ''
  });

  const getCategoryName = (categoryId: string) => categories.find(c => c.id === categoryId)?.name || 'Unknown';
  const getSubcategoryName = (subcategoryId: string) => subcategories.find(s => s.id === subcategoryId)?.name || 'Unknown';

  const filteredSubcategories = useMemo(() => {
    return subcategories.filter(s => s.categoryId === formData.categoryId);
  }, [formData.categoryId]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '', categoryId: '', subcategoryId: '', originalPrice: '',
      discountedPrice: '', description: '', showOnHomePage: false, image: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      originalPrice: product.originalPrice.toString(),
      discountedPrice: product.discountedPrice.toString(),
      description: product.description,
      showOnHomePage: product.showOnHomePage,
      image: product.images[0]
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      categoryId: formData.categoryId,
      subcategoryId: formData.subcategoryId,
      originalPrice: parseFloat(formData.originalPrice),
      discountedPrice: parseFloat(formData.discountedPrice),
      description: formData.description,
      showOnHomePage: formData.showOnHomePage,
      images: [formData.image || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'],
      inStock: true,
      rating: 4.5,
      reviews: 0
    };

    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...p, ...productData } : p
      ));
      toast({ title: 'Product updated successfully' });
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        ...productData
      };
      setProducts([...products, newProduct]);
      toast({ title: 'Product added successfully' });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast({ title: 'Product deleted successfully' });
  };

  const toggleShowOnHome = (id: string) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, showOnHomePage: !p.showOnHomePage } : p
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Products</h1>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Image</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground hidden lg:table-cell">Category</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Price</th>
                <th className="text-center py-4 px-4 font-medium text-muted-foreground">Home</th>
                <th className="text-right py-4 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-border">
                  <td className="py-3 px-4">
                    <img src={product.images[0]} alt={product.name} className="w-14 h-14 object-cover rounded-lg" />
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium line-clamp-1">{product.name}</p>
                    <p className="text-sm text-muted-foreground lg:hidden">{getCategoryName(product.categoryId)}</p>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm">{getCategoryName(product.categoryId)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium">₨ {product.discountedPrice.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground line-through">₨ {product.originalPrice.toLocaleString()}</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => toggleShowOnHome(product.id)}>
                      {product.showOnHomePage ? (
                        <Eye className="h-5 w-5 text-accent" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <Label>Name</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v, subcategoryId: '' })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subcategory</Label>
                <Select value={formData.subcategoryId} onValueChange={(v) => setFormData({ ...formData, subcategoryId: v })} disabled={!formData.categoryId}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {filteredSubcategories.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Original Price (₨)</Label>
                <Input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} required />
              </div>
              <div>
                <Label>Discounted Price (₨)</Label>
                <Input type="number" value={formData.discountedPrice} onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })} required />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.showOnHomePage} onCheckedChange={(c) => setFormData({ ...formData, showOnHomePage: c })} />
              <Label>Show on Home Page</Label>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">{editingProduct ? 'Update' : 'Add'} Product</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
