import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Product, Category, Subcategory } from '@/services/mockData';
import { categoryAPI, productAPI, subcategoryAPI, uploadAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { getCacheBustedImageUrl, normalizeImageUrls } from '@/lib/imageUtils';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    categoryId: string;
    subcategoryId: string;
    originalPrice: string;
    discountedPrice: string;
    description: string;
    showOnHomePage: boolean;
    images: string[];
  }>({
    name: '',
    categoryId: '',
    subcategoryId: '',
    originalPrice: '',
    discountedPrice: '',
    description: '',
    showOnHomePage: false,
    images: [],
  });
  const [uploading, setUploading] = useState(false);

  const getCategoryName = (categoryId: string) => categories.find(c => c.id === categoryId)?.name || 'Unknown';
  const getSubcategoryName = (subcategoryId: string) => subcategories.find(s => s.id === subcategoryId)?.name || 'Unknown';

  // Load categories, subcategories and products from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, subcategoriesData, productsData] = await Promise.all([
          categoryAPI.getAll(),
          subcategoryAPI.getAll(),
          productAPI.getAll(),
        ]);

        const mappedCategories = (Array.isArray(categoriesData) ? categoriesData : categoriesData.items || []).map(
          (c: any) =>
            ({
              id: c._id || c.id,
              name: c.name,
              slug: c.slug,
              image: c.image || '',
              description: (c as any).description || '',
            } as Category)
        );

        const mappedSubcategories = (Array.isArray(subcategoriesData) ? subcategoriesData : subcategoriesData.items || []).map(
          (s: any) =>
            ({
              id: s._id || s.id,
              categoryId: s.categoryId,
              name: s.name,
              slug: s.slug,
            } as Subcategory)
        );

        const items = Array.isArray(productsData) ? productsData : productsData.items || [];
        const mappedProducts: Product[] = items.map((p: any) => ({
          id: p.id || p._id,
          name: p.title || p.name,
          categoryId: p.categoryId,
          subcategoryId: p.subcategoryId,
          originalPrice: p.price || p.originalPrice,
          discountedPrice: p.price || p.discountedPrice || p.price,
          showOnHomePage: p.showOnHomePage || false,
          // Step 2: Normalize all product images from backend before using them anywhere in the admin UI.
          images: p.images && p.images.length > 0 ? normalizeImageUrls(p.images) : ['https://via.placeholder.com/300'],
          description: p.description,
          inStock: (p.stock || 0) > 0,
          rating: p.rating || 0,
          reviews: p.reviews || 0,
        }));

        setCategories(mappedCategories);
        setSubcategories(mappedSubcategories);
        setProducts(mappedProducts);
      } catch (error: any) {
        console.error('Failed to load products/categories', error);
        toast({
          title: 'Failed to load products',
          description: error.message,
          variant: 'destructive',
        });
      }
    };

    loadData();
  }, []);

  const filteredSubcategories = useMemo(() => {
    return subcategories.filter(s => s.categoryId === formData.categoryId);
  }, [formData.categoryId]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      categoryId: '',
      subcategoryId: '',
      originalPrice: '',
      discountedPrice: '',
      description: '',
      showOnHomePage: false,
      images: [],
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
      images: product.images || [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const baseData = {
      title: formData.name,
      price: parseFloat(formData.discountedPrice || formData.originalPrice),
      categoryId: formData.categoryId,
      subcategoryId: formData.subcategoryId,
      images: formData.images.length
        ? formData.images
        : ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'],
      description: formData.description,
      stock: 100,
    };

    try {
      if (editingProduct) {
        const updated = await productAPI.update(editingProduct.id, baseData);
        const mapped: Product = {
          id: updated.id || updated._id,
          name: updated.title || updated.name,
          categoryId: updated.categoryId,
          subcategoryId: updated.subcategoryId,
          originalPrice: updated.price,
          discountedPrice: updated.price,
          showOnHomePage: editingProduct.showOnHomePage,
          images: updated.images || formData.images,
          description: updated.description,
          inStock: (updated.stock || 0) > 0,
          rating: editingProduct.rating,
          reviews: editingProduct.reviews,
        };
        setProducts(products.map(p => (p.id === editingProduct.id ? mapped : p)));
        toast({ title: 'Product updated successfully' });
      } else {
        const created = await productAPI.create(baseData);
        const newProduct: Product = {
          id: created.id || created._id,
          name: created.title || created.name,
          categoryId: created.categoryId,
          subcategoryId: created.subcategoryId,
          originalPrice: created.price,
          discountedPrice: created.price,
          showOnHomePage: formData.showOnHomePage,
          images: created.images || formData.images,
          description: created.description,
          inStock: (created.stock || 0) > 0,
          rating: 0,
          reviews: 0,
        };
        setProducts([...products, newProduct]);
        toast({ title: 'Product added successfully' });
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Failed to save product', error);
      toast({
        title: 'Failed to save product',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    try {
      setUploading(true);
      const uploadPromises = files.map((file) => uploadAPI.image(file));
      const results = await Promise.all(uploadPromises);
      const urls = results.map((r) => r.url);

      setFormData((prev) => {
        const combined = [...prev.images, ...urls];
        // Limit to max 5 images
        const limited = combined.slice(0, 5);
        return { ...prev, images: limited };
      });

      toast({ title: 'Images uploaded successfully' });
    } catch (error: any) {
      console.error('Image upload failed', error);
      toast({
        title: 'Image upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await productAPI.delete(id);
      setProducts(products.filter(p => p.id !== id));
      toast({ title: 'Product deleted successfully' });
    } catch (error: any) {
      console.error('Failed to delete product', error);
      toast({
        title: 'Failed to delete product',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const toggleShowOnHome = async (id: string) => {
    const current = products.find((p) => p.id === id);
    if (!current) return;

    const next = !current.showOnHomePage;
    try {
      await productAPI.update(id, { showOnHomePage: next });
      setProducts(products.map(p => (p.id === id ? { ...p, showOnHomePage: next } : p)));
    } catch (error: any) {
      console.error('Failed to toggle show on home', error);
      toast({
        title: 'Failed to update product',
        description: error.message,
        variant: 'destructive',
      });
    }
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
                    <img src={getCacheBustedImageUrl(product.images[0])} alt={product.name} className="w-14 h-14 object-cover rounded-lg" />
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
            <div className="space-y-2">
              <Label>Product Images (up to 5)</Label>
              <Input type="file" accept="image/*" multiple onChange={handleImagesChange} />
              {uploading && (
                <p className="text-xs text-muted-foreground">Uploading images...</p>
              )}
              {!uploading && formData.images.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={getCacheBustedImageUrl(img)}
                      alt={`Preview ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                  ))}
                </div>
              )}
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
