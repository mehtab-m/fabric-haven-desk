import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Subcategory, Category } from '@/services/mockData';
import { categoryAPI, subcategoryAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

const AdminSubcategories: React.FC = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [formData, setFormData] = useState({ name: '', categoryId: '' });

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  // Load categories and subcategories from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, subcategoriesData] = await Promise.all([
          categoryAPI.getAll(),
          subcategoryAPI.getAll(),
        ]);

        const mappedCategories = (Array.isArray(categoriesData) ? categoriesData : categoriesData.items || []).map(
          (c: any) =>
            ({
              id: c._id || c.id,
              name: c.name,
              slug: c.slug,
              image: c.image,
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

        setCategories(mappedCategories);
        setSubcategories(mappedSubcategories);
      } catch (error: any) {
        console.error('Failed to load subcategories or categories', error);
        toast({
          title: 'Failed to load subcategories',
          description: error.message,
          variant: 'destructive',
        });
      }
    };

    loadData();
  }, []);

  const openAddModal = () => {
    setEditingSubcategory(null);
    setFormData({ name: '', categoryId: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setFormData({ name: subcategory.name, categoryId: subcategory.categoryId });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSubcategory) {
        const updated = await subcategoryAPI.update(editingSubcategory.id, {
          name: formData.name,
          categoryId: formData.categoryId,
        });

        const updatedSubcategory: Subcategory = {
          id: (updated as any)._id || (updated as any).id,
          name: updated.name,
          slug: updated.slug,
          categoryId: updated.categoryId,
        };

        setSubcategories(subcategories.map((s) => (s.id === editingSubcategory.id ? updatedSubcategory : s)));
        console.log(`hey I am storing subcategory id ${updatedSubcategory.id} for category id ${updatedSubcategory.categoryId}`);
        toast({ title: 'Subcategory updated successfully' });
      } else {
        const created = await subcategoryAPI.create({
          name: formData.name,
          categoryId: formData.categoryId,
        });

        const newSubcategory: Subcategory = {
          id: (created as any)._id || (created as any).id,
          name: created.name,
          slug: created.slug,
          categoryId: created.categoryId,
        };
        console.log(`hey I am storing subcategory id ${newSubcategory.id} for category id ${newSubcategory.categoryId}`);

        setSubcategories([...subcategories, newSubcategory]);
        toast({ title: 'Subcategory added successfully' });
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Failed to save subcategory', error);
      toast({
        title: 'Failed to save subcategory',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await subcategoryAPI.delete(id);
      setSubcategories(subcategories.filter(s => s.id !== id));
      toast({ title: 'Subcategory deleted successfully' });
    } catch (error: any) {
      console.error('Failed to delete subcategory', error);
      toast({
        title: 'Failed to delete subcategory',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Subcategories</h1>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Subcategory
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-elegant overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Name</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Category</th>
              <th className="text-right py-4 px-6 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((subcategory) => (
              <tr key={subcategory.id} className="border-t border-border">
                <td className="py-4 px-6 font-medium">{subcategory.name}</td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 bg-muted rounded-full text-sm">
                    {getCategoryName(subcategory.categoryId)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(subcategory)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(subcategory.id)}>
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
            <DialogTitle>{editingSubcategory ? 'Edit Subcategory' : 'Add Subcategory'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="categoryId">Category</Label>
              <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">{editingSubcategory ? 'Update' : 'Add'} Subcategory</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSubcategories;
