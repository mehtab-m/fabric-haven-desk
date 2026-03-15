import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Category } from '@/services/mockData';
import { categoryAPI, uploadAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { getCacheBustedImageUrl } from '@/lib/imageUtils';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [uploading, setUploading] = useState(false);

  // Load categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryAPI.getAll();
        const mapped = (data as any[]).map((c) => ({
          id: c._id || c.id,
          name: c.name,
          slug: c.slug,
          image: c.image || '',
          description: (c as any).description || '',
        })) as Category[];
        setCategories(mapped);
      } catch (error: any) {
        console.error('Failed to load categories', error);
        toast({ title: 'Failed to load categories', description: error.message, variant: 'destructive' });
      }
    };

    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description, image: category.image });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const updated = await categoryAPI.update(editingCategory.id, {
          name: formData.name,
          image: formData.image,
          description: formData.description,
        });

        const updatedCategory: Category = {
          id: (updated as any)._id || (updated as any).id,
          name: updated.name,
          slug: updated.slug,
          image: formData.image || updated.image,
          description: (updated as any).description || '',
        };

        setCategories(categories.map((c) => (c.id === editingCategory.id ? updatedCategory : c)));
        toast({ title: 'Category updated successfully' });
      } else {
        const created = await categoryAPI.create({
          name: formData.name,
          image: formData.image,
          description: formData.description,
        });

        const newCategory: Category = {
          id: (created as any)._id || (created as any).id,
          name: created.name,
          slug: created.slug,
          description: formData.description,
          image: formData.image,
        };

        setCategories([...categories, newCategory]);
        toast({ title: 'Category added successfully' });
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Failed to save category', error);
      toast({ title: 'Failed to save category', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryAPI.delete(id);
      setCategories(categories.filter(c => c.id !== id));
      toast({ title: 'Category deleted successfully' });
    } catch (error: any) {
      console.error('Failed to delete category', error);
      toast({ title: 'Failed to delete category', description: error.message, variant: 'destructive' });
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadAPI.image(file);
      setFormData((prev) => ({ ...prev, image: result.url }));
      toast({ title: 'Image uploaded successfully' });
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Categories</h1>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-elegant overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Image</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Name</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground hidden md:table-cell">Description</th>
              <th className="text-right py-4 px-6 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t border-border">
                <td className="py-4 px-6">
                  <img src={getCacheBustedImageUrl(category.image)} alt={category.name} className="w-16 h-12 object-cover rounded-lg" />
                </td>
                <td className="py-4 px-6 font-medium">{category.name}</td>
                <td className="py-4 px-6 text-muted-foreground hidden md:table-cell">
                  <span className="line-clamp-2">{category.description}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
           
            <div className="space-y-2">
              <Label htmlFor="image">Category Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {uploading && (
                <p className="text-xs text-muted-foreground">Uploading image...</p>
              )}
              {formData.image && !uploading && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                  <img
                    src={getCacheBustedImageUrl(formData.image)}
                    alt="Preview"
                    className="w-24 h-16 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">{editingCategory ? 'Update' : 'Add'} Category</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
