import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { subcategories as initialSubcategories, categories, Subcategory } from '@/services/mockData';
import { toast } from '@/hooks/use-toast';

const AdminSubcategories: React.FC = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>(initialSubcategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [formData, setFormData] = useState({ name: '', categoryId: '' });

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubcategory) {
      setSubcategories(subcategories.map(s => 
        s.id === editingSubcategory.id 
          ? { ...s, ...formData, slug: formData.name.toLowerCase().replace(/\s+/g, '-') }
          : s
      ));
      toast({ title: 'Subcategory updated successfully' });
    } else {
      const newSubcategory: Subcategory = {
        id: `sub-${Date.now()}`,
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        categoryId: formData.categoryId
      };
      setSubcategories([...subcategories, newSubcategory]);
      toast({ title: 'Subcategory added successfully' });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setSubcategories(subcategories.filter(s => s.id !== id));
    toast({ title: 'Subcategory deleted successfully' });
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
